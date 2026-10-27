import Link from 'next/link';

import { siteConfig } from '@/lib/config';
import { categories } from '@/lib/content';

export function AboutCta() {
  return (
    <div className="bg-surface text-surface-foreground flex flex-col gap-2 rounded-lg p-6 text-sm">
      <div className="text-base leading-tight font-semibold">
        {siteConfig.name}
      </div>
      <p className="text-muted-foreground">{siteConfig.description}</p>
      <nav aria-label="학습 카테고리" className="flex flex-wrap gap-4">
        {Object.entries(categories).map(([category, value]) => (
          <Link
            key={category}
            href={`/blog?category=${category}`}
            className="underline underline-offset-4"
          >
            {value.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
