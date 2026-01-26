import { useState, useCallback } from 'react';
import type { ShelfConfig, ShelfLevel, ShelfModule } from '../types';
import { DIMENSION_LIMITS } from '../lib/constants';

const createDefaultLevels = (height: number): ShelfLevel[] => [
    { id: crypto.randomUUID(), elevation: 20, material: 'Wood' },
    { id: crypto.randomUUID(), elevation: Math.min(height - 20, 100), material: 'Wood' },
    { id: crypto.randomUUID(), elevation: Math.min(height - 20, 180), material: 'Wood' },
];

const createModule = (height: number): ShelfModule => ({
    id: crypto.randomUUID(),
    width: 150,
    levels: createDefaultLevels(height)
});

const DEFAULT_CONFIG: ShelfConfig = {
    height: 200,
    depth: 60,
    modules: [createModule(200)]
};

export const useShelvingConfig = () => {
    const [config, setConfig] = useState<ShelfConfig>(DEFAULT_CONFIG);
    const [activeModuleId, setActiveModuleId] = useState<string>(config.modules[0].id);

    // Update Global Dimensions
    const updateGlobalDimensions = useCallback((dims: Partial<Pick<ShelfConfig, 'height' | 'depth'>>) => {
        setConfig(prev => ({ ...prev, ...dims }));
    }, []);

    // Module Management
    const addModule = useCallback(() => {
        setConfig(prev => {
            if (prev.modules.length >= 5) return prev; // Max 5 modules request
            const newModule = createModule(prev.height);
            return { ...prev, modules: [...prev.modules, newModule] };
        });
    }, []);

    const removeModule = useCallback((id: string) => {
        setConfig(prev => {
            if (prev.modules.length <= 1) return prev; // Keep at least one
            const newModules = prev.modules.filter(m => m.id !== id);
            // If active was removed, switch active
            if (id === activeModuleId) {
                setActiveModuleId(newModules[0].id);
            }
            return { ...prev, modules: newModules };
        });
    }, [activeModuleId]);

    const updateModule = useCallback((moduleId: string, updates: Partial<Pick<ShelfModule, 'width'>>) => {
        setConfig(prev => ({
            ...prev,
            modules: prev.modules.map(m => m.id === moduleId ? { ...m, ...updates } : m)
        }));
    }, []);

    // Level Management (Targeting Active Module or specific module)
    const addLevel = useCallback((moduleId: string) => {
        setConfig(prev => {
            const module = prev.modules.find(m => m.id === moduleId);
            if (!module || module.levels.length >= DIMENSION_LIMITS.maxLevels) return prev;

            // Smart Placement Logic (reused)
            const sortedLevels = [...module.levels].sort((a, b) => a.elevation - b.elevation);
            let maxGapSize = 0;
            let insertElevation = prev.height / 2;

            if (sortedLevels.length > 0) {
                const firstGap = sortedLevels[0].elevation;
                if (firstGap > maxGapSize) { maxGapSize = firstGap; insertElevation = firstGap / 2; }
            } else {
                insertElevation = 20; maxGapSize = Infinity;
            }

            for (let i = 0; i < sortedLevels.length - 1; i++) {
                const gap = sortedLevels[i + 1].elevation - sortedLevels[i].elevation;
                if (gap > maxGapSize) { maxGapSize = gap; insertElevation = sortedLevels[i].elevation + gap / 2; }
            }

            if (sortedLevels.length > 0) {
                const lastLevel = sortedLevels[sortedLevels.length - 1];
                const lastGap = prev.height - lastLevel.elevation;
                if (lastGap > maxGapSize) { maxGapSize = lastGap; insertElevation = lastLevel.elevation + lastGap / 2; }
            }

            if (insertElevation < 0) insertElevation = 10;
            if (insertElevation > prev.height) insertElevation = prev.height - 10;
            insertElevation = Math.round(insertElevation);

            const newLevel: ShelfLevel = {
                id: crypto.randomUUID(),
                elevation: insertElevation,
                material: 'Wood'
            };

            const newLevels = [...module.levels, newLevel].sort((a, b) => a.elevation - b.elevation);

            return {
                ...prev,
                modules: prev.modules.map(m => m.id === moduleId ? { ...m, levels: newLevels } : m)
            };
        });
    }, []);

    const removeLevel = useCallback((moduleId: string, levelId: string) => {
        setConfig(prev => {
            const module = prev.modules.find(m => m.id === moduleId);
            if (!module || module.levels.length <= DIMENSION_LIMITS.minLevels) return prev;

            return {
                ...prev,
                modules: prev.modules.map(m => m.id === moduleId ? {
                    ...m,
                    levels: m.levels.filter(l => l.id !== levelId)
                } : m)
            };
        });
    }, []);

    const updateLevel = useCallback((moduleId: string, levelId: string, updates: Partial<ShelfLevel>) => {
        setConfig(prev => ({
            ...prev,
            modules: prev.modules.map(m => m.id === moduleId ? {
                ...m,
                levels: m.levels.map(l => l.id === levelId ? { ...l, ...updates } : l)
            } : m)
        }));
    }, []);

    const resetConfig = useCallback(() => {
        setConfig(DEFAULT_CONFIG);
        setActiveModuleId(DEFAULT_CONFIG.modules[0].id);
    }, []);

    return {
        config,
        activeModuleId,
        setActiveModuleId,
        updateGlobalDimensions,
        addModule,
        removeModule,
        updateModule,
        addLevel,
        removeLevel,
        updateLevel,
        resetConfig
    };
};
