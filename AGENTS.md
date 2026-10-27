# 프로젝트 작업 지침

## 목적과 우선순위

개발·영어·TIL을 꾸준히 기록하는 개인 학습 블로그다. 기존 기능 재사용 > 단순한 구조 > 콘텐츠 작성 편의성 > 유지보수성 > 확장성을 따른다. 기존 디자인, MDX 컴포넌트, 코드 강조, 다크 모드를 재사용한다. DB·CMS·불필요한 API와 추상화, 목적 없는 의존성 업그레이드를 추가하지 않는다.

## 기술과 구조

- Next.js App Router, React, TypeScript strict, Tailwind CSS, shadcn/ui, pnpm을 사용한다.
- 글은 `src/content/blog/*.mdx`에서 관리한다. slug는 파일명이며 전체에서 고유한 소문자 영문·숫자·하이픈으로 작성한다.
- 목록은 `/blog?page=2&tag=react&category=development`, 상세는 `/blog/[slug]`다. `/page/*`, `/tag/*` 리디렉션이나 카테고리 상세 URL을 추가하지 않는다.
- 카테고리 정의는 `src/lib/content.ts`의 단일 정의를 사용한다. 태그는 Frontmatter에서 자유롭게 작성한다.
- Frontmatter의 title, description, date, category, tags, published를 검증한다. 초안의 description은 빈 문자열을 허용한다.
- `published: false` 글은 개발 서버에서만 확인 가능하다. 프로덕션 목록·상세·태그·Sitemap·RSS에서 제외한다. 배포 환경변수로 초안 노출을 활성화하지 않는다.
- 사이트 URL과 작성자 등 기본 정보는 공통 설정에서 관리한다. 비밀 값과 `.env.local`은 커밋하지 않는다.

## 변경과 검증

- 수정 전 관련 코드와 기존 기능부터 확인한다. 요구사항의 원문보다 이후 사용자가 정한 URL·작업 범위가 우선한다.
- Prettier의 기존 import 및 Tailwind 정렬 설정을 사용한다. 커밋 훅은 변경 파일만 검사한다.
- 동작 변경에는 경계 조건과 초안 노출 등 의미 있는 검증을 추가한다. 단순 문서 변경에 불필요한 테스트를 만들지 않는다.
- `pnpm test`, `pnpm lint`, `pnpm format:check`, `pnpm typecheck`, `pnpm build`로 검증한다. 검증하지 못한 항목을 성공으로 보고하지 않는다.
- 관련 작업별로 커밋을 나눈다. 요청 없이 main에 병합하거나 외부 계정·Vercel·GitHub 설정을 변경하지 않는다.
- README와 사용자 보고는 한국어로 작성한다. 원본 MIT 라이선스와 출처 표기는 유지한다.
