import { useConfig } from '../../contexts/ConfigContext';

export const Viewer2D = () => {
    const { config } = useConfig();
    const { height, width, levels } = config;

    // Scaling factor: map real cm to SVG pixels
    // Max height 500cm, Max width 220cm.
    // ViewBox should cover the shelf extent + margins.
    const padding = 50;
    const viewBoxWidth = width + padding * 2;
    const viewBoxHeight = height + padding * 2;

    // Upright width (visual)
    const uprightWidth = 8;
    const beamHeight = 6;

    return (
        <div className="flex flex-col items-center justify-center h-full w-full p-4">
            <div className="bg-white p-4 shadow-sm border rounded-lg">
                <svg
                    width="100%"
                    height="100%"
                    viewBox={`-${padding} -${padding} ${viewBoxWidth} ${viewBoxHeight}`}
                    className="max-h-[600px] max-w-[800px] overflow-visible"
                >
                    {/* Ground Line */}
                    <line
                        x1={-padding}
                        y1={height}
                        x2={width + padding}
                        y2={height}
                        stroke="#9ca3af"
                        strokeWidth="2"
                    />

                    {/* Left Upright */}
                    <rect
                        x={0}
                        y={0}
                        width={uprightWidth}
                        height={height}
                        fill="#1e293b" // slate-800
                    />

                    {/* Right Upright */}
                    <rect
                        x={width - uprightWidth}
                        y={0}
                        width={uprightWidth}
                        height={height}
                        fill="#1e293b"
                    />

                    {/* Levels (Beams/Shelves) */}
                    {levels.map((level) => {
                        // Elevation is from ground up. SVG y is from top down.
                        const y = height - level.elevation;
                        return (
                            <g key={level.id}>
                                {/* Beam */}
                                <rect
                                    x={uprightWidth}
                                    y={y}
                                    width={width - 2 * uprightWidth}
                                    height={beamHeight}
                                    fill="#f97316" // orange-500
                                    rx="2"
                                />

                                {/* Shelf Top (visualizing thickness based on type?) */}
                                <rect
                                    x={uprightWidth}
                                    y={y - 2}
                                    width={width - 2 * uprightWidth}
                                    height={2}
                                    fill="#cbd5e1" // slate-300
                                />

                                {/* Level Label */}
                                <text
                                    x={width + 15}
                                    y={y + 5}
                                    className="text-[10px] fill-gray-500 font-mono"
                                    dominantBaseline="middle"
                                >
                                    {level.elevation} cm
                                </text>

                                {/* Material Label, centered on shelf */}
                                <text
                                    x={width / 2}
                                    y={y + beamHeight + 12}
                                    className="text-[10px] fill-gray-400 text-center"
                                    textAnchor="middle"
                                >
                                    {level.material}
                                </text>
                            </g>
                        );
                    })}

                    {/* Dimensions Lines */}

                    {/* Width Dimension */}
                    <line x1={0} y1={height + 20} x2={width} y2={height + 20} stroke="#374151" markerEnd="url(#arrow)" markerStart="url(#arrow)" />
                    <text x={width / 2} y={height + 35} textAnchor="middle" className="text-xs fill-gray-700 font-bold">{width} cm</text>

                    {/* Height Dimension */}
                    <line x1={-20} y1={0} x2={-20} y2={height} stroke="#374151" />
                    <text x={-25} y={height / 2} textAnchor="end" className="text-xs fill-gray-700 font-bold" style={{ transform: `rotate(-90deg)`, transformOrigin: `${-25}px ${height / 2}px` }}>{height} cm</text>

                </svg>
            </div>
            <div className="mt-4 text-sm text-gray-500">Vista Alzado Frontal</div>
        </div>
    );
};
