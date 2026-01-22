import type { MaterialType } from '../types';

export const VALID_DEPTHS = [40, 50, 60, 80, 100, 120];

export const DIMENSION_LIMITS = {
    minWidth: 110,
    maxWidth: 220,
    minHeight: 100,
    maxHeight: 500, // Arbitrary max
    minLevels: 2,
    maxLevels: 8,
};

export const SHELF_MATERIALS: { id: MaterialType; label: string; priceBonus: number }[] = [
    { id: 'None', label: 'Sin suelo', priceBonus: 0 },
    { id: 'Wood', label: 'Madera', priceBonus: 15 },
    { id: 'Steel', label: 'Acero', priceBonus: 25 },
    { id: 'Grid', label: 'Rejilla', priceBonus: 30 },
    { id: 'Multiplex', label: 'Madera Multiplex', priceBonus: 20 },
    { id: 'Angled', label: 'Suelo inclinado', priceBonus: 35 },
];

export const BASE_PRICES = {
    upright: 50, // Bastidor
    beamPerMeter: 10, // Larguero (price per meter)
    support: 5, // Puntal
};
