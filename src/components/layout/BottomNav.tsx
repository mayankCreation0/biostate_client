import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, GitGraph, Text, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
    const location = useLocation();

    const navigation = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Substring', href: '/substring', icon: Text },
        { name: 'Binary Tree', href: '/binary-tree', icon: GitGraph },
        { name: 'Profile', href: '/profile', icon: User },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-t">
            <nav className="flex justify-around py-3">
                {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={cn(
                                "flex flex-col items-center gap-1",
                                isActive ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            <span className="text-xs font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}