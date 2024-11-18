import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/auth.context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, History, Loader2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/auth.service";
import { historyService } from "@/services/history.service";

interface Activity {
    type: 'tree' | 'substring';
    timestamp: string;
    details: {
        input?: string;
        result?: string;
    };
}

export default function Profile() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [activities, setActivities] = useState<Activity[]>([]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setLoading(true);
            try {
                const updatedUser = await authService.uploadProfileImage(e.target.files[0]);
                console.log("Uploaded profile image", updatedUser.data.profileImage)
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
        console.log("Fetching")
        // try {
            const historyData = await historyService.getAllHistory({
                // limit: 5,
                // Optionally add date filters
                // startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Last 7 days
                // endDate: new Date().toISOString()
            });
            console.log("Activities", historyData)
            setActivities(historyData);
        // } catch (error) {
        //     toast({
        //         title: "Error",
        //         description: "Failed to fetch activity history",
        //         variant: "destructive",
        //     });
        // }
    };

    useEffect(() => {
        fetchActivities();
        console.log("Activities", activities)
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            {/* Profile Header */}
            <div className="flex items-center gap-6">
                <div className="relative">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={user?.data?.user?.profileImage} />
                        <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                            {user?.firstName?.[0]}{user?.data?.user?.lastName?.[0]}
                        </AvatarFallback>
                    </Avatar>
                    <label
                        htmlFor="profile-image"
                        className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
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
                </div>
            </div>

            {/* Profile Content */}
            <Tabs defaultValue="general" className="w-full">
                <TabsList>
                    <TabsTrigger value="general" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Profile
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="flex items-center gap-2">
                        <History className="h-4 w-4" />
                        Activity
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>
                                Your account details
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">First Name</label>
                                <p className="mt-1">{user?.data?.user?.firstName}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                                <p className="mt-1">{user?.data?.user?.lastName}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Email</label>
                                <p className="mt-1">{user?.data?.user?.email}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Role</label>
                                <p className="mt-1">{user?.data?.user?.role}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Location Ip</label>
                                <p className="mt-1">{user?.data?.user?.location?.ip}</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="activity">
                    <Card>
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
                                        <div
                                            key={activity.id}
                                            className="flex items-start gap-4 p-4 rounded-lg border"
                                        >
                                            <div className="flex-1">
                                                <p className="font-medium">
                                                    {activity.type === 'tree' ? 'Tree Calculation' : 'Substring Operation'}
                                                </p>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Input: {activity.input}
                                                </p>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Result: {activity.result}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-2">
                                                    {new Date(activity.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-muted-foreground py-8">
                                        No recent activity
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