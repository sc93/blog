import { permanentRedirect } from 'next/navigation';

import { getBlogListHref } from '@/lib/blog-list';

export default async function LegacyBlogListPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const query = new URLSearchParams({ page });
  permanentRedirect(page === '1' ? getBlogListHref() : `/blog?${query}`);
}
