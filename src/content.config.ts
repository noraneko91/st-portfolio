import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
import type { Lang } from './i18n/config';
import { phases } from './lib/phases';

/*
 * コンテンツは YAML に置き、ページはこのスキーマに沿ったデータを表示するだけにする（内容の修正はデータだけで済む）
 * 콘텐츠는 YAML에 두고, 페이지는 이 스키마에 맞는 데이터를 표시하기만 한다 (내용 수정은 데이터만으로 끝난다)
 */

const text = z.string().min(1);

// 言語ごとに変わる文。4言語のどれかが欠けるとビルドエラーになる (ADR 0003 と同じ方針) / 언어마다 바뀌는 문장. 4개 언어 중 하나라도 빠지면 빌드 에러 (ADR 0003과 같은 방침)
const localized = z.object({ ja: text, en: text, zh: text, ko: text } satisfies Record<Lang, typeof text>);

// "2023-08" 形式。期間計算に使う / "2023-08" 형식. 기간 계산에 쓴다
const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'YYYY-MM 形式で書く / YYYY-MM 형식으로 쓴다');


const profile = defineCollection({
  loader: file('src/content/profile.yaml'),
  schema: z.object({
    displayName: text,
    title: localized,
    // Home の冒頭に出す「何をする人か」の一文 / Home 첫머리에 표시하는 "무엇을 하는 사람인지" 한 문장
    headline: localized,
    // headline の中で強調する語 (技術名なので4言語共通。各言語の headline にそのまま含める) / headline 안에서 강조할 말 (기술명이라 4개 언어 공통. 각 언어 headline에 그대로 넣는다)
    headlineHighlights: z.array(text).default([]),
    location: localized,
    intro: z.array(localized),
    // About の「これから」: 目指す方向 / About의 "앞으로": 지향하는 방향
    growth: z.array(localized).default([]),
    strengths: z.array(localized),
    languages: z.array(z.object({ name: localized, level: localized.optional() })),
    // 空文字の間はメールリンクを表示しない / 빈 문자열인 동안은 메일 링크를 표시하지 않는다
    email: z.union([z.literal(''), z.email()]),
    github: text,
  }),
});

const skills = defineCollection({
  loader: file('src/content/skills.yaml'),
  schema: z.object({
    name: text,
    category: z.enum(['language', 'framework', 'cloud', 'database', 'tool']),
    detail: text.optional(),
    // Home のカードに代表スキルとして出す / Home 카드에 대표 스킬로 표시한다
    featured: z.boolean().default(false),
    // 自己評価は未定のため表示しない / 자기 평가는 미정이라 표시하지 않는다
    level: z.number().int().min(1).max(5).optional(),
  }),
});

const career = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/career' }),
  schema: z.object({
    start: yearMonth,
    // 省略すると「現在」 / 생략하면 "현재"
    end: yearMonth.optional(),
    role: z.enum(['sl', 'se', 'pg']),
    industry: localized,
    title: localized,
    summary: z.array(localized).default([]),
    duties: z.array(localized),
    scale: z
      .object({
        classes: z.number().int().positive().optional(),
        tables: z.number().int().positive().optional(),
        team: z.number().int().positive().optional(),
      })
      .default({}),
    // skills.yaml の id を参照。存在しない id はビルドエラー / skills.yaml의 id를 참조. 없는 id는 빌드 에러
    tech: z.array(reference('skills')),
    phases: z.array(z.enum(phases)).default([]),
  }),
});

const certifications = defineCollection({
  loader: file('src/content/certifications.yaml'),
  schema: z.object({
    name: text,
    date: yearMonth.optional(),
  }),
});

// 個人開発。1 プロジェクト = 1 YAML (npm run new:project <slug> でひな形を作る) / 개인 개발. 1 프로젝트 = 1 YAML (npm run new:project <slug>로 템플릿을 만든다)
const projects = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/projects' }),
  schema: z.object({
    title: localized,
    summary: localized,
    // learning: 講座・学習用 / build: 自分で企画した制作物 / learning: 강의·학습용 / build: 직접 기획한 제작물
    category: z.enum(['learning', 'build']),
    status: z.enum(['in-progress', 'completed']),
    // 内容を確認するまでサイトに出さない / 내용을 확인할 때까지 사이트에 표시하지 않는다
    draft: z.boolean().default(false),
    start: yearMonth,
    end: yearMonth.optional(),
    // skills.yaml の id を参照 / skills.yaml의 id를 참조
    tech: z.array(reference('skills')).default([]),
    github: z.array(z.url()).min(1),
    demo: z.url().optional(),
    // 一覧のサムネイル。省略するとパスから表紙を自動で作る / 목록 썸네일. 생략하면 경로로 표지를 자동으로 만든다
    thumbnail: z.object({ src: text, alt: localized }).optional(),

    // ---- 詳細ページ用 (overview がある項目だけ詳細ページを作る) / 상세 페이지용 (overview가 있는 항목만 상세 페이지를 만든다) ----
    overview: z.array(localized).default([]),
    phases: z.array(z.enum(phases)).default([]),
    // バージョン付きの技術スタック / 버전이 붙은 기술 스택
    stack: z
      .array(
        z.object({
          name: text,
          version: text.optional(),
          purpose: localized.optional(),
        }),
      )
      .default([]),
    // AWS 構成図。画像は public/ 以下に置く / AWS 구성도. 이미지는 public/ 아래에 둔다
    diagram: z.object({ src: text, alt: localized }).optional(),
    decisions: z
      .array(
        z.object({
          topic: localized,
          reason: localized,
          alternatives: localized.optional(),
          adr: z.url().optional(),
        }),
      )
      .default([]),
    challenges: z.array(z.object({ problem: localized, solution: localized })).default([]),
    zenn: z.url().optional(),
  }),
});

export const collections = { profile, skills, career, certifications, projects };
