import Image from 'next/image';
import Link from 'next/link';

import { getBlogListHref } from '@/lib/blog-list';
import { categories } from '@/lib/content';
import type { BlogPost } from '@/lib/mdx';
import { formatDate } from '@/lib/utils';

export function PostList({
  posts,
  selectedCategory,
}: {
  posts: BlogPost[];
  selectedCategory?: string;
}) {
  if (!posts.length) {
    return (
      <p className="text-muted-foreground py-12 text-center">
        아직 발행된 글이 없습니다.
      </p>
    );
  }

  return (
    <ul className="divide-y">
      {posts.map((post) => (
        <li key={post.slug} className="py-6">
          <article>
            <Link
              href={`/blog/${post.slug}`}
              className="group flex items-start gap-4 sm:gap-6"
            >
              <div className="min-w-0 flex-1 space-y-2">
                <h2 className="text-lg font-semibold tracking-tight group-hover:underline">
                  {post.metadata.title}
                </h2>
                {post.metadata.description && (
                  <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                    {post.metadata.description}
                  </p>
                )}
                <p className="text-muted-foreground text-xs">
                  <time dateTime={post.metadata.date}>
                    {formatDate(post.metadata.date)}
                  </time>
                  {' · '}
                  {categories[post.metadata.category].name}
                  {!post.metadata.published && ' · 초안'}
                </p>
              </div>
              {post.metadata.thumbnail && (
                <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-md sm:h-24 sm:w-40">
                  <Image
                    src={post.metadata.thumbnail}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 160px, 96px"
                    className="object-cover"
                  />
                </div>
              )}
            </Link>
            {!!post.metadata.tags.length && (
              <div className="mt-3 flex flex-wrap gap-3">
                {post.metadata.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={getBlogListHref(1, tag, selectedCategory)}
                    className="text-muted-foreground text-xs hover:underline"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </article>
        </li>
      ))}
    </ul>
  );
}
