import { cn } from "@/lib/utils";


export const Spotlight = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return (
        <div className={cn("relative w-full overflow-hidden", className)}>
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
            <div className="relative z-20">{children}</div>
        </div>
    );
};