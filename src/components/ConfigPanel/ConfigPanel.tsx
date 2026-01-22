
import { useConfig } from '../../contexts/ConfigContext';
import { Input, Select, Button } from '../ui';
import { DIMENSION_LIMITS, VALID_DEPTHS, SHELF_MATERIALS } from '../../lib/constants';
import { Trash2, Plus } from 'lucide-react';

export const ConfigPanel = () => {
    const { config, updateDimensions, addLevel, removeLevel, updateLevel, pricing } = useConfig();

    return (
        <div className="space-y-8 pb-20">
            {/* Dimensions */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Dimensiones Generales</h3>

                <Input
                    label="Altura (cm)"
                    type="number"
                    min={DIMENSION_LIMITS.minHeight}
                    max={DIMENSION_LIMITS.maxHeight}
                    value={config.height}
                    onChange={(e) => updateDimensions({ height: Number(e.target.value) })}
                />

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Anchura ({config.width} cm)</label>
                    <input
                        type="range"
                        min={DIMENSION_LIMITS.minWidth}
                        max={DIMENSION_LIMITS.maxWidth}
                        value={config.width}
                        onChange={(e) => updateDimensions({ width: Number(e.target.value) })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>{DIMENSION_LIMITS.minWidth} cm</span>
                        <span>{DIMENSION_LIMITS.maxWidth} cm</span>
                    </div>
                </div>

                <Select
                    label="Profundidad (cm)"
                    value={config.depth}
                    onChange={(e) => updateDimensions({ depth: Number(e.target.value) })}
                >
                    {VALID_DEPTHS.map(d => (
                        <option key={d} value={d}>{d} cm</option>
                    ))}
                </Select>
            </div>

            {/* Levels */}
            <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="text-sm font-semibold text-gray-900">Niveles ({config.levels.length})</h3>
                    <Button size="sm" variant="ghost" onClick={addLevel} disabled={config.levels.length >= DIMENSION_LIMITS.maxLevels}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>

                <div className="space-y-3">
                    {config.levels.map((level, index) => (
                        <div key={level.id} className="p-3 bg-gray-50 rounded-md border border-gray-200 text-sm">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-700">Nivel {index + 1}</span>
                                <button
                                    onClick={() => removeLevel(level.id)}
                                    disabled={config.levels.length <= DIMENSION_LIMITS.minLevels}
                                    className="text-gray-400 hover:text-red-500 disabled:opacity-30"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-xs text-gray-500">Altura (cm)</label>
                                    <input
                                        type="number"
                                        value={level.elevation}
                                        onChange={(e) => updateLevel(level.id, { elevation: Number(e.target.value) })}
                                        className="w-full text-xs p-1 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Tipo</label>
                                    <select
                                        value={level.material}
                                        onChange={(e) => updateLevel(level.id, { material: e.target.value as any })}
                                        className="w-full text-xs p-1 border rounded"
                                    >
                                        {SHELF_MATERIALS.map(m => (
                                            <option key={m.id} value={m.id}>{m.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Price Footer */}
            <div className="fixed bottom-0 left-0 w-80 bg-white border-t p-4 shadow-lg z-20">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-sm text-gray-500">Precio Total</span>
                    <span className="text-2xl font-bold text-brand-blue">€{pricing.total}</span>
                </div>
                <div className="text-xs text-gray-400">
                    IVA no incluido
                </div>
            </div>
        </div>
    );
};
