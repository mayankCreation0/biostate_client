// src/components/layout/Layout.tsx
import Navbar from './Navbar'
import BottomNav from './BottomNav';

interface LayoutProps {
    children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-background relative w-screen">
            <Navbar />
            <main className="w-full pt-20 pb-24 md:pb-6 overflow-x-hidden max-sm:px-2">
                <div className="mx-auto">
                    {children}
                </div>
            </main>
            <BottomNav />
        </div>
    );
}