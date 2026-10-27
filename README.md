# sc93 학습 노트

개발과 영어를 꾸준히 기록하는 개인 학습 블로그입니다. [Next.js Minimal Blog](https://github.com/cakegaly/next-minimal-blog)를 기반으로 기존 디자인과 MDX 컴포넌트를 재사용합니다. DB나 CMS 없이 파일과 Git으로 운영합니다.

## 기술 스택

Next.js 16 App Router, React 19, TypeScript strict, MDX, Tailwind CSS 4, shadcn/ui, ESLint 9, Prettier, Husky, lint-staged를 사용합니다. MDX는 gray-matter와 @mdx-js/mdx로 처리하며 remark-gfm, rehype-pretty-code, Shiki로 코드와 표를 렌더링합니다.

## 로컬 개발

Node.js 24와 pnpm 10.14.0을 사용합니다. `.nvmrc`와 `packageManager`에 버전이 기록되어 있습니다.

```bash
nvm use
corepack enable
pnpm install
cp .env.example .env.local
pnpm dev
```

[http://localhost:8888](http://localhost:8888)에서 확인합니다. 기존 `.env.local`이 있다면 복사하지 말고 값을 확인하세요. 처음 `pnpm install`할 때 `prepare`가 Husky를 설정합니다. Git 저장소가 아닌 배포 환경에서 훅을 실행하지 않으려면 `HUSKY=0`을 사용할 수 있습니다.

## 개발 명령어

| 명령어                              | 용도                                             |
| ----------------------------------- | ------------------------------------------------ |
| `pnpm dev`                          | 초안을 포함한 개발 서버, 8888 포트               |
| `pnpm build`                        | 공개 글 상세를 정적 생성하는 프로덕션 빌드       |
| `pnpm start`                        | 빌드된 프로덕션 서버, 8888 포트                  |
| `pnpm lint` / `pnpm lint:fix`       | ESLint 검사 / 자동 수정                          |
| `pnpm format` / `pnpm format:check` | Prettier 포맷 / 검사                             |
| `pnpm typecheck`                    | TypeScript 검사                                  |
| `pnpm test`                         | Node 기본 테스트 러너로 콘텐츠·필터·SEO·CLI 검증 |
| `pnpm new:post`                     | 대화형 초안 생성                                 |

Prettier는 기존 import 정렬과 Tailwind 클래스 정렬 플러그인을 사용합니다. 커밋 시 변경된 TS/TSX에 ESLint와 Prettier, MD/MDX·JSON·CSS 등에는 Prettier를 실행합니다. MDX의 설명용 코드 조각은 별도 언어로 다시 파싱하지 않도록 설정했습니다. `pnpm-workspace.yaml`에는 기존 CSS·이미지 처리 패키지의 설치 스크립트만 허용합니다. 전체 빌드와 타입 검사는 커밋 훅에 넣지 않아 글 작성 커밋을 빠르게 유지합니다. 검사 실패 시 커밋이 중단됩니다.

## 글 작성

```bash
pnpm new:post
```

카테고리, 제목, slug를 입력하면 `src/content/blog/<slug>.mdx`를 생성합니다. 인자로 한 번에 작성할 수도 있습니다.

```bash
pnpm new:post --category development --title "React 렌더링 정리" --slug react-rendering
```

기본 날짜는 한국 시간(Asia/Seoul)의 오늘이며, `published: false`로 생성합니다. 같은 파일은 덮어쓰지 않습니다. slug는 소문자 영문·숫자·하이픈만 가능하며 전체 글에서 고유해야 합니다. 파일명을 바꾸면 글 URL도 바뀝니다.

```mdx
---
title: 'React 렌더링 정리'
description: '렌더링 과정과 학습한 내용을 정리합니다.'
date: '2026-10-27'
category: 'development'
tags: ['React', 'JavaScript']
published: false
---

## 학습 내용

오늘 배운 내용을 작성합니다.

<Callout>MDX에서 기존 React 컴포넌트도 사용할 수 있습니다.</Callout>
```

| 필드          | 설명                                           |
| ------------- | ---------------------------------------------- |
| `title`       | 비어 있지 않은 글 제목                         |
| `description` | 글 설명. 초안은 빈 문자열 허용, 공개 시 필수   |
| `date`        | 따옴표로 감싼 `YYYY-MM-DD` 형식의 실제 날짜    |
| `category`    | `development`, `english` 중 하나               |
| `tags`        | 문자열 배열. 빈 배열 가능, 공백·중복 태그 불가 |
| `published`   | boolean. 공개하려면 `true`로 변경              |
| `thumbnail`   | 선택 사항. `/images/...` 형식의 이미지 경로 등 |

`public/images/`에 이미지를 두고 `/images/파일명.png`로 참조할 수 있습니다. 기존 MDX 컴포넌트 매핑은 `src/components/content/mdx-components.tsx`에서 관리합니다. 외부 이미지는 Next.js 이미지 설정에서 호스트 허용이 필요할 수 있습니다.

개발 서버에서는 초안을 목록과 상세에서 확인할 수 있습니다. 프로덕션에서는 초안을 홈·목록·태그·글 상세·RSS·Sitemap에 노출하지 않으며 상세 URL은 404가 됩니다. RSS와 Sitemap은 개발 환경에서도 공개 글만 포함합니다. 공개 글은 작성일 내림차순으로 정렬됩니다. 잘못된 메타데이터는 파일명을 포함한 오류로 알려줍니다.

템플릿의 공개 데모 글은 제거했습니다. `draft-example.mdx`는 개발 환경에서만 보이는 비공개 작성 예시이며, 실제 글은 `pnpm new:post`로 생성하세요. 첫 글을 발행하기 전에는 홈과 전체 글 목록에 빈 목록 안내가 표시됩니다.

## 카테고리와 태그

카테고리는 `src/lib/content.ts`의 `categories` 한 곳에서 정의합니다.

- 개발: 개발 기술과 문제 해결 기록
- 영어: 영어 단어, 표현과 문법

태그는 Frontmatter에서 자유롭게 추가할 수 있고 공개 글에서 자동 수집합니다. 미리 아이콘을 등록할 필요는 없습니다. 기존 기술 태그의 이름과 아이콘 설정은 `src/lib/blog.ts`에서 재사용합니다. 태그는 대소문자를 구분합니다.

| 주소                                   | 내용                                    |
| -------------------------------------- | --------------------------------------- |
| `/`                                    | 소개와 최근 학습 기록                   |
| `/blog`                                | 전체 글                                 |
| `/blog?page=2&tag=React`               | 태그로 필터링한 글의 2페이지            |
| `/blog?category=english`               | 영어 학습 기록                          |
| `/blog?category=development&tag=React` | 카테고리와 태그를 함께 필터링           |
| `/blog/react-rendering`                | 글 상세, 카테고리는 URL에 포함하지 않음 |
| `/rss.xml`                             | 공개 글 RSS                             |
| `/sitemap.xml`                         | 홈, 글 목록, 공개 글 상세               |

목록은 6개씩 표시합니다. 필터를 변경하면 첫 페이지로 이동하며 페이지 이동 시 필터를 유지합니다. 없는 태그·카테고리·글과 범위를 벗어난 페이지는 404입니다. 이전 `/page/*`, `/tag/*` 라우트는 제공하지 않습니다.

## 사이트 설정과 환경변수

사이트 이름·설명·GitHub·선택 연락처는 `src/lib/config.ts`, 작성자 정보는 `src/lib/blog.ts`에서 수정합니다. 원본 MIT 저작권은 `LICENSE`에 유지합니다.

| 환경변수                        | 설정                                                                                                     |
| ------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_APP_URL`           | 실제 사이트의 기본 주소. 로컬은 `http://localhost:8888`, 배포는 본인의 HTTPS 도메인. 경로·쿼리 없이 입력 |
| `VERCEL_PROJECT_PRODUCTION_URL` | Vercel이 제공하는 프로덕션 호스트. 위 변수가 없으면 사용                                                 |

둘 다 없으면 `http://localhost:8888`을 사용합니다. 배포 후 Canonical·OG·RSS·Sitemap이 정확한 주소를 사용하도록 Vercel에 `NEXT_PUBLIC_APP_URL`을 설정하는 것을 권장합니다. Preview에도 운영 사이트 URL을 사용해 Preview 주소가 Canonical이 되지 않도록 합니다. 환경변수 변경 후에는 재배포하세요. `.env.local`이나 토큰은 Git에 올리지 않습니다.

## GitHub와 Vercel 배포

현재 저장소는 [sc93/blog](https://github.com/sc93/blog)입니다. 새 저장소에 연결하려면 GitHub에서 빈 저장소를 만들고 기존 origin 주소를 변경합니다.

```bash
git remote set-url origin https://github.com/사용자/저장소.git
git push -u origin main
```

1. Vercel에서 해당 GitHub 저장소를 Import합니다. Framework는 Next.js, Root Directory는 프로젝트 루트를 사용합니다.
2. Node.js 24, 패키지 매니저 pnpm, Build Command `pnpm build`를 사용합니다. 별도의 DB·CMS 설정은 없습니다.
3. 프로젝트 환경변수에 실제 `NEXT_PUBLIC_APP_URL`을 설정합니다.
4. Production Branch를 `main`으로 설정합니다. main push는 프로덕션 배포, PR과 다른 브랜치는 Preview 배포에 사용합니다.
5. Domains에서 도메인을 연결했다면 URL 환경변수도 갱신하고 재배포합니다.
6. 배포 후 글 상세, 필터, 다크 모드, `/rss.xml`, `/sitemap.xml`, `/robots.txt`를 확인합니다.

공개 글 상세는 빌드 시 정적 생성되며 쿼리 필터를 사용하는 목록은 서버에서 렌더링합니다. Google Fonts를 사용하는 기존 템플릿이므로 빌드 환경에서 Google Fonts에 접근할 수 있어야 합니다.

## 작업 브랜치와 PR

새 기능, 설정 변경이나 새 글 작성·발행은 최신 main에서 새 `codex/<작업명>` 브랜치를 만들어 진행합니다. 같은 PR의 피드백 수정은 해당 브랜치를 계속 사용합니다.

커밋은 작업 단위로 나누고 `<종류>: <한글 간략 설명>` 형식으로 작성합니다.

```text
feat: 글 검색 기능 추가
fix: 태그 필터 오류 수정
docs: 영어 표현 학습 글 작성
chore: 개발 환경 설정 정리
```

검증 후 작업 브랜치를 푸시하고 main 대상 PR을 만듭니다. PR 제목도 같은 형식을 사용하고, 본문에 변경 이유·작업 내용·검증 결과를 한국어로 작성합니다. 글 작업에는 공개 여부를 포함합니다. PR 생성 후 코드·콘텐츠 리뷰 결과를 PR에 남기고, 상세 리뷰 지침이 제공되면 해당 지침을 적용합니다. 병합은 사용자의 명시적인 요청이 있을 때 진행합니다.

AI 지침의 진입점은 [AGENTS.md](AGENTS.md)입니다. 상세 지침은 적용 범위별로 분리합니다.

- [Git 작업 절차](docs/ai/git-workflow.md): 브랜치·커밋·푸시·PR
- [코드 리뷰 지침](docs/ai/code-review.md): 리뷰와 결과 기록, 추후 상세 지침
- [검증 지침](docs/ai/verification.md): 변경 종류별 검사
- [콘텐츠 지침](src/content/AGENTS.md): 글 메타데이터와 공개 규칙

PR 작성 양식은 [.github/PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md)에 있습니다.

## 라이선스와 출처

MIT License. 원본 템플릿 작성자 cakegaly와 [next-minimal-blog](https://github.com/cakegaly/next-minimal-blog)에 감사드립니다. 기존 디자인과 shadcn/ui 기반 컴포넌트, MDX 렌더링, 문법 강조, 다크 모드를 재사용했습니다. 작업 지침은 `AGENTS.md`를 참고하세요.
