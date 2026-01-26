import { useConfig } from '../../contexts/ConfigContext';

export const Viewer2D = () => {
    const { config } = useConfig();
    const { height, modules } = config;

    // Calculate total width for viewBox
    // Initial upright + (Width + Upright) * N
    const uprightWidth = 8;
    const beamHeight = 6;

    const totalWidth = modules.reduce((acc, m) => acc + m.width + uprightWidth, 0) + uprightWidth; // Wait.
    // Logic: Upright | Module 1 | Upright | Module 2 | Upright
    // Width = Upright + Width1 + Upright + Width2 + Upright
    // acc starts at UPRIGHT_WIDTH (leftmost).
    // Loop adds: Width + Upright.
    // So: UPRIGHT + (W1 + UPRIGHT) + (W2 + UPRIGHT)... Correct.

    // Actually, let's just sum widths and add (N+1)*Upright
    const totalModuleWidth = modules.reduce((acc, m) => acc + m.width, 0);
    const totalUprightsWidth = (modules.length + 1) * uprightWidth;
    const rackTotalWidth = totalModuleWidth + totalUprightsWidth;

    const padding = 50;
    const viewBoxWidth = rackTotalWidth + padding * 2;
    const viewBoxHeight = height + padding * 2;

    let currentX = uprightWidth; // Start after first upright

    return (
        <div className="flex flex-col items-center justify-center h-full w-full p-4 overflow-hidden">
            <div className="bg-white p-4 shadow-sm border rounded-lg w-full h-full flex items-center justify-center">
                <svg
                    width="100%"
                    height="100%"
                    viewBox={`-${padding} -${padding} ${viewBoxWidth} ${viewBoxHeight}`}
                    className="overflow-visible"
                    preserveAspectRatio="xMidYMid meet"
                >
                    {/* Ground Line */}
                    <line
                        x1={-padding}
                        y1={height}
                        x2={rackTotalWidth + padding}
                        y2={height}
                        stroke="#9ca3af"
                        strokeWidth="2"
                    />

                    {/* Leftmost Upright */}
                    <rect
                        x={0}
                        y={0}
                        width={uprightWidth}
                        height={height}
                        fill="#1e293b"
                    />

                    {modules.map((module, mIndex) => {
                        const moduleStartX = currentX;
                        const moduleEndX = moduleStartX + module.width;

                        const moduleRender = (
                            <g key={module.id}>
                                {/* Levels */}
                                {module.levels.map((level) => {
                                    const y = height - level.elevation;
                                    return (
                                        <g key={level.id}>
                                            {/* Beam */}
                                            <rect
                                                x={moduleStartX}
                                                y={y}
                                                width={module.width}
                                                height={beamHeight}
                                                fill="#f97316"
                                                rx="2"
                                            />
                                            {/* Shelf Top */}
                                            <rect
                                                x={moduleStartX}
                                                y={y - 2}
                                                width={module.width}
                                                height={2}
                                                fill="#cbd5e1"
                                            />

                                            {/* Level Label (Only for first module to avoid clutter? Or all?) */}
                                            {/* Let's show for all but maybe alternating or just small */}
                                            <text
                                                x={moduleCenterX(moduleStartX, module.width)}
                                                y={y + beamHeight + 12}
                                                className="text-[8px] fill-gray-400 text-center"
                                                textAnchor="middle"
                                            >
                                                {level.material}
                                            </text>

                                            <text
                                                x={moduleEndX - 5}
                                                y={y + 5}
                                                className="text-[8px] fill-gray-500 font-mono text-right"
                                                dominantBaseline="middle"
                                            >
                                                {level.elevation}
                                            </text>
                                        </g>
                                    );
                                })}

                                {/* Right Upright for this module */}
                                <rect
                                    x={moduleEndX}
                                    y={0}
                                    width={uprightWidth}
                                    height={height}
                                    fill="#1e293b"
                                />

                                {/* Width Dimension */}
                                <line
                                    x1={moduleStartX}
                                    y1={height + 20 + (mIndex % 2) * 15}
                                    x2={moduleEndX}
                                    y2={height + 20 + (mIndex % 2) * 15}
                                    stroke="#374151"
                                    strokeWidth="1"
                                />
                                <text
                                    x={moduleCenterX(moduleStartX, module.width)}
                                    y={height + 32 + (mIndex % 2) * 15}
                                    textAnchor="middle"
                                    className="text-[10px] fill-gray-700 font-bold"
                                >
                                    {module.width} cm
                                </text>
                            </g>
                        );

                        currentX += module.width + uprightWidth;
                        return moduleRender;
                    })}

                    {/* Height Dimension (Left side) */}
                    <line x1={-20} y1={0} x2={-20} y2={height} stroke="#374151" />
                    <text x={-25} y={height / 2} textAnchor="end" className="text-xs fill-gray-700 font-bold" style={{ transform: `rotate(-90deg)`, transformOrigin: `${-25}px ${height / 2}px` }}>{height} cm</text>

                </svg>
            </div>
            <div className="mt-4 text-sm text-gray-500">Vista Alzado Frontal (Sistema Completo)</div>
        </div>
    );
};

const moduleCenterX = (start: number, width: number) => start + width / 2;
