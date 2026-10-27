# 콘텐츠 작업 지침

`src/content/` 아래 글 작성·수정·발행에 적용한다. 콘텐츠를 읽거나 공개하는 코드를 수정할 때도 이 문서를 읽는다. 공통 원칙은 루트 [AGENTS.md](../../AGENTS.md), 작업 절차와 검증은 해당 문서가 안내하는 지침을 따른다.

## 저장 구조와 메타데이터

- 글은 `src/content/blog/*.mdx`에서 관리한다. slug는 파일명이며 전체에서 고유한 소문자 영문·숫자·하이픈으로 작성한다.
- Frontmatter의 `title`, `description`, `date`, `category`, `tags`, `published`를 검증한다. `date`는 따옴표로 감싼 실제 날짜 `YYYY-MM-DD`다. 초안의 description은 빈 문자열을 허용한다.
- 카테고리 정의는 [src/lib/content.ts](../lib/content.ts)의 `categories` 한 곳에서 관리한다. 태그는 Frontmatter에서 자유롭게 작성한다.
- 글 생성은 기존 `pnpm new:post`를 사용한다. 기본 `published: false`와 기존 파일 덮어쓰기 방지를 유지한다.

## 공개와 렌더링

- `published: false` 글은 개발 서버에서만 확인 가능하다. 프로덕션 홈·목록·태그·상세·Sitemap·RSS에서 제외한다. 배포 환경변수로 초안 노출을 활성화하지 않는다.
- 사이트 URL과 작성자 등 기본 정보는 기존 공통 설정에서 관리한다.
- 기존 MDX 컴포넌트·이미지 처리·코드 강조를 재사용한다. 구체적인 작성 방법과 필드 설명은 [README](../../README.md#글-작성)를 참고한다.
