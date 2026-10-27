import Link from 'next/link';

import { siteConfig } from '@/lib/config';
import { Button } from '@/components/shadcn-ui/button';
import { Separator } from '@/components/shadcn-ui/separator';
import { ModeSwitcher } from '@/components/layout/mode-switcher';
import { BrandIcons } from '@/components/shared/brand-icons';
import { SiteLogo } from '@/components/shared/site-logo';

export function SiteHeader() {
  return (
    <header className="bg-background sticky top-0 z-50 w-full">
      <div className="container-wrapper px-6">
        <div className="container flex h-12 items-center gap-2 border-b **:data-[slot=separator]:!h-4 md:h-16">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="flex h-10 w-auto gap-2 px-2"
          >
            <Link href="/">
              <SiteLogo className="size-6" />
              <span className="text-sm font-semibold">{siteConfig.name}</span>
            </Link>
          </Button>
          <div className="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
            <Button asChild variant="ghost" size="sm">
              <Link href="/blog">전체 글</Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant="ghost"
              className="h-8 shadow-none"
            >
              <Link
                href={siteConfig.links.github}
                target="_blank"
                rel="noreferrer"
              >
                <BrandIcons.gitHub />
                <span className="sr-only">GitHub Repository</span>
              </Link>
            </Button>
            <Separator orientation="vertical" />
            <ModeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
