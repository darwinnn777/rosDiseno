import { type ReactNode } from 'react';
import { Settings } from 'lucide-react';
import { HeaderActions } from './HeaderActions';

export const AppLayout = ({ children, sidebar }: { children: ReactNode; sidebar: ReactNode }) => {
    return (
        <div className="flex h-screen flex-col bg-gray-50 overflow-hidden">
            {/* Header */}
            <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm z-10">
                <div className="flex items-center gap-2">
                    <img src="/logoRos.png" alt="Rosiberia" className="h-10 w-auto" />
                </div>
                <HeaderActions />
            </header>

            {/* Main Content */}
            <main className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-80 overflow-y-auto border-r bg-white p-6 shadow-lg z-10 hidden md:block">
                    <div className="flex items-center gap-2 mb-6 text-brand-blue">
                        <Settings className="h-5 w-5" />
                        <h2 className="font-semibold uppercase tracking-wider text-sm">Configuración</h2>
                    </div>
                    {sidebar}
                </aside>

                {/* Viewport */}
                <section className="relative flex-1 bg-gray-100 overflow-hidden">
                    {children}
                </section>
            </main>
        </div>
    );
};
