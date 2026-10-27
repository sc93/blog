import type { BrandIcons } from '@/components/shared/brand-icons';

export const author = {
  name: 'sc93',
  url: 'https://github.com/sc93',
};

export const tags: Record<
  string,
  { name: string; icon: keyof typeof BrandIcons }
> = {
  mdx: { name: 'MDX', icon: 'mdx' },
  nextjs: { name: 'Next.js', icon: 'nextjs' },
  tailwind: { name: 'Tailwind CSS', icon: 'tailwind' },
  typescript: { name: 'TypeScript', icon: 'ts' },
};

export function getTags(posts: { metadata: { tags: string[] } }[]) {
  return Object.fromEntries(
    [...new Set(posts.flatMap((post) => post.metadata.tags))]
      .sort()
      .map((tag) => [
        tag,
        Object.hasOwn(tags, tag)
          ? tags[tag]
          : { name: tag, icon: 'mdx' as const },
      ])
  );
}
