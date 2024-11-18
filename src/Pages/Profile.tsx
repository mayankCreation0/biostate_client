import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/auth.context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Camera, History, Loader2, User, GitGraph, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/auth.service";
import { historyService } from "@/services/history.service";
import { format } from "date-fns";

// Define the base history interface
interface BaseHistory {
    id: string;
    input: string;
    result: string;
    createdAt: string;
    userId: string;
}

// Define specific history types
interface TreeHistory extends BaseHistory {
    type: 'tree';
}

interface SubstringHistory extends BaseHistory {
    type: 'substring';
}

// Combined type for all history items
type CombinedHistory = TreeHistory | SubstringHistory;

// Activity interface matching the component needs
interface Activity extends BaseHistory {
    type: 'tree' | 'substring';
    timestamp: string;
    details: {
        input: string;
        result: string;
    };
}

export default function Profile() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [activeTab, setActiveTab] = useState("general");

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setLoading(true);
            try {
                await authService.uploadProfileImage(e.target.files[0]);
                toast({
                    title: "Success",
                    description: "Profile image updated successfully",
                });
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to update profile image",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        }
    };

    const fetchActivities = async () => {
        try {
            const historyData = await historyService.getAllHistory({
                limit: 5,
            }) as CombinedHistory[];

            const formattedActivities: Activity[] = historyData.map(item => ({
                ...item,
                timestamp: format(new Date(item.createdAt), 'PPp'),
                details: {
                    input: item.input,
                    result: item.result
                }
            }));

            setActivities(formattedActivities);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch activity history",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-8 p-6"
        >
            {/* Profile Header Card */}
            <Card className="border-none shadow-lg">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <Avatar className="h-24 w-24 ring-2 ring-primary/10 ring-offset-2">
                                <AvatarImage src={user?.data?.user?.profileImage} />
                                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                                    {user?.data?.user?.firstName?.[0]}{user?.data?.user?.lastName?.[0]}
                                </AvatarFallback>
                            </Avatar>
                            <label
                                htmlFor="profile-image"
                                className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors shadow-md"
                            >
                                {loading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Camera className="h-4 w-4" />
                                )}
                                <input
                                    id="profile-image"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={loading}
                                />
                            </label>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">{user?.data?.user?.firstName} {user?.data?.user?.lastName}</h1>
                            <p className="text-muted-foreground">{user?.data?.user?.email}</p>
                            <Badge variant="secondary" className="mt-2">{user?.data?.user?.role}</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Modern Tabs */}
            <Tabs
                defaultValue="general"
                className="w-full"
                value={activeTab}
                onValueChange={setActiveTab}
            >
                <div className="flex justify-center mb-6">
                    <TabsList className="grid grid-cols-2 w-[400px] p-1 bg-muted/50 backdrop-blur-sm">
                        <TabsTrigger
                            value="general"
                            className={`flex items-center gap-2 transition-all ${activeTab === "general" ? "data-[state=active]:bg-background shadow-lg" : ""
                                }`}
                        >
                            <User className="h-4 w-4" />
                            Profile
                        </TabsTrigger>
                        <TabsTrigger
                            value="activity"
                            className={`flex items-center gap-2 transition-all ${activeTab === "activity" ? "data-[state=active]:bg-background shadow-lg" : ""
                                }`}
                        >
                            <History className="h-4 w-4" />
                            Activity
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="general">
                    <Card className="border-none shadow-lg">
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>
                                Your account details and preferences
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {[
                                { label: "First Name", value: user?.data?.user?.firstName },
                                { label: "Last Name", value: user?.data?.user?.lastName },
                                { label: "Email", value: user?.data?.user?.email },
                                { label: "Role", value: user?.data?.user?.role },
                                { label: "Location IP", value: user?.data?.user?.location?.ip }
                            ].map((field) => (
                                <div key={field.label} className="bg-muted/50 p-4 rounded-lg">
                                    <label className="text-sm font-medium text-muted-foreground">{field.label}</label>
                                    <p className="mt-1 font-medium">{field.value}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="activity">
                    <Card className="border-none shadow-lg">
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>
                                Your recent calculations and operations
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {activities.length > 0 ? (
                                    activities.map((activity) => (
                                        <motion.div
                                            key={activity.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                                        >
                                            <div className="p-2 rounded-full bg-primary/10">
                                                {activity.type === 'tree' ? (
                                                    <GitGraph className="h-5 w-5 text-primary" />
                                                ) : (
                                                    <Calculator className="h-5 w-5 text-primary" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="font-medium">
                                                        {activity.type === 'tree' ? 'Tree Calculation' : 'Substring Operation'}
                                                    </p>
                                                    <Badge variant="outline" className="text-xs">
                                                        {activity.timestamp}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-2">
                                                    Input: {activity.details.input}
                                                </p>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Result: {activity.details.result}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="text-center text-muted-foreground py-12">
                                        <History className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                        <p>No recent activity</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </motion.div>
    );
}