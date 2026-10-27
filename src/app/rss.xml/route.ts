import { NextResponse } from 'next/server';

import { siteConfig } from '@/lib/config';
import { getAllBlogPosts } from '@/lib/mdx';
import { escapeXml } from '@/lib/seo';

export const dynamic = 'force-static';

export async function GET() {
  const posts = (await getAllBlogPosts()).filter(
    (post) => post.metadata.published
  );
  const baseUrl = siteConfig.url;
  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${escapeXml(baseUrl)}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>ko</language>
    <atom:link href="${escapeXml(baseUrl)}/rss.xml" rel="self" type="application/rss+xml"/>
    ${posts
      .map(
        (post) => `<item>
      <title>${escapeXml(post.metadata.title)}</title>
      <link>${escapeXml(`${baseUrl}/blog/${post.slug}`)}</link>
      <guid isPermaLink="true">${escapeXml(`${baseUrl}/blog/${post.slug}`)}</guid>
      <pubDate>${new Date(`${post.metadata.date}T00:00:00+09:00`).toUTCString()}</pubDate>
      <description>${escapeXml(post.metadata.description)}</description>
      <category>${escapeXml(post.metadata.category)}</category>
      ${post.metadata.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join('')}
    </item>`
      )
      .join('')}
  </channel>
</rss>`;
  return new NextResponse(rssXml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
