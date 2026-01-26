export type MaterialType = 'None' | 'Wood' | 'Steel' | 'Grid' | 'Multiplex' | 'Angled';

export interface ShelfLevel {
    id: string;
    elevation: number; // Height from ground in cm
    material: MaterialType;
}

export interface ShelfModule {
    id: string;
    width: number; // Width of this specific bay
    levels: ShelfLevel[];
}

export interface ShelfConfig {
    height: number; // Global height for the row
    depth: number; // Global depth for the row
    modules: ShelfModule[]; // List of connected bays
}

export interface Pricing {
    uprights: number; // Bastidores
    beams: number; // Largueros
    supports: number; // Puntales
    shelves: number; // Baldas
    total: number;
}
