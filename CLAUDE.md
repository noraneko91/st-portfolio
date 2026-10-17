# CLAUDE.md — st-portfolio

## 프로젝트 개요 / プロジェクト概要
- 경력·기술·개인 개발을 소개하는 다국어 포트폴리오 사이트
- 정적 사이트(DB·서버 없음), 모바일 우선 반응형, 4개 언어 지원
- Python+AWS 역량은 Projects 페이지에서 개인 개발 프로젝트로 소개한다 (사이트 자체는 AWS를 쓰지 않음)

## 기술 스택 / 技術スタック
- 언어: TypeScript (strict)
- 프레임워크: Astro (최신 안정판. 설치 후 `npx astro --version`으로 확인해 아래에 기록)
- 스타일: Tailwind CSS (최신 안정판. 버전 기록)
- UI 부품: 조작이 많은 부품만 React island + shadcn/ui (지금은 커맨드 팔레트만. ADR 0005)
- 호스팅: Cloudflare (GitHub push 시 자동 배포)
- 패키지 매니저: npm / Node.js: 짝수 LTS 버전 (`.nvmrc`로 고정)
- 버전 기록: Astro [7.4.0] / Tailwind CSS [4.3.3] (@tailwindcss/vite 4.3.3) / Node.js [24.16.0]
  - TypeScript [6.0.3] (^6): TS 7은 @astrojs/check가 지원하지 않아(peer: ^5 || ^6) 6을 사용
  - @astrojs/check [0.9.10] / wrangler [4.151.1] / @astrojs/sitemap [3.7.4]
  - React [19.3.1] / @astrojs/react [7.1.0] / cmdk [1.1.1] / radix-ui [1.8.1] / cn [0.5.0] (shadcn/ui Command·Dialog)

## 디렉터리 구성 / ディレクトリ構成
```
src/
  i18n/          # 번역 파일(ja.ts, en.ts, zh.ts, ko.ts)과 헬퍼 / 翻訳ファイルとヘルパー
  content/       # Projects 등 콘텐츠(언어별) / コンテンツ(言語別)
  components/    # 재사용 컴포넌트 / 再利用コンポーネント
    ui/          # shadcn/ui 부품 (사이트 색 변수에 맞춰 고쳐 쓴다) / shadcn/ui 部品 (配色変数に合わせて調整)
    command/     # 커맨드 팔레트 (React island) / コマンドパレット
  layouts/       # 공통 레이아웃 / 共通レイアウト
  lib/           # 콘텐츠 조회·기간 계산·빌드 정보 / コンテンツ取得・期間計算・ビルド情報
  pages/
    index.astro  # 루트: 언어 판별 후 /{lang}/ 로 이동 / ルート: 言語判定してリダイレクト
    [lang]/      # 언어별 페이지 / 言語別ページ
  styles/
public/          # 이미지·favicon 등 정적 파일
```

## 페이지 구성 / ページ構成
- Home / About(自己紹介・これから) / Skills / Projects / Contact (ADR 0006)
- Projects는 경로 기반 탭 2개 / パスベースのタブ2つ:
  - 業務経歴 /[lang]/projects/work/ (경력 + git log 풍 타임라인)
  - 個人開発 /[lang]/projects/personal/ (목록), /[lang]/projects/personal/[slug]/ (상세)
  - /[lang]/projects/ 는 業務経歴으로 리다이렉트
- 個人開発는 1건 = 1 YAML. 추가는 `npm run new:project <slug>` (draft: true로 생성)
  - 확인되지 않은 사실은 쓰지 않는다. 미확인 항목은 draft: true로 비공개
  - fork이고 본인 커밋이 없는 리포는 등록하지 않는다
- 個人開発 상세(overview가 있을 때만): 概要 / AWS構成図 / 技術スタック(버전 명시) / 技術選定理由 /
  担当工程 / 工夫した点・課題と解決 / 링크(GitHub・デモGIF・Zenn)

## 다국어 규칙 / 多言語ルール
- 언어: ja(기본·원문) / en / zh(간체, hreflang은 zh-Hans) / ko
- URL은 언어별 경로: /ja/ /en/ /zh/ /ko/ (쿼리파라미터·JS로 본문을 바꾸는 방식 금지)
- 화면 문구는 반드시 src/i18n/ 번역 파일에서 가져온다. 컴포넌트에 문자열 하드코딩 금지
- 페이지·문구를 추가할 때는 4개 언어를 모두 동시에 작성한다 (빠진 키가 있으면 빌드 시 타입 에러가 나도록 설계)
- 루트(/) 접속: 저장된 언어(localStorage) → 브라우저 언어 → ja 순서로 이동. JS가 꺼져 있을 때를 위해 언어 링크도 표시
- 헤더 우측 언어 선택 드롭다운: 선택 시 같은 페이지의 다른 언어 경로로 이동하고 선택값을 저장
- 모든 페이지에 hreflang(4개 언어 + x-default) 출력, sitemap도 언어별로 출력

## 코드 주석 / コードコメント
- 일본어 + 한국어 병기
  ```ts
  // 言語切替ドロップダウン / 언어 전환 드롭다운
  ```
- "무엇을"보다 "왜"를 적는다. 자명한 코드에는 주석을 달지 않는다

## 커밋 규칙 / コミットルール
- Conventional Commits, 일본어 + 한국어 병기
  ```
  feat: 言語切替を追加 / 언어 전환 추가
  fix: モバイルでメニューが閉じない問題を修正 / 모바일에서 메뉴가 닫히지 않는 문제 수정
  ```
- 타입: feat / fix / docs / style / refactor / chore / perf / test
- 페이지·기능 단위로 작게 커밋한다

## 작업 방식 / 作業方針
- 작업은 작게 나누고, 단계마다 `npm run build`가 통과하는지 확인한 뒤 커밋한다
- 새 라이브러리 추가 전에는 이유와 대안을 설명하고 확인을 받는다
- 읽기 쉬운 구조를 우선하고, 과도한 추상화는 피한다
- 코드 변경 시 핵심 설계 의도를 짧게 설명한다 (면담에서 설명할 수 있도록)
- 경력 기재 시 고객사명·기밀 정보는 업종 수준으로 익명화한다
- 공개 범위: 실명은 로마자 표기(KIM SUNGTAE)로 공개한다. 생년월일·나이·국적·가까운 역·고객사명·개인 메일 주소는 쓰지 않는다

## 디자인 원칙 / デザイン方針
- 모던하고 인터랙티브하게. 단 성능·접근성은 유지한다 (Lighthouse 수치로 확인). 템플릿 같은 흔한 레이아웃은 피한다
- 색은 베이스 + 포인트 컬러 1개 (CSS 변수로 관리). 조작 요소의 hover·열림·포커스도 변수로 통일하고, 색만으로 구분하지 않는다
- JS는 필요한 부품에만. 정적 부분은 Astro, 상호작용이 많은 부품은 React island로 하고 처음 쓸 때 동적 import 한다 (ADR 0005)
- 애니메이션은 CSS 우선 (스크롤 등장·hover·마이크로 인터랙션). prefers-reduced-motion 존중, 등장 애니메이션에 투명도 변화를 쓰지 않는다 (글자 대비 저하 방지)
- 다크모드 지원
- 언어별 폰트를 지정한다 (`html[lang]`으로 전환)
- Lighthouse 각 항목 90점 이상 유지 (특히 Performance·Accessibility)

## 명령어 / コマンド
- `npm run dev` 개발 서버
- `npm run build` 빌드 (커밋 전 필수)
- `npm run preview` 빌드 결과 확인
