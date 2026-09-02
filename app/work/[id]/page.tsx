import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlaceholderImage } from "@/components/placeholder-image";
import { withBasePath } from "@/lib/base-path";
import casesData from "@/data/cases.json";

export function generateStaticParams() {
  return casesData.map((item) => ({ id: item.id }));
}

export async function generateMetadata(props: PageProps<"/work/[id]">) {
  const { id } = await props.params;
  const item = casesData.find((c) => c.id === id);
  return { title: item ? `${item.title} | Anna's Home Staging` : "Case Study" };
}

function PhotoGrid({ title, photos }: { title: string; photos: string[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {photos.map((src) => (
        <a
          key={src}
          href={withBasePath(src)}
          target="_blank"
          rel="noreferrer"
          className="relative block aspect-[4/3] w-full overflow-hidden rounded-lg"
        >
          <Image
            src={withBasePath(src)}
            alt={title}
            fill
            sizes="(min-width: 640px) 33vw, 100vw"
            className="object-cover transition-transform duration-300 hover:scale-[1.02]"
          />
        </a>
      ))}
    </div>
  );
}

export default async function CaseDetailPage(props: PageProps<"/work/[id]">) {
  const { id } = await props.params;
  const item = casesData.find((c) => c.id === id);
  if (!item) notFound();

  const photos = item.photos ?? [];
  const aerialPhotos = photos.filter((src) => src.includes("/DJI_"));
  const interiorPhotos = photos.filter((src) => !src.includes("/DJI_"));

  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <Link
        href="/work"
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        ← Back to Work
      </Link>

      <div className="mt-6 flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {item.title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{item.location}</p>
        </div>
        <Badge variant="secondary">{item.category}</Badge>
      </div>

      <p className="mt-6 max-w-2xl text-base text-muted-foreground">
        {item.description}
      </p>

      {item.matterportUrl && (
        <div className="mt-6">
          <Button
            render={
              <a href={item.matterportUrl} target="_blank" rel="noreferrer">
                View 3D Tour
              </a>
            }
          />
        </div>
      )}

      {photos.length > 0 ? (
        <div className="mt-12 space-y-12">
          {interiorPhotos.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Interior</h2>
              <div className="mt-6">
                <PhotoGrid title={item.title} photos={interiorPhotos} />
              </div>
            </div>
          )}
          {aerialPhotos.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Aerial View</h2>
              <div className="mt-6">
                <PhotoGrid title={item.title} photos={aerialPhotos} />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-12">
          <PlaceholderImage
            label={item.title}
            className="aspect-[16/9] w-full rounded-lg"
          />
        </div>
      )}

      {item.floorPlan && (
        <div className="mt-16">
          <h2 className="text-xl font-semibold tracking-tight">Floor Plan</h2>
          <a
            href={withBasePath(item.floorPlan)}
            target="_blank"
            rel="noreferrer"
            className="relative mt-6 block aspect-[4/3] w-full max-w-2xl overflow-hidden rounded-lg border border-border"
          >
            <Image
              src={withBasePath(item.floorPlan)}
              alt={`${item.title} floor plan`}
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-contain"
            />
          </a>
        </div>
      )}
    </div>
  );
}
