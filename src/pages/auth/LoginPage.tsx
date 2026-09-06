
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/useToast"
import { Eye, EyeOff, Sparkles } from "lucide-react"

export function LoginPage() {
  const [email, setEmail] = useState("creator@aistorystudio.com")
  const [password, setPassword] = useState("demo123")
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading } = useAuth()
  const { success, error } = useToast()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(email, password)
      success("Welcome back!", "Redirecting to dashboard...")
      navigate("/dashboard")
    } catch (err: any) {
      error("Login failed", err.message)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8 bg-muted/20">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-xl studio-gradient flex items-center justify-center text-white font-bold mb-4">A</div>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Sign in to AI Story Studio - Mock auth enabled</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="creator@example.com" required />
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                rightIcon={<button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>}
              />
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Remember me</label>
                <Link to="/forgot-password" className="text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                <strong>Demo Mode:</strong> Mock authentication active until backend integration (Phase 72).
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" variant="studio" className="w-full" isLoading={isLoading}>Sign In</Button>
              <div className="text-center text-sm text-muted-foreground">No account? <Link to="/register" className="text-primary font-medium">Sign up</Link></div>
            </CardFooter>
          </form>
        </Card>
      </div>
      <div className="hidden lg:flex flex-1 bg-background relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 studio-gradient opacity-10" />
        <div className="relative max-w-md space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
            <Sparkles className="w-3 h-3" /> Production-Grade Studio
          </div>
          <h2 className="text-4xl font-display font-bold">Where Stories Become Video</h2>
          <p className="text-muted-foreground">Nigerian family dramas, TikTok stories, YouTube series - built in minutes.</p>
        </div>
      </div>
    </div>
  )
}
