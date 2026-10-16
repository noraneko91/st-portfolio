// ja が原文。ここにキーを追加すると、他の言語で同じキーがない場合に型エラーになる / ja가 원문. 여기에 키를 추가하면 다른 언어에 같은 키가 없을 때 타입 에러가 난다
export const ja = {
  'site.name': 'ポートフォリオ',

  'home.title': 'ホーム',
  'home.description': '経歴・スキル・個人開発プロジェクトを紹介するポートフォリオサイトです。',
  'about.title': '経歴',
  'about.description': 'これまでの経歴を紹介します。',
  'about.section.profile': 'プロフィール',
  'about.section.career': '経歴',
  'skills.title': 'スキル',
  'skills.description': '扱える技術とスキルを紹介します。',
  'projects.title': 'プロジェクト',
  'projects.description': '個人開発プロジェクトを紹介します。',
  'contact.title': 'お問い合わせ',
  'contact.description': '連絡先のご案内です。',

  'notFound.title': 'ページが見つかりません',
  'notFound.message': 'お探しのページは移動または削除された可能性があります。',
  'notFound.home': 'ホームへ戻る',

  'nav.label': 'メインメニュー',
  'nav.skip': '本文へスキップ',
  'lang.label': '言語を選択',
};

export type TranslationKey = keyof typeof ja;
export type Translation = Record<TranslationKey, string>;
