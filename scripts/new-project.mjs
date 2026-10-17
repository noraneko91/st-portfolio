// 個人開発のひな形を作る / 개인 개발 템플릿을 만든다
// 使い方 / 사용법: npm run new:project <slug>   (例 / 예: npm run new:project todo-app)
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const slug = process.argv[2];

// slug はそのまま URL (/[lang]/projects/personal/<slug>/) になるため、小文字・数字・ハイフンだけにする
// slug는 그대로 URL (/[lang]/projects/personal/<slug>/)이 되므로 소문자·숫자·하이픈만 허용한다
if (!slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
  console.error('slug を指定してください (小文字・数字・ハイフン) / slug를 지정해 주세요 (소문자·숫자·하이픈)');
  console.error('例 / 예: npm run new:project todo-app');
  process.exit(1);
}

const file = `src/content/projects/${slug}.yaml`;
if (existsSync(file)) {
  console.error(`${file} はすでにあります / 이미 있습니다`);
  process.exit(1);
}

const githubAccount = readFileSync('src/content/profile.yaml', 'utf8').match(/^\s*github:\s*(\S+)/m)?.[1] ?? 'your-account';
const now = new Date();
const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
const todo = (indent) => ['ja', 'en', 'zh', 'ko'].map((lang) => `${indent}${lang}: TODO`).join('\n');

const template = `# TODO: 内容を確認したら draft: false にしてサイトに出す / 내용을 확인하면 draft: false로 바꿔 사이트에 표시한다
draft: true
title:
${todo('  ')}
summary:
${todo('  ')}
# learning: 講座・学習用 / build: 自分で企画した制作物 / learning: 강의·학습용 / build: 직접 기획한 제작물
category: build
# in-progress | completed
status: in-progress
start: "${yearMonth}"
# end: "YYYY-MM"
# skills.yaml の id。ない技術は skills.yaml に先に追加する / skills.yaml의 id. 없는 기술은 skills.yaml에 먼저 추가한다
tech: []
github:
  - https://github.com/${githubAccount}/${slug}
# demo: https://...
# thumbnail:
#   src: /projects/${slug}.png
#   alt:
${todo('#     ')}

# ---- 詳細ページ (overview を書くと詳細ページができる) / 상세 페이지 (overview를 쓰면 상세 페이지가 생긴다) ----
# overview:
#   - ja: ...
#     en: ...
#     zh: ...
#     ko: ...
`;

writeFileSync(file, template);
console.log(`作成しました / 만들었습니다: ${file}`);
console.log('次: TODO を埋め、tech を skills.yaml の id で書き、draft: false にして npm run build');
console.log('다음: TODO를 채우고, tech를 skills.yaml의 id로 쓰고, draft: false로 바꾼 뒤 npm run build');
