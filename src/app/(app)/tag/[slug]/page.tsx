import { notFound, permanentRedirect } from 'next/navigation';

import { tags } from '@/lib/blog';
import { getBlogListHref } from '@/lib/blog-list';

export default async function LegacyTagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!Object.hasOwn(tags, slug)) notFound();
  permanentRedirect(getBlogListHref(1, slug));
}
