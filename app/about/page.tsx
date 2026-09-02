import { PlaceholderImage } from "@/components/placeholder-image";

export const metadata = {
  title: "关于我们 | Anna's Home Staging",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <p className="text-sm font-medium text-muted-foreground">关于我们</p>
      <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
        专注 Bay Area 家居陈设的团队
      </h1>
      <p className="mt-6 max-w-2xl text-base text-muted-foreground">
        Anna&apos;s Home Staging 由一支专注室内陈设与空间设计的团队组成，长期与
        Bay Area 地区的经纪人、业主和房地产团队合作，通过软装陈设帮助房源在
        市场上更快获得关注。
      </p>

      <div className="mt-12 grid gap-10 sm:grid-cols-2">
        <PlaceholderImage label="团队照片" className="aspect-[4/3] w-full rounded-lg" />
        <div className="flex flex-col justify-center gap-6">
          <div>
            <h2 className="font-medium">我们的理念</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              好的陈设不是堆砌家具，而是帮助买家在空间中想象自己的生活。我们
              相信克制、真实的设计比华丽的装饰更有说服力。
            </p>
          </div>
          <div>
            <h2 className="font-medium">服务地区</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              San Francisco Bay Area 及周边城市，包括 San Jose、Palo Alto、
              Sunnyvale、Oakland 等地。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
