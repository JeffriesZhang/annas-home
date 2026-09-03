import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { PlaceholderImage } from "@/components/placeholder-image";
import { withBasePath } from "@/lib/base-path";

type CaseItem = {
  id: string;
  title: string;
  location: string;
  category?: string;
  cover: string;
  coverBlurDataURL?: string;
  photos?: { src: string; original: string; blurDataURL: string }[];
};

export function CaseCard({
  item,
  description,
}: {
  item: CaseItem;
  description?: string;
}) {
  const hasRealPhotos = Boolean(item.photos?.length);

  return (
    <Link href={`/work/${item.id}`} className="group block">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
        {hasRealPhotos ? (
          <Image
            src={withBasePath(item.cover)}
            alt={item.title}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            placeholder={item.coverBlurDataURL ? "blur" : "empty"}
            blurDataURL={item.coverBlurDataURL}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <PlaceholderImage label={item.title} className="h-full w-full" />
        )}
        {item.category && (
          <Badge
            variant="secondary"
            className="absolute top-3 left-3 bg-background/90 backdrop-blur"
          >
            {item.category}
          </Badge>
        )}
      </div>
      <div className="mt-3">
        <p className="truncate text-sm font-medium">{item.title}</p>
        <p className="text-xs text-muted-foreground">{item.location}</p>
      </div>
      {description && (
        <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
      )}
    </Link>
  );
}
