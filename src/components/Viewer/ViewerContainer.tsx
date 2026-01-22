import { useState } from 'react';
import { Viewer2D } from './Viewer2D';
import { Viewer3D } from './Viewer3D';
import { Button } from '../ui';
import { Box, FileText } from 'lucide-react';

export const ViewerContainer = () => {
    const [mode, setMode] = useState<'2D' | '3D'>('2D');

    return (
        <div className="h-full flex flex-col">
            {/* Toolbar */}
            <div className="absolute top-4 right-4 z-20 flex gap-2 bg-white/80 p-1 rounded-lg shadow-sm backdrop-blur-sm">
                <Button
                    variant={mode === '2D' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setMode('2D')}
                    className="gap-2"
                >
                    <FileText className="h-4 w-4" /> 2D Técnico
                </Button>
                <Button
                    variant={mode === '3D' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setMode('3D')}
                    className="gap-2"
                >
                    <Box className="h-4 w-4" /> Ver en 3D
                </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
                {mode === '2D' ? <Viewer2D /> : <Viewer3D />}
            </div>
        </div>
    );
};
