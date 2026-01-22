import { Download, Printer, RotateCcw } from 'lucide-react';
import { useConfig } from '../../contexts/ConfigContext';
import { Button } from '../ui';

export const HeaderActions = () => {
    const { config, resetConfig } = useConfig();

    const handleExport = () => {
        const dataStr = JSON.stringify(config, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = 'rosiberia-shelf-config.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const handlePrint = () => {
        window.print();
    };

    const handleReset = () => {
        if (confirm('¿Estás seguro de que quieres borrar la configuración actual?')) {
            resetConfig();
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleReset} title="Reset">
                <RotateCcw className="h-5 w-5 text-gray-500" />
            </Button>
            <Button variant="secondary" size="sm" onClick={handleExport} className="gap-2 hidden sm:flex">
                <Download className="h-4 w-4" />
                <span className="hidden md:inline">Exportar</span>
            </Button>
            <Button variant="primary" size="sm" onClick={handlePrint} className="gap-2">
                <Printer className="h-4 w-4" />
                <span>Imprimir</span>
            </Button>
        </div>
    );
};
