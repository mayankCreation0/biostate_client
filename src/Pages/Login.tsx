import { BackgroundCells } from "@/components/ui/background"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth.context"
import { Label } from "@radix-ui/react-label"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await login(email, password)
            navigate('/')
        } finally {
            setLoading(false)
        }
    }

    return (
        <BackgroundCells>
            <div className="flex min-h-screen w-full items-center justify-center fixed inset-0 z-0">
                <Card className="w-full max-w-lg mx-auto backdrop-blur-sm bg-background/95">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
                        <CardDescription>
                            Enter your credentials to access your account
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full"
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            <Button
                                className="w-full"
                                type="submit"
                                disabled={loading}
                                size="lg"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign in'
                                )}
                            </Button>
                            <p className="text-sm text-muted-foreground text-center">
                                Don't have an account?{' '}
                                <Link
                                    to="/register"
                                    className="text-primary hover:underline font-medium"
                                >
                                    Create account
                                </Link>
                            </p>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </BackgroundCells>
    )
}