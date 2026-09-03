import { CaseCard } from "@/components/case-card";
import servicesData from "@/data/services.json";
import casesData from "@/data/cases.json";

export const metadata = {
  title: "Work | Lumina Staging",
};

export default function WorkPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <p className="text-sm font-medium text-muted-foreground">Services & Work</p>
      <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
        How we help listings stand out
      </h1>

      <section className="mt-16">
        <h2 className="text-xl font-semibold tracking-tight">Services</h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          {servicesData.map((service) => (
            <div key={service.id}>
              <h3 className="font-medium">{service.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <h2 className="text-xl font-semibold tracking-tight">Featured Projects</h2>
        <div className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2">
          {casesData.map((item) => (
            <CaseCard key={item.id} item={item} description={item.description} />
          ))}
        </div>
      </section>
    </div>
  );
}
