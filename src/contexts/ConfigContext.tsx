import { createContext, useContext, type ReactNode } from 'react';
import { useShelvingConfig } from '../hooks/useShelvingConfig';
import { usePrice } from '../hooks/usePrice';
import type { ShelfConfig, ShelfLevel, ShelfModule, Pricing } from '../types';

interface ConfigContextType {
    config: ShelfConfig;
    pricing: Pricing;
    activeModuleId: string;
    setActiveModuleId: (id: string) => void;
    updateGlobalDimensions: (dims: Partial<Pick<ShelfConfig, 'height' | 'depth'>>) => void;
    addModule: () => void;
    removeModule: (id: string) => void;
    updateModule: (moduleId: string, updates: Partial<Pick<ShelfModule, 'width'>>) => void;
    addLevel: (moduleId: string) => void;
    removeLevel: (moduleId: string, levelId: string) => void;
    updateLevel: (moduleId: string, levelId: string, updates: Partial<ShelfLevel>) => void;
    resetConfig: () => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
    const {
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
    } = useShelvingConfig();

    // Pass pricing based on full config?
    const pricing = usePrice(config);

    return (
        <ConfigContext.Provider
            value={{
                config,
                pricing,
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
