import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Grid, GizmoHelper, GizmoViewport } from '@react-three/drei';
import { useConfig } from '../../contexts/ConfigContext';
import type { MaterialType } from '../../types';

// Constants for component dimensions (cm)
const UPRIGHT_WIDTH = 8;
const UPRIGHT_DEPTH = 8;
const BEAM_HEIGHT = 6;
const BEAM_DEPTH = 4;

const Shelf = ({ width, depth, y, material }: { width: number, depth: number, y: number, material: MaterialType }) => {
    // Material Colors
    const colors: Record<MaterialType, string> = {
        None: 'transparent',
        Wood: '#eab308', // yellow-500
        Steel: '#94a3b8', // slate-400
        Grid: '#3b82f6', // blue-500
        Multiplex: '#a16207', // yellow-700
        Angled: '#ef4444', // red-500
    };

    if (material === 'None') return null;

    return (
        <mesh position={[0, y + 1, 0]} castShadow receiveShadow>
            <boxGeometry args={[width, 2, depth]} />
            <meshStandardMaterial color={colors[material]} />
        </mesh>
    );
};

const Upright = ({ height, x, z }: { height: number, x: number, z: number }) => {
    return (
        <mesh position={[x, height / 2, z]} castShadow receiveShadow>
            <boxGeometry args={[UPRIGHT_WIDTH, height, UPRIGHT_DEPTH]} />
            <meshStandardMaterial color="#1e293b" />
        </mesh>
    );
};

const Beam = ({ width, y, z }: { width: number, y: number, z: number }) => {
    return (
        <mesh position={[0, y - BEAM_HEIGHT / 2, z]} castShadow receiveShadow>
            <boxGeometry args={[width, BEAM_HEIGHT, BEAM_DEPTH]} />
            <meshStandardMaterial color="#f97316" />
        </mesh>
    );
};

const RackModel = () => {
    const { config } = useConfig();
    const { height, depth, modules } = config;

    // We render modules sequentially along the X axis.
    // Module 1 starts at 0.
    // Module 2 starts at Module 1 Width + Upright Thickness.

    // Shared Upright Logic:
    // A standalone bay has 2 uprights (Left, Right).
    // A connected bay has 1 upright (Right), sharing the Left one.
    // Or we just place uprights at the boundaries.
    // Frame at X=0.
    // Frame at X=Width1.
    // Frame at X=Width1+Width2.
    // etc.
    // Actually, Width usually means center-to-center or clear span.
    // Let's assume 'width' is the clear span (shelf width).
    // So Uprights are between shelves.
    // Frame 0 at X=0
    // Frame 1 at X=Width1 + UPRIGHT_WIDTH
    // Frame 2 at X=Width1 + UPRIGHT_WIDTH + Width2 + UPRIGHT_WIDTH
    // ...
    // Wait, let's simplify coordinates.
    // Start X = 0.
    // Render Left Upright at 0.
    // Render Shelves starting at UPRIGHT_WIDTH?
    // If we assume coordinates center at 0:
    // Let's build from left to right starting at 0.

    let currentX = 0;

    return (
        <group position={[0, 0, 0]}>
            {/* Initial Left Frame */}
            <group position={[currentX, 0, 0]}>
                <Upright height={height} x={-UPRIGHT_WIDTH / 2} z={depth / 2} />
                <Upright height={height} x={-UPRIGHT_WIDTH / 2} z={-depth / 2} />
            </group>

            {modules.map((module, index) => {
                const { width, levels } = module;

                // Shelf center relative to module start
                // Module start is at currentX (which is the center of the left upright of this module)
                // Shelves start at currentX + UPRIGHT_WIDTH/2 ? No, clear span.
                // If Left Upright is at currentX.
                // Shelf starts at currentX + UPRIGHT_WIDTH/2?
                // Let's assume standard shelving: Uprights have width.
                // Space between uprights is `width`.
                // So Right Upright is at currentX + UPRIGHT_WIDTH/2 + width + UPRIGHT_WIDTH/2?
                // = currentX + width + UPRIGHT_WIDTH.

                const moduleCenterX = currentX + width / 2;

                // Render Levels
                const levelsRender = levels.map(level => {
                    const y = level.elevation;
                    return (
                        <group key={level.id}>
                            {/* Front Beam */}
                            <Beam width={width} y={y} z={depth / 2} />
                            {/* Back Beam */}
                            <Beam width={width} y={y} z={-depth / 2} />

                            {/* Shelf Surface */}
                            <Shelf
                                width={width}
                                depth={depth}
                                y={y}
                                material={level.material}
                            />

                            {/* Supports */}
                            {depth >= 60 && (
                                <>
                                    <mesh position={[width / 3 - width / 2, y, 0]}>
                                        <boxGeometry args={[2, 4, depth]} />
                                        <meshStandardMaterial color="#cbd5e1" />
                                    </mesh>
                                    <mesh position={[2 * width / 3 - width / 2, y, 0]}>
                                        <boxGeometry args={[2, 4, depth]} />
                                        <meshStandardMaterial color="#cbd5e1" />
                                    </mesh>
                                </>
                            )}
                        </group>
                    );
                });

                // Render Right Frame for this module (which acts as Left Frame for next)
                const rightFrameX = currentX + width + UPRIGHT_WIDTH;

                const moduleRender = (
                    <group key={module.id} position={[0, 0, 0]}>
                        {/* Translate content to module location */}
                        <group position={[moduleCenterX, 0, 0]}>
                            {levelsRender}
                        </group>

                        {/* Right Upright */}
                        <group position={[rightFrameX, 0, 0]}>
                            <Upright height={height} x={-UPRIGHT_WIDTH / 2} z={depth / 2} />
                            <Upright height={height} x={-UPRIGHT_WIDTH / 2} z={-depth / 2} />
                        </group>
                    </group>
                );

                // Advance X
                currentX += width + UPRIGHT_WIDTH;

                return moduleRender;
            })}
        </group>
    );
}

export const Viewer3D = () => {
    return (
        <div className="h-full w-full bg-gray-100">
            <Canvas shadows camera={{ position: [500, 400, 500], fov: 50, far: 20000 }} gl={{ preserveDrawingBuffer: true }}>
                <Suspense fallback={null}>
                    <Stage environment="city" intensity={0.5} adjustCamera={false}>
                        <RackModel />
                    </Stage>
                    <Grid
                        renderOrder={-1}
                        position={[0, 0, 0]}
                        infiniteGrid
                        cellSize={50}
                        sectionSize={100}
                        fadeDistance={5000}
                        cellColor="#cbd5e1"
                        sectionColor="#64748b"
                    />
                    <OrbitControls makeDefault maxDistance={5000} minDistance={50} />
                </Suspense>

                <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
                    <GizmoViewport axisColors={['#9d4b4b', '#2f7f4f', '#3b5b9d']} labelColor="white" />
                </GizmoHelper>
            </Canvas>
        </div>
    );
};
