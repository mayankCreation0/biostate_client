// src/components/layout/Navbar.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth.context";
import { Menu, MenuItem, HoveredLink } from "@/components/ui/navbar-menu";
import { ModeToggle } from "@/components/ui/toggle";
import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Calculator,
    GitGraph,
    LogOut,
    User
} from "lucide-react";

export default function Navbar() {
    const [active, setActive] = useState<string | null>(null);
    const { user, logout } = useAuth();

    const calculators = [
        {
            title: "Substring Calculator",
            href: "/substring",
            description: "Find the longest substring without repeating characters",
            icon: Calculator,
        },
        {
            title: "Binary Tree Calculator",
            href: "/binary-tree",
            description: "Calculate maximum sum paths in binary trees",
            icon: GitGraph,
        },
    ];

    const profileMenu = [
        {
            title: "Profile",
            href: "/profile",
            description: "Manage your account settings",
            icon: User,
        },
        // {
        //     title: "History",
        //     href: "/history",
        //     description: "View your calculation history",
        //     icon: History,
        // },
        // {
        //     title: "Statistics",
        //     href: "/stats",
        //     description: "View your usage statistics",
        //     icon: BarChart,
        // },
    ];


    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm ">
            <div className=" ">
                <div className="flex h-16 items-center justify-between ">
                    <Link to="/" className="flex items-center space-x-2 ml-2">
                        <span className="text-xl font-bold">Biostate.ai</span>
                    </Link>

                    <div className="flex items-center space-x-6">
                        <nav className="flex items-center space-x-6">
                            <div className="relative">
                                <Menu setActive={setActive}>
                                    <MenuItem
                                        setActive={setActive}
                                        active={active}
                                        item="Calculators"
                                    >
                                        <div className="w-[300px]">
                                            {calculators.map((item) => (
                                                <HoveredLink
                                                    key={item.href}
                                                    to={item.href}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="rounded-lg bg-accent p-2">
                                                            <item.icon className="h-4 w-4" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-foreground">
                                                                {item.title}
                                                            </p>
                                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                                {item.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </HoveredLink>
                                            ))}
                                        </div>
                                    </MenuItem>
                                </Menu>
                            </div>

                            <div className="flex items-center ">
                                <ModeToggle />

                                <DropdownMenu>
                                    <DropdownMenuTrigger className="focus:outline-none bg-transparent">
                                        <div className="overflow-hidden rounded-full border bg-accent hover:bg-accent transition-colors">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={user?.data.user.profileImage} />
                                                <AvatarFallback className="bg-primary/10 text-primary">
                                                    {user?.data?.user?.firstName?.[0]}{user?.data?.user?.lastName?.[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <DropdownMenuLabel>
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium">
                                                    {user?.data.user.firstName}{user?.data.user.lastName}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {user?.data.user.email}
                                                </p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {profileMenu.map((item) => (
                                            <DropdownMenuItem key={item.href} asChild>
                                                <Link
                                                    to={item.href}
                                                    className="flex items-center gap-2 p-2"
                                                >
                                                    <div className="rounded-lg bg-accent p-1">
                                                        <item.icon className="h-4 w-4" />
                                                    </div>
                                                    <span>{item.title}</span>
                                                </Link>
                                            </DropdownMenuItem>
                                        ))}
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={logout}
                                            className="text-destructive focus:text-destructive"
                                        >
                                            <div className="rounded-lg bg-destructive/10 p-1 mr-2">
                                                <LogOut className="h-4 w-4" />
                                            </div>
                                            <span>Log out</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
}