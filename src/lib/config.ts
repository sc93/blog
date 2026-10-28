import { resolveSiteUrl } from '@/lib/seo';

const url = resolveSiteUrl(
  process.env.NEXT_PUBLIC_APP_URL,
  process.env.VERCEL_PROJECT_PRODUCTION_URL
);

export const siteConfig = {
  name: '살아남아야 하는 개발자',
  description: '배우기를 멈추면 살아남지 못한다.',
  url,
  ogImage: `${url}/og.png`,
  links: {
    twitter: '',
    github: 'https://github.com/sc93/blog',
  },
  copyRight: 'sc93',
  email: '',
};
