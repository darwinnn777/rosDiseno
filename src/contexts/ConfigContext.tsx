import { createContext, useContext, type ReactNode } from 'react';
import { useShelvingConfig } from '../hooks/useShelvingConfig';
import { usePrice } from '../hooks/usePrice';
import type { ShelfConfig, ShelfLevel, Pricing } from '../types';

interface ConfigContextType {
    config: ShelfConfig;
    pricing: Pricing;
    updateDimensions: (dims: Partial<Pick<ShelfConfig, 'height' | 'width' | 'depth'>>) => void;
    addLevel: () => void;
    removeLevel: (id: string) => void;
    updateLevel: (id: string, updates: Partial<ShelfLevel>) => void;
    resetConfig: () => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
    const { config, updateDimensions, addLevel, removeLevel, updateLevel, resetConfig } = useShelvingConfig();
    const pricing = usePrice(config);

    return (
        <ConfigContext.Provider
            value={{
                config,
                pricing,
                updateDimensions,
                addLevel,
                removeLevel,
                updateLevel,
                resetConfig
            }}
        >
            {children}
        </ConfigContext.Provider>
    );
};

export const useConfig = () => {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error('useConfig must be used within a ConfigProvider');
    }
    return context;
};
