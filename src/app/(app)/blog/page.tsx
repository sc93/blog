import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BookOpenIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import { getTags } from '@/lib/blog';
import {
  getBlogListHref,
  selectBlogPage,
  type BlogListQuery,
} from '@/lib/blog-list';
import { siteConfig } from '@/lib/config';
import { categories } from '@/lib/content';
import { getAllBlogPosts } from '@/lib/mdx';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/shadcn-ui/badge';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/shadcn-ui/pagination';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { BrandIcons } from '@/components/shared/brand-icons';
import { LinkCard } from '@/components/shared/link-card';

type BlogPageProps = { searchParams: Promise<BlogListQuery> };

export async function generateMetadata({
  searchParams,
}: BlogPageProps): Promise<Metadata> {
  const query = await searchParams;
  const posts = await getAllBlogPosts();
  const tags = getTags(posts);
  const tag =
    typeof query.tag === 'string' && Object.hasOwn(tags, query.tag)
      ? tags[query.tag]
      : undefined;
  const category =
    typeof query.category === 'string' &&
    Object.hasOwn(categories, query.category)
      ? categories[query.category as keyof typeof categories]
      : undefined;
  const title =
    [category?.name, tag?.name].filter(Boolean).join(' · ') || '전체 글';
  const description = tag
    ? `${tag.name} 태그의 학습 기록을 모았습니다.`
    : '개발과 일상의 학습 기록을 모았습니다.';
  const canonical = getBlogListHref(
    typeof query.page === 'string' && /^[1-9]\d*$/.test(query.page)
      ? Number(query.page)
      : 1,
    tag ? (query.tag as string) : undefined,
    typeof query.category === 'string' &&
      Object.hasOwn(categories, query.category)
      ? query.category
      : undefined
  );
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonical,
      images: [siteConfig.ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [siteConfig.ogImage],
    },
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const query = await searchParams;
  const posts = await getAllBlogPosts();
  const tags = getTags(posts);
  if (
    query.tag !== undefined &&
    (typeof query.tag !== 'string' || !Object.hasOwn(tags, query.tag))
  ) {
    notFound();
  }
  if (
    query.category !== undefined &&
    (typeof query.category !== 'string' ||
      !Object.hasOwn(categories, query.category))
  )
    notFound();
  const selectedCategory =
    typeof query.category === 'string' ? query.category : undefined;
  const selectedTag = typeof query.tag === 'string' ? query.tag : undefined;
  const tag = selectedTag ? tags[selectedTag] : undefined;
  const result = selectBlogPage(posts, query);
  if (!result) notFound();
  const Icon = tag ? BrandIcons[tag.icon] : BookOpenIcon;

  return (
    <div className="flex flex-1 flex-col">
      <div className="container-wrapper">
        <div className="container">
          <div className="hidden py-4 lg:block">
            <Breadcrumb
              items={
                tag
                  ? [
                      { link: '/blog', label: '전체 글' },
                      { link: '', label: tag.name },
                    ]
                  : [{ link: '', label: '전체 글' }]
              }
            />
          </div>
        </div>
      </div>
      <div className="container-wrapper">
        <div className="container py-6">
          <header className="from-primary/5 via-primary/3 ring-primary/10 relative overflow-hidden rounded-2xl bg-gradient-to-br to-transparent p-6 ring-1">
            <div className="bg-primary/5 absolute -top-4 -right-4 h-24 w-24 rounded-full" />
            <div className="relative flex items-start gap-4">
              <div className="bg-primary text-primary-foreground flex size-12 shrink-0 items-center justify-center rounded-xl">
                <Icon className="size-6" />
              </div>
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {tag ? 'TAG' : 'BLOG'}
                  </Badge>
                  <span className="text-muted-foreground text-sm">
                    총 {result.totalItems}개의 글
                  </span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {[
                    selectedCategory
                      ? categories[selectedCategory as keyof typeof categories]
                          .name
                      : undefined,
                    tag?.name,
                  ]
                    .filter(Boolean)
                    .join(' · ') || '전체 글'}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {tag
                    ? `${tag.name} 태그의 학습 기록을 모았습니다.`
                    : '개발과 일상의 학습 기록을 모았습니다.'}
                </p>
              </div>
            </div>
          </header>
          <nav aria-label="카테고리 필터" className="mt-6 flex flex-wrap gap-2">
            {[
              { slug: undefined, name: '모든 카테고리' },
              ...Object.entries(categories).map(([slug, value]) => ({
                slug,
                name: value.name,
              })),
            ].map((filter) => (
              <Badge
                key={filter.slug ?? 'all'}
                variant={
                  selectedCategory === filter.slug ? 'default' : 'outline'
                }
                className="rounded-full px-3 py-2 font-normal"
                asChild
              >
                <Link
                  href={getBlogListHref(1, selectedTag, filter.slug)}
                  aria-current={
                    selectedCategory === filter.slug ? 'page' : undefined
                  }
                >
                  {filter.name}
                </Link>
              </Badge>
            ))}
          </nav>
          <nav aria-label="태그 필터" className="mt-6 flex flex-wrap gap-2">
            {[
              { slug: undefined, name: '전체' },
              ...Object.entries(tags).map(([slug, value]) => ({
                slug,
                name: value.name,
              })),
            ].map((filter) => (
              <Badge
                key={filter.slug ?? 'all'}
                variant={selectedTag === filter.slug ? 'default' : 'outline'}
                className="rounded-full px-3 py-2 font-normal"
                asChild
              >
                <Link
                  href={getBlogListHref(1, filter.slug, selectedCategory)}
                  aria-current={
                    selectedTag === filter.slug ? 'page' : undefined
                  }
                >
                  {filter.name}
                </Link>
              </Badge>
            ))}
          </nav>
        </div>
      </div>
      <div className="container-wrapper">
        <section aria-label="글 목록" className="container border-b py-6">
          {result.items.length ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {result.items.map((post, index) => (
                <div key={post.slug}>
                  <LinkCard
                    title={post.metadata.title}
                    imageUrl={post.metadata.thumbnail || '/og.png'}
                    link={`/blog/${post.slug}`}
                    badgeText={`${formatDate(post.metadata.date)} · ${categories[post.metadata.category].name}${post.metadata.published ? '' : ' · 초안'}`}
                    description={post.metadata.description}
                    priority={index < 3}
                  />
                  <div className="mt-2 flex flex-wrap gap-2 px-3">
                    {post.metadata.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={getBlogListHref(1, tag, selectedCategory)}
                        className="text-muted-foreground text-xs underline underline-offset-4"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground py-12 text-center">
              아직 등록된 글이 없습니다.
            </p>
          )}
        </section>
      </div>
      {result.totalPages > 1 && (
        <Pagination className="my-10" aria-label="글 목록 페이지">
          <PaginationContent className="gap-3">
            {result.currentPage > 1 && (
              <PaginationItem>
                <PaginationLink
                  href={getBlogListHref(
                    result.currentPage - 1,
                    selectedTag,
                    selectedCategory
                  )}
                  aria-label="이전 페이지"
                >
                  <ChevronLeftIcon className="size-4" />
                </PaginationLink>
              </PaginationItem>
            )}
            {Array.from(
              { length: Math.min(5, result.totalPages) },
              (_, index) =>
                Math.max(
                  1,
                  Math.min(result.currentPage - 2, result.totalPages - 4)
                ) + index
            ).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href={getBlogListHref(page, selectedTag, selectedCategory)}
                  isActive={page === result.currentPage}
                  aria-label={`${page}페이지`}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            {result.currentPage < result.totalPages && (
              <PaginationItem>
                <PaginationLink
                  href={getBlogListHref(
                    result.currentPage + 1,
                    selectedTag,
                    selectedCategory
                  )}
                  aria-label="다음 페이지"
                >
                  <ChevronRightIcon className="size-4" />
                </PaginationLink>
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
