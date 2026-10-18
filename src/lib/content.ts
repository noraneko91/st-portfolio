import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { htmlLang, type Lang } from '../i18n/config';
import type { useTranslations } from '../i18n/utils';

/*
 * コンテンツの取得と計算をここにまとめ、ページは表示だけを担当する
 * 콘텐츠 조회와 계산을 여기에 모으고, 페이지는 표시만 담당한다
 */

export type Career = CollectionEntry<'career'>;
export type Skill = CollectionEntry<'skills'>;
export type Project = CollectionEntry<'projects'>;

// "2023-08" → 月の通し番号 / 월 일련번호
function toMonthIndex(yearMonth: string): number {
  const [year, month] = yearMonth.split('-').map(Number);
  return year * 12 + (month - 1);
}

// 終了月が未設定（進行中）の場合はビルド時点の月まで数える / 종료 월이 없으면(진행 중) 빌드 시점의 월까지 센다
function currentYearMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

type Period = { start: string; end?: string };

// 期間が重なる案件を二重に数えないよう、月単位で和集合を取る / 기간이 겹치는 안건을 중복으로 세지 않도록 월 단위로 합집합을 구한다
export function totalMonths(periods: Period[]): number {
  const months = new Set<number>();
  for (const { start, end } of periods) {
    const last = toMonthIndex(end ?? currentYearMonth());
    for (let m = toMonthIndex(start); m <= last; m++) months.add(m);
  }
  return months.size;
}

// 0.5 年単位に丸める。ちょうど中間の場合は短い方に寄せる（経歴の年数を多めに見せないため）
// 0.5년 단위로 반올림한다. 정확히 중간이면 짧은 쪽으로 (경력 연수를 부풀려 보이지 않기 위해)
export function toYears(months: number): number {
  return Math.max(0.5, Math.ceil(months / 6 - 0.5) / 2);
}

// 「約 n 年」の表記。英語の単数形のため 1 年だけ別の文を使う / "약 n년" 표기. 영어 단수형 때문에 1년만 다른 문장을 쓴다
export function formatYears(months: number, t: ReturnType<typeof useTranslations>): string {
  const years = toYears(months);
  return years === 1 ? t('unit.years.one') : t('unit.years', { n: years });
}

export function formatYearMonth(yearMonth: string, lang: Lang): string {
  const [year, month] = yearMonth.split('-').map(Number);
  return new Intl.DateTimeFormat(htmlLang[lang], { year: 'numeric', month: 'short', timeZone: 'UTC' }).format(
    new Date(Date.UTC(year, month - 1)),
  );
}

// 全経歴の合計（重複期間は1回） / 전체 경력 합계 (겹치는 기간은 1번)
export async function getTotalCareerMonths(): Promise<number> {
  const { careers } = await loadCareersAndSkills();
  return totalMonths(careers.map((career) => career.data));
}

export async function getProfile() {
  const entry = await getEntry('profile', 'main');
  if (!entry) throw new Error('src/content/profile.yaml に main がありません / main이 없습니다');
  return entry.data;
}

// reference() は存在しない id を警告するだけでビルドは通るため、ここで止める (経歴と個人開発の両方)
// reference()는 존재하지 않는 id를 경고만 하고 빌드는 통과하므로 여기서 멈춘다 (경력과 개인 개발 모두)
async function loadCareersAndSkills() {
  const [careers, skills, projects] = await Promise.all([
    getCollection('career'),
    getCollection('skills'),
    getCollection('projects'),
  ]);
  const skillIds = new Set(skills.map((skill) => skill.id));
  const check = (file: string, tech: { id: string }[]) => {
    const unknown = tech.filter((ref) => !skillIds.has(ref.id)).map((ref) => ref.id);
    if (unknown.length > 0) {
      throw new Error(`${file}: skills.yaml にない tech / skills.yaml에 없는 tech: ${unknown.join(', ')}`);
    }
  };
  for (const career of careers) check(`career/${career.id}.yaml`, career.data.tech);
  for (const project of projects) check(`projects/${project.id}.yaml`, project.data.tech);
  return { careers, skills, projects: projects.filter((project) => !project.data.draft) };
}

// 新しい順 / 최신순
export async function getCareers(): Promise<Career[]> {
  const { careers } = await loadCareersAndSkills();
  return careers.sort((a, b) => toMonthIndex(b.data.start) - toMonthIndex(a.data.start));
}

export async function getSkillNames(): Promise<Map<string, string>> {
  const { skills } = await loadCareersAndSkills();
  return new Map(skills.map((skill) => [skill.id, skill.data.name]));
}

// スキルごとの経験月数。経歴の tech から計算し、表示上の年数が長い順（同じなら名前順）に並べる
// 스킬별 경험 개월 수. 경력의 tech에서 계산하고, 표시되는 연수가 긴 순 (같으면 이름순)으로 정렬한다
export async function getSkillsWithMonths() {
  const { careers, skills, projects } = await loadCareersAndSkills();
  return skills
    .map((skill) => {
      const used = careers.filter((career) => career.data.tech.some((ref) => ref.id === skill.id));
      // 業務経歴にない技術は、公開中の個人開発で使っていれば「個人開発」として示す / 업무 경력에 없는 기술은 공개 중인 개인 개발에서 썼으면 "개인 개발"로 표시한다
      const personal = projects.some((project) => project.data.tech.some((ref) => ref.id === skill.id));
      return { skill, months: totalMonths(used.map((career) => career.data)), personal };
    })
    .filter(({ months, personal }) => months > 0 || personal)
    .sort(
      (a, b) =>
        (b.months > 0 ? toYears(b.months) : 0) - (a.months > 0 ? toYears(a.months) : 0) ||
        a.skill.data.name.localeCompare(b.skill.data.name),
    );
}

// 新しい順。年月のないものは最後 / 최신순. 연월이 없는 것은 마지막
export async function getCertifications() {
  const certifications = await getCollection('certifications');
  return certifications.sort((a, b) => (b.data.date ?? '').localeCompare(a.data.date ?? ''));
}

// 個人開発。draft を除き、開始が新しい順 / 개인 개발. draft를 빼고 시작이 최신인 순
export async function getProjects(): Promise<Project[]> {
  const { projects } = await loadCareersAndSkills();
  return projects.sort((a, b) => toMonthIndex(b.data.start) - toMonthIndex(a.data.start));
}

// 概要がある項目だけ詳細ページを作る (中身のない詳細ページを作らない) / 개요가 있는 항목만 상세 페이지를 만든다 (내용 없는 상세 페이지를 만들지 않는다)
export function hasDetailPage(project: Project): boolean {
  return project.data.overview.length > 0;
}
