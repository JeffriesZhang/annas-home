export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} Lumina Staging. All rights reserved.</p>
        <div className="flex flex-col gap-1 sm:flex-row sm:gap-6">
          <span>Bay Area, CA</span>
          <span>hello@luminabayarea.com</span>
          <span>(555) 000-0000</span>
        </div>
      </div>
    </footer>
  );
}
