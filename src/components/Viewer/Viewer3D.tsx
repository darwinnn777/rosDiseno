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
        <mesh position={[width / 2, y + 1, depth / 2]} castShadow receiveShadow>
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
        <mesh position={[width / 2, y - BEAM_HEIGHT / 2, z]} castShadow receiveShadow>
            <boxGeometry args={[width, BEAM_HEIGHT, BEAM_DEPTH]} />
            <meshStandardMaterial color="#f97316" />
        </mesh>
    );
};

const RackModel = () => {
    const { config } = useConfig();
    const { height, width, depth, levels } = config;

    // Calculate component positions
    // Width is total width? Or center to center?
    // Let's assume Width means outer dimension for simplicity, or usable width.
    // User spec: 110-220 cm. Probably usable width or outer.
    // If we assume "width between uprights" as inner width, then total width is width + 2*UPRIGHT_WIDTH.
    // Let's assume `width` is the inner usable width, which is standard for shelves.
    // So Uprights are at x = -UPRIGHT_WIDTH/2 and x = width + UPRIGHT_WIDTH/2 ?
    // Let's place Left Upright at x=0 (centered at 0?)
    // Let's center the whole rack at (0,0,0) usually.
    // But `Viewer2D` assumed 0 to width.
    // Let's stick to 0 to width as usable space.
    // Left Upright center: -UPRIGHT_WIDTH/2
    // Right Upright center: width + UPRIGHT_WIDTH/2

    const leftX = -UPRIGHT_WIDTH / 2;
    const rightX = width + UPRIGHT_WIDTH / 2;

    // Depth: Uprights are at z=0 and z=depth? Or depth is total depth.
    // Usually depth is frame depth.
    // Front Upright Z: depth/2
    // Back Upright Z: -depth/2
    // We need 4 uprights for a standalone bay.
    // wait, "Bastidores" (Frames) consist of 2 uprights + bracing.
    // So we need 2 Frames (Left and Right).
    // Left Frame: Upright at (leftX, front), Upright at (leftX, back).

    const frontZ = depth / 2;
    const backZ = -depth / 2;

    return (
        <group position={[0, 0, 0]}>
            {/* Left Frame */}
            <Upright height={height} x={leftX} z={frontZ} />
            <Upright height={height} x={leftX} z={backZ} />
            {/* TODO: Diagonal bracing for frame */}

            {/* Right Frame */}
            <Upright height={height} x={rightX} z={frontZ} />
            <Upright height={height} x={rightX} z={backZ} />

            {/* Levels */}
            {levels.map((level) => {
                const y = level.elevation;
                // Beams connect front-left to front-right, and back-left to back-right
                return (
                    <group key={level.id}>
                        {/* Front Beam */}
                        <Beam width={width} y={y} z={frontZ} />
                        {/* Back Beam */}
                        <Beam width={width} y={y} z={backZ} />

                        {/* Shelf Surface */}
                        <Shelf
                            width={width}
                            depth={depth} // Spans full depth? Usually sits on beams.
                            y={y} // Sits on top of beam? Beam y is center of beam. Level elevation is top of beam usually.
                            // If elevation is top of beam, then beam is at y - height/2.
                            // Shelf sits at y + thickness/2.
                            material={level.material}
                        />

                        {/* Supports (Puntales) - cross bars under shelf */}
                        {depth >= 60 && (
                            <>
                                <mesh position={[width / 3, y, 0]}>
                                    <boxGeometry args={[2, 4, depth]} />
                                    <meshStandardMaterial color="#cbd5e1" />
                                </mesh>
                                <mesh position={[2 * width / 3, y, 0]}>
                                    <boxGeometry args={[2, 4, depth]} />
                                    <meshStandardMaterial color="#cbd5e1" />
                                </mesh>
                            </>
                        )}
                    </group>
                )
            })}
        </group>
    );
}

export const Viewer3D = () => {
    return (
        <div className="h-full w-full bg-gray-100">
            <Canvas shadows camera={{ position: [200, 200, 200], fov: 50 }} gl={{ preserveDrawingBuffer: true }}>
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
                        fadeDistance={1000}
                        cellColor="#cbd5e1"
                        sectionColor="#64748b"
                    />
                    <OrbitControls makeDefault />
                </Suspense>

                <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
                    <GizmoViewport axisColors={['#9d4b4b', '#2f7f4f', '#3b5b9d']} labelColor="white" />
                </GizmoHelper>
            </Canvas>
        </div>
    );
};
