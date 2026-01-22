export type MaterialType = 'None' | 'Wood' | 'Steel' | 'Grid' | 'Multiplex' | 'Angled';

export interface ShelfLevel {
    id: string;
    elevation: number; // Height from ground in cm
    material: MaterialType;
}

export interface ShelfConfig {
    height: number; // Total height in cm
    width: number; // Width between uprights in cm (110-220)
    depth: number; // Depth in cm (40, 50, 60, 80, 100, 120)
    levels: ShelfLevel[];
}

export interface Pricing {
    uprights: number; // Bastidores
    beams: number; // Largueros
    supports: number; // Puntales
    shelves: number; // Baldas
    total: number;
}
