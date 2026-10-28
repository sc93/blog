import type { Metadata } from 'next';
import Link from 'next/link';

import { siteConfig } from '@/lib/config';
import { getAllBlogPosts } from '@/lib/mdx';
import { PostList } from '@/components/content/post-list';
import { AboutCta } from '@/components/shared/about-cta';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
  title: { absolute: siteConfig.name },
  description: siteConfig.description,
  alternates: { canonical: '/' },
};

export default async function IndexPage() {
  const posts = await getAllBlogPosts();

  return (
    <div className="container-wrapper flex-1">
      <div className="container max-w-screen-md py-10 sm:py-16">
        <AboutCta />
        <section aria-labelledby="latest-posts" className="mt-12">
          <h2
            id="latest-posts"
            className="text-xl font-semibold tracking-tight"
          >
            최신 글
          </h2>
          <PostList posts={posts.slice(0, 5)} />
          <div className="mt-6 text-end">
            <Link href="/blog" className="text-sm underline underline-offset-4">
              전체 글 보기 →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
