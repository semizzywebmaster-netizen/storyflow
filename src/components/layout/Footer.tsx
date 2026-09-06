export function Footer() {
  return (
    <footer className="border-t py-6 px-6 text-center text-sm text-muted-foreground">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg studio-gradient" />
          <span>© 2026 AI Story Studio • Professional AI Content Production</span>
        </div>
        <div className="flex gap-6 text-xs">
          <a href="#" className="hover:text-foreground">Privacy</a>
          <a href="#" className="hover:text-foreground">Terms</a>
          <a href="#" className="hover:text-foreground">Support</a>
          <a href="#" className="hover:text-foreground">API Docs</a>
        </div>
      </div>
    </footer>
  )
}
