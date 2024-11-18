import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AnimatedCard } from "@/components/ui/animated-cards";
import { Spotlight } from "@/components/ui/spotlight";
import { useAuth } from "@/contexts/auth.context";
import { Calculator, GitGraph, History } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/animated-numbers";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { historyService } from "@/services/history.service";

// Define the base history interface with all common properties
interface BaseHistory {
    id: string;
    input: string;
    result: string;
    createdAt: string;
    userId: string;
}

// Define the specific history types
interface TreeHistory extends BaseHistory {
    type: 'tree';
    // Add any tree-specific properties here
}

interface SubstringHistory extends BaseHistory {
    type: 'substring';
    // Add any substring-specific properties here
}

// Combined type for all history items
type CombinedHistory = TreeHistory | SubstringHistory;

// Interface for history items with timestamp
interface HistoryWithTimestamp extends BaseHistory {
    type: 'tree' | 'substring';
    timestamp: string;
}

interface DashboardStats {
    totalCalculations: number;
    substringOperations: number;
    treeOperations: number;
    savedResults: number;
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
        return `${diffInMinutes} minutes ago`;
    }
    if (diffInHours < 24) {
        return `${diffInHours} hours ago`;
    }
    return `${Math.floor(diffInHours / 24)} days ago`;
};

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStats>({
        totalCalculations: 0,
        substringOperations: 0,
        treeOperations: 0,
        savedResults: 0
    });
    const [recentActivity, setRecentActivity] = useState<HistoryWithTimestamp[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const allHistory = await historyService.getAllHistory({ limit: 5 }) as CombinedHistory[]; // Type assertion here

                // Calculate stats from the history
                const substringCount = allHistory.filter(h => h.type === 'substring').length;
                const treeCount = allHistory.filter(h => h.type === 'tree').length;

                setStats({
                    totalCalculations: allHistory.length,
                    substringOperations: substringCount,
                    treeOperations: treeCount,
                    savedResults: allHistory.length
                });

                // Get recent activity with timestamps
                const recent: HistoryWithTimestamp[] = allHistory
                    .slice(0, 5)
                    .map(item => ({
                        ...item,
                        timestamp: formatTimestamp(new Date(item.createdAt))
                    }));

                setRecentActivity(recent);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const features = [
        {
            title: "Substring Calculator",
            description: "Find the longest substring without repeating characters",
            icon: Calculator,
            href: "/substring",
            color: "from-blue-500/20 to-cyan-500/20"
        },
        {
            title: "Binary Tree Calculator",
            description: "Calculate maximum sum paths in binary trees",
            icon: GitGraph,
            href: "/binary-tree",
            color: "from-purple-500/20 to-pink-500/20"
        }
    ];

    return (
        <div className="min-h-screen p-0 m-0 w-screen">
            <Spotlight className="max-w-6xl mx-auto pt-12 pb-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold mb-4">
                        Welcome back, {user?.data?.user?.firstName}!
                    </h1>
                    <p className="text-muted-foreground">
                        Your calculation dashboard and analytics
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                >
                    {[
                        { label: "Total Calculations", value: stats.totalCalculations },
                        { label: "Substring Operations", value: stats.substringOperations },
                        { label: "Binary Tree Operations", value: stats.treeOperations },
                        { label: "Saved Results", value: stats.savedResults }
                    ].map((stat) => (
                        <motion.div
                            key={stat.label}
                            variants={item}
                            className="bg-background/60 backdrop-blur-sm border rounded-lg p-4 text-center"
                        >
                            <div className="text-2xl font-bold mb-1">
                                <AnimatedCounter value={stat.value} />
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    {features.map((feature) => (
                        <Link key={feature.title} to={feature.href}>
                            <AnimatedCard className="h-full">
                                <div className="relative z-20">
                                    <feature.icon className="h-8 w-8 mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-muted-foreground">
                                        {feature.description}
                                    </p>
                                </div>
                                <div
                                    className={cn(
                                        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity",
                                        `bg-gradient-to-r ${feature.color}`
                                    )}
                                />
                            </AnimatedCard>
                        </Link>
                    ))}
                </div>

                {/* Recent Activity */}
                <AnimatedCard className="mb-8">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                        <History className="h-5 w-5 mr-2" />
                        Recent Activity
                    </h3>
                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center py-4">Loading...</div>
                        ) : recentActivity.length === 0 ? (
                            <div className="text-center py-4 text-muted-foreground">
                                No recent activity
                            </div>
                        ) : (
                            recentActivity.map((activity, index) => (
                                <motion.div
                                    key={activity.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                                >
                                    <div className="flex items-center">
                                        {activity.type === "substring" ? (
                                            <Calculator className="h-4 w-4 mr-2" />
                                        ) : (
                                            <GitGraph className="h-4 w-4 mr-2" />
                                        )}
                                        <div>
                                            <p className="font-medium">{activity.input}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {activity.result}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                        {activity.timestamp}
                                    </span>
                                </motion.div>
                            ))
                        )}
                    </div>
                </AnimatedCard>
            </Spotlight>
        </div>
    );
}