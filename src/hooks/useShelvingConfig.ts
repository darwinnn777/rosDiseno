import { useState, useCallback } from 'react';
import type { ShelfConfig, ShelfLevel } from '../types';
import { DIMENSION_LIMITS } from '../lib/constants';

const DEFAULT_CONFIG: ShelfConfig = {
    height: 200,
    width: 150,
    depth: 60,
    levels: [
        { id: '1', elevation: 20, material: 'Wood' },
        { id: '2', elevation: 100, material: 'Wood' },
        { id: '3', elevation: 180, material: 'Wood' },
    ]
};

export const useShelvingConfig = () => {
    const [config, setConfig] = useState<ShelfConfig>(DEFAULT_CONFIG);

    const updateDimensions = useCallback((dims: Partial<Pick<ShelfConfig, 'height' | 'width' | 'depth'>>) => {
        setConfig(prev => ({ ...prev, ...dims }));
    }, []);

    const addLevel = useCallback(() => {
        setConfig(prev => {
            if (prev.levels.length >= DIMENSION_LIMITS.maxLevels) return prev;

            // Auto-calculate position: halfway between top and last level?
            // Or just append at top?
            // Simple logic: Add at top - 20cm
            const newLevel: ShelfLevel = {
                id: crypto.randomUUID(),
                elevation: prev.height - 20,
                material: 'Wood'
            };

            // Sort layers by elevation
            const newLevels = [...prev.levels, newLevel].sort((a, b) => a.elevation - b.elevation);
            return { ...prev, levels: newLevels };
        });
    }, []);

    const removeLevel = useCallback((id: string) => {
        setConfig(prev => {
            if (prev.levels.length <= DIMENSION_LIMITS.minLevels) return prev;
            return { ...prev, levels: prev.levels.filter(l => l.id !== id) };
        });
    }, []);

    const updateLevel = useCallback((id: string, updates: Partial<ShelfLevel>) => {
        setConfig(prev => ({
            ...prev,
            levels: prev.levels.map(l => l.id === id ? { ...l, ...updates } : l)
        }));
    }, []);

    const resetConfig = useCallback(() => setConfig(DEFAULT_CONFIG), []);

    return {
        config,
        updateDimensions,
        addLevel,
        removeLevel,
        updateLevel,
        resetConfig
    };
};
