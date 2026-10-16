// 担当工程。この順で表示し、表示名は i18n ファイルの phase.* で管理する
// 담당 공정. 이 순서로 표시하고, 표시명은 i18n 파일의 phase.*에서 관리한다
export const phases = [
  'requirements',
  'research',
  'basic-design',
  'detailed-design',
  'implementation',
  'unit-test',
  'integration-test',
] as const;

export type Phase = (typeof phases)[number];

export function sortPhases(values: readonly Phase[]): Phase[] {
  return phases.filter((phase) => values.includes(phase));
}
