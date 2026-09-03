import { PlaceholderImage } from "@/components/placeholder-image";

export const metadata = {
  title: "About | Lumina Staging",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <p className="text-sm font-medium text-muted-foreground">About Us</p>
      <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
        A team dedicated to Bay Area home staging
      </h1>
      <p className="mt-6 max-w-2xl text-base text-muted-foreground">
        Lumina Staging is a team of interior stylists and space
        planners who have worked with agents, homeowners, and real estate
        teams across the Bay Area, helping listings attract attention faster
        through thoughtful staging.
      </p>

      <div className="mt-12 grid gap-10 sm:grid-cols-2">
        <PlaceholderImage label="Team photo" className="aspect-[4/3] w-full rounded-lg" />
        <div className="flex flex-col justify-center gap-6">
          <div>
            <h2 className="font-medium">Our Philosophy</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Great staging isn&apos;t about filling a room with furniture —
              it&apos;s about helping buyers picture their own life in the
              space. We believe restrained, authentic design is more
              persuasive than heavy decoration.
            </p>
          </div>
          <div>
            <h2 className="font-medium">Service Area</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              The San Francisco Bay Area and surrounding cities, including
              San Jose, Palo Alto, Sunnyvale, and Oakland.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
