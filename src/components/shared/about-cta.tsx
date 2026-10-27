import { siteConfig } from '@/lib/config';

export function AboutCta() {
  return (
    <div className="bg-surface text-surface-foreground flex flex-col gap-2 rounded-lg p-6 text-sm">
      <h1 className="text-2xl leading-tight font-semibold tracking-tight">
        {siteConfig.name}
      </h1>
      <p className="text-muted-foreground">{siteConfig.description}</p>
    </div>
  );
}
