import { Badge } from "@/components/ui/badge";
import { PlaceholderImage } from "@/components/placeholder-image";
import servicesData from "@/data/services.json";
import casesData from "@/data/cases.json";

export const metadata = {
  title: "服务与案例 | Anna's Home Staging",
};

export default function WorkPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <p className="text-sm font-medium text-muted-foreground">服务与案例</p>
      <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
        我们如何帮助房源脱颖而出
      </h1>

      <section className="mt-16">
        <h2 className="text-xl font-semibold tracking-tight">服务内容</h2>
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
        <h2 className="text-xl font-semibold tracking-tight">案例展示</h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          {casesData.map((item) => (
            <div key={item.id}>
              <PlaceholderImage
                label={item.title}
                className="aspect-[4/3] w-full rounded-lg"
              />
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.location}</p>
                </div>
                <Badge variant="secondary">{item.category}</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
