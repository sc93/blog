import { resolveSiteUrl } from '@/lib/seo';

const url = resolveSiteUrl(
  process.env.NEXT_PUBLIC_APP_URL,
  process.env.VERCEL_PROJECT_PRODUCTION_URL
);

export const siteConfig = {
  name: 'sc93 학습 노트',
  description: '개발, 영어, TIL을 꾸준히 기록하는 개인 학습 블로그입니다.',
  url,
  ogImage: `${url}/og.png`,
  links: {
    twitter: '',
    github: 'https://github.com/sc93/blog',
  },
  copyRight: 'sc93',
  email: '',
};
