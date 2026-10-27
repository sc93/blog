import type { MetadataRoute } from 'next';

import { siteConfig } from '@/lib/config';
import { getAllBlogPosts } from '@/lib/mdx';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  const posts = (await getAllBlogPosts()).filter(
    (post) => post.metadata.published
  );
  const blogPages = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(`${post.metadata.date}T00:00:00+09:00`),
  }));

  const staticPages = [
    {
      url: baseUrl,
    },
    {
      url: `${baseUrl}/blog`,
    },
  ];

  return [...staticPages, ...blogPages];
}
