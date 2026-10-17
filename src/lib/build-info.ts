import { execSync } from 'node:child_process';

/*
 * フッターに出すビルド情報。ビルド時に一度だけ決まる
 * 푸터에 표시하는 빌드 정보. 빌드 시 한 번만 정해진다
 */

export const repositoryUrl = 'https://github.com/noraneko91/st-portfolio';

// Workers Builds が渡す WORKERS_CI_COMMIT_SHA を優先し、ローカルでは git から取る。どちらもなければ "local"
// Workers Builds가 주는 WORKERS_CI_COMMIT_SHA를 우선하고, 로컬에서는 git에서 가져온다. 둘 다 없으면 "local"
function resolveCommit(): string | undefined {
  const fromCi = process.env.WORKERS_CI_COMMIT_SHA;
  if (fromCi) return fromCi;
  try {
    return execSync('git rev-parse HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return undefined;
  }
}

const commit = resolveCommit();

export const buildInfo = {
  shortSha: commit ? commit.slice(0, 7) : 'local',
  commitUrl: commit ? `${repositoryUrl}/commit/${commit}` : undefined,
  // 日付は言語に依存しない ISO 形式 (YYYY-MM-DD) / 날짜는 언어에 의존하지 않는 ISO 형식 (YYYY-MM-DD)
  date: new Date().toISOString().slice(0, 10),
};
