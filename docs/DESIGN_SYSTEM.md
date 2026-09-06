# Design System - AI Story Studio (Phase 01)

## Design Tokens
- Colors: HSL CSS variables, dark mode default, studio gradient (violet → pink)
- Radius: --radius 0.75rem, lg/md/sm variants
- Shadows: Primary glow shadow-lg shadow-primary/20
- Typography: Inter (sans), Space Grotesk (display), JetBrains Mono (mono)
- Spacing: Tailwind default + 11px uppercase tracking for section labels

## Components
All components in src/components/ui/

### Primitives
- Button: 7 variants (default, destructive, outline, secondary, ghost, link, studio), 4 sizes, isLoading
- Input: label, error, leftIcon, rightIcon
- Textarea: label, error
- Select: custom chevron, placeholder
- Checkbox: custom check
- RadioGroup
- Switch: 44x24 toggle
- Slider: range input
- Progress: percentage bar
- Avatar: sm/md/lg/xl, initials fallback
- Badge: 7 variants
- Alert: 5 variants with icons
- Card + Header + Title + Description + Content + Footer

### Overlays
- Dialog: backdrop blur, close button, header/title/description/footer
- Sheet: left/right/top/bottom slide
- Dropdown: trigger + items + separator, click outside close
- Tooltip: hover with side positioning
- Tabs: context based, animated active state

### Data
- Table: header/body/footer/row/head/cell/caption with hover states
- EmptyState: icon + title + description + action
- ErrorState: retry pattern

### Layout
- AppShell: header + sidebar + main
- StudioShell: creative workspace with optional sidebar
- Sidebar: grouped navigation (Workspace, Studio, AI Factory, Account) with badges
- Header: credits display, plan badge, notifications, avatar dropdown
- PageContainer: max-width variants
- PageHeader: breadcrumbs + title + description + action
- Section: title + description + action wrapper

## Theme System
- Dark default (class="dark" on html)
- CSS variables in :root and .dark
- Glass effect: bg-background/80 backdrop-blur-xl
- Studio gradient utilities: .studio-gradient, .studio-gradient-subtle

## Animations
- animate-in fade-in, zoom-in, slide-in
- Pulse for live indicators
- Shimmer for loading
- Active scale 0.98 on buttons
- Reduced-motion: respects prefers-reduced-motion via Tailwind

## Responsive
- Mobile: 320px+, hamburger menu, hidden sidebar
- Tablet: 768px+, sidebar collapsible
- Desktop: 1024px+, full layout
- Breakpoints: sm/md/lg/xl/2xl

## Accessibility
- Focus visible rings
- Keyboard navigation for tabs, dropdown
- Labels for all inputs
- Screen reader friendly
- Color contrast checked

## Next: Phase 02 Landing Page
