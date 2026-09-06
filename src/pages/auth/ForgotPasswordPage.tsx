
import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { useToast } from "@/hooks/useToast"

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const { success } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    success("Reset link sent", "Check email (mock)")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-muted/20">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Forgot password?</CardTitle>
          <CardDescription>Mock mode active</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
            {sent && <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-sm text-green-700">Reset link sent to {email} (mock)</div>}
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" variant="studio" className="w-full">Send Reset Link</Button>
            <Link to="/login" className="text-sm text-center text-primary">Back to login</Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
