
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/useToast"

export function RegisterPage() {
  const [form, setForm] = useState({ email: "", password: "", username: "", displayName: "" })
  const { register, isLoading } = useAuth()
  const { success, error } = useToast()
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await register(form)
      success("Account created!", "Welcome to AI Story Studio")
      navigate("/dashboard")
    } catch (err: any) {
      error("Registration failed", err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-muted/20">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-xl studio-gradient flex items-center justify-center text-white font-bold mb-4">A</div>
          <CardTitle>Create your studio</CardTitle>
          <CardDescription>Start with 50 free credits - No card required</CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="african_storyteller" required />
              <Input label="Display Name" value={form.displayName} onChange={e => setForm({ ...form, displayName: e.target.value })} placeholder="Mizzy Creator" required />
            </div>
            <Input label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required />
            <Input label="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" required />
            <div className="text-xs text-muted-foreground">Wallet is platform-only, non-withdrawable.</div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" variant="studio" className="w-full" isLoading={isLoading}>Create Account</Button>
            <div className="text-center text-sm text-muted-foreground">Have account? <Link to="/login" className="text-primary font-medium">Sign in</Link></div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
