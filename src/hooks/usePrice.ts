import { useMemo } from 'react';
import type { ShelfConfig, Pricing } from '../types';
import { BASE_PRICES, SHELF_MATERIALS } from '../lib/constants';

export const usePrice = (config: ShelfConfig): Pricing => {
    return useMemo(() => {
        const { modules } = config;
        // Uprights logic:
        // 1 module = 2 uprights
        // 2 modules = 3 uprights
        // N modules = N + 1 uprights
        const uprightCount = modules.length + 1;
        const finalUprightPrice = uprightCount * BASE_PRICES.upright;

        let totalBeamsPrice = 0;
        let totalSupportPrice = 0;
        let totalShelvesPrice = 0;

        modules.forEach(module => {
            const { width, levels } = module;

            // Beams (Largueros) - 2 per level
            const beamCount = levels.length * 2;
            totalBeamsPrice += beamCount * (width / 100) * BASE_PRICES.beamPerMeter;

            // Supports (Puntales) - 2 per level
            const supportCount = levels.length * 2;
            totalSupportPrice += supportCount * BASE_PRICES.support;

            // Shelves (Baldas)
            levels.forEach(level => {
                const material = SHELF_MATERIALS.find((m: { id: string, priceBonus: number }) => m.id === level.material);
                if (material) {
                    totalShelvesPrice += material.priceBonus * (width / 100);
                }
            });
        });

        return {
            uprights: Math.round(finalUprightPrice),
            beams: Math.round(totalBeamsPrice),
            supports: Math.round(totalSupportPrice),
            shelves: Math.round(totalShelvesPrice),
            total: Math.round(finalUprightPrice + totalBeamsPrice + totalSupportPrice + totalShelvesPrice)
        };
    }, [config]);
};
