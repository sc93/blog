import Image from 'next/image';

export const SiteLogo = ({ className }: { className?: string }) => (
  <Image
    src="/images/sc-logo.webp"
    alt="SC 로고"
    width={440}
    height={268}
    className={className}
    priority
  />
);
