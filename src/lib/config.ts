import { resolveSiteUrl } from '@/lib/seo';

const url = resolveSiteUrl(
  process.env.NEXT_PUBLIC_APP_URL,
  process.env.VERCEL_PROJECT_PRODUCTION_URL
);

export const siteConfig = {
  name: 'sc93 블로그',
  description: '개발, 영어 학습을 꾸준히 기록하는 블로그입니다.',
  url,
  ogImage: `${url}/og.png`,
  links: {
    twitter: '',
    github: 'https://github.com/sc93/blog',
  },
  copyRight: 'sc93',
  email: '',
};
