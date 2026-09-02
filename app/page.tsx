import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceholderImage } from "@/components/placeholder-image";
import servicesData from "@/data/services.json";
import casesData from "@/data/cases.json";

export default function Home() {
  const services = servicesData.slice(0, 3);
  const featuredCases = casesData.slice(0, 3);

  return (
    <div>
      <section className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
        <p className="text-sm font-medium text-muted-foreground">
          Bay Area Home Staging
        </p>
        <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Professional staging that helps every listing find its buyer, faster
        </h1>
        <p className="mt-6 max-w-xl text-base text-muted-foreground">
          Anna&apos;s Home Staging offers full-service staging and space
          planning for agents and homeowners, helping listings stand out in
          the market.
        </p>
        <div className="mt-8 flex gap-4">
          <Button size="lg" render={<Link href="/work">View Work</Link>} />
          <Button
            size="lg"
            variant="outline"
            render={<Link href="/about">About Us</Link>}
          />
        </div>
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-2xl font-semibold tracking-tight">Services</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {services.map((service) => (
              <Card key={service.id} className="border-border/80">
                <CardContent className="pt-2">
                  <h3 className="font-medium">{service.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Recent Projects</h2>
          <Link
            href="/work"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            View all →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {featuredCases.map((item) => (
            <div key={item.id}>
              <PlaceholderImage
                label={item.title}
                className="aspect-[4/3] w-full rounded-lg"
              />
              <p className="mt-3 text-sm font-medium">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.location}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
