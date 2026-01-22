import { useMemo } from 'react';
import type { ShelfConfig, Pricing } from '../types';
import { BASE_PRICES, SHELF_MATERIALS } from '../lib/constants';

export const usePrice = (config: ShelfConfig): Pricing => {
    return useMemo(() => {
        const { width, levels } = config;

        // Components Calculation
        // 2 Uprights (Bastidores)
        const finalUprightPrice = 2 * BASE_PRICES.upright;

        // Beams (Largueros)
        // 2 beams per level
        const beamCount = levels.length * 2;
        const beamPrice = beamCount * (width / 100) * BASE_PRICES.beamPerMeter;

        // Supports (Puntales)
        // Assuming supports are needed every X cm of depth or scale with depth?
        // Let's assume 2 supports per level regardless for structural integrity in this model.
        const supportCount = levels.length * 2;
        const supportPrice = supportCount * BASE_PRICES.support;

        // Shelves (Baldas)
        // Area based? or fixed per type? User says "Balda según tipo: €A-€F".
        // Usually implies unit price per shelf.
        let shelvesPrice = 0;
        levels.forEach(level => {
            const material = SHELF_MATERIALS.find((m: { id: string, priceBonus: number }) => m.id === level.material);
            if (material) {
                // Price might depend on dimensions too, but requirement says "Balda según tipo".
                // Use priceBonus as base unit price for simplicity, scaled by width?
                // Let's scale by width (meters).
                shelvesPrice += material.priceBonus * (width / 100);
            }
        });

        return {
            uprights: Math.round(finalUprightPrice),
            beams: Math.round(beamPrice),
            supports: Math.round(supportPrice),
            shelves: Math.round(shelvesPrice),
            total: Math.round(finalUprightPrice + beamPrice + supportPrice + shelvesPrice)
        };
    }, [config]);
};
