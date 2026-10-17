# 콘텐츠 확정 체크리스트

콘텐츠 확정 단계에서 직접 정해야 할 항목입니다(1~6절). 사이트에는 노출되지 않고, 해당 YAML에 `# TODO:` 주석으로 남아 있습니다. 7~8절은 직접 확인할 항목과 도메인을 정했을 때의 작업입니다.

**확정하는 방법**

1. 해당 파일의 값을 고친다
2. 그 위의 `# TODO:` 주석을 지운다
3. 이 문서의 체크박스를 체크한다
4. `npm run build`가 통과하면 커밋한다

남은 TODO 주석은 `grep -rn "TODO" src/content`로 확인할 수 있습니다.

---

## 1. 경력 (`src/content/career/`)

- [ ] **생명보험 (2023-08~2026-09)**: 담당 공정 확인. 스킬 시트의 ○ 7개를 "요건 정의~통합 테스트" 7개로 추정했음
  → `2023-08-life-insurance.yaml` 의 `phases`
- [ ] **주택담보대출 (2021-07~2023-06)**: 담당 공정 확인. ○ 5개로 추정했고, 통합 테스트를 넣을지 확인 필요
  → `2021-07-housing-loan.yaml` 의 `phases`
- [ ] **손해보험·부동산 (2019-11~2021-05)**: 담당 공정 확인. 스킬 시트는 ○ 4개이지만 어느 공정인지 몰라, 담당 내용을 보고 3개(구현·단위 테스트·통합 테스트)만 넣었음
  → `2019-11-insurance-migration.yaml` 의 `phases`
- [ ] **인력 파견 (2019-05~2019-10)**: 담당 공정 확인(○ 3개로 추정). 안건 4·5의 기간이 맞는지 확인
  → `2019-05-staffing.yaml` 의 `start` / `end` / `phases`
- [ ] **무역 (2018-12~2019-04)**: 기간과 담당 공정 확인(○ 2개로 추정)
  → `2018-12-trading.yaml` 의 `start` / `end` / `phases`

## 2. 스킬·자격 (`src/content/skills.yaml`, `certifications.yaml`)

- [ ] **Python 경험 연수**: 스킬 시트는 2년이지만, 경력 기간으로 계산하면 약 3년(안건 1의 38개월)으로 표시됨. 계산값 그대로 둘지 결정
  - 연수는 경력 데이터에서 자동 계산되므로, 바꾸려면 경력의 `tech` 또는 계산 방식을 조정해야 함
- [ ] **PHP**: 안건 1에서 실제로 쓴 비율 확인. 지금은 안건 1의 전체 기간(약 3년)이 표시됨
- [ ] **Laravel**: 사용 기간 확인. 지금은 안건 1의 전체 기간(약 3년)이 표시됨
- [ ] **Microsoft Azure Fundamentals**: 취득 연월 (`date: "YYYY-MM"` 형식으로 추가)

## 3. 프로필 (`src/content/profile.yaml`)

- [ ] **영어·중국어 레벨**: `languages` 의 영어·중국어 항목에 `level` 추가 (지금은 언어 이름만 표시)
- [ ] **포트폴리오용 메일 주소**: 만든 뒤 `email` 에 설정. 비어 있는 동안은 Contact에 메일 링크가 나오지 않음
- [ ] **자기소개 문장 확정**: `headline`(Home의 큰 한 문장), `intro`(About 소개 3문단), `strengths`(강점 분야 3개)

## 4. 프로젝트 (`src/content/projects/`)

- [ ] **st-portfolio 담당 공정**: 개인 개발이라 전 공정이지만, 무엇을 표시할지 결정. 지금은 요건 정의·기본 설계·상세 설계·구현·통합 테스트
  → `st-portfolio.yaml` 의 `phases`
- [ ] **st-portfolio 기술 버전**: 패키지를 업데이트할 때마다 `package.json`, `CLAUDE.md` "버전 기록"과 함께 갱신
  → `st-portfolio.yaml` 의 `stack`
- [ ] **경비정산 시스템**: 개발을 재개하면 개요 / AWS 구성도 / 기술 선정 이유 / 고민한 점을 추가하고 `status: published` 로 변경. 계속 쉬는 동안 숨기려면 `status: hidden`
  → `expense-workflow.yaml`

## 5. 제가 대신 정한 것 (확인 후 그대로 두거나 수정)

- [ ] **IDE 제외**: 재료에 있던 VS Code·Eclipse는 경력의 기술 목록에서 뺐음
- [ ] **도구 경험 연수**: Git·SVN·Jenkins·Maven·UFT One도 경력 기간으로 계산해 표시 (재료에서는 "—"). 예: Git 약 5년
- [ ] **스킬 레벨**: 스키마에 `level`(1~5) 필드만 있고 표시하지 않음. 표시할지 결정
- [ ] **About 제목 중복**: ja에서 페이지 제목 "経歴"와 섹션 "03 — 経歴"가 겹침. 페이지 제목을 "プロフィール・経歴" 등으로 바꿀지
  → `src/i18n/*.ts` 의 `about.title`
- [ ] **사이트 이름**: 지금은 "ポートフォリオ / Portfolio / 作品集 / 포트폴리오". 이름(K.S 등)을 넣을지
  → `src/i18n/*.ts` 의 `site.name`

## 6. 번역 검토 (번역 단계)

en / zh / ko는 모두 초안 번역입니다. ja를 원문으로 두고 다음을 검토합니다.

- [ ] `src/i18n/en.ts` · `zh.ts` · `ko.ts` (UI 문구)
- [ ] `src/content/profile.yaml`
- [ ] `src/content/career/*.yaml` (5건)
- [ ] `src/content/projects/*.yaml` (2건)

## 7. 직접 확인할 것 (품질 단계에서 남긴 항목)

자동 점검(Lighthouse, 키보드 조작, JS 끔, 제목 구조, 색 대비)은 끝났습니다. 아래는 사람이 직접 확인해야 하는 항목입니다.

- [ ] **스크린리더** (Windows: NVDA 또는 내레이터, iPhone: VoiceOver)
  - [ ] 언어 버튼이 "JA 言語を選択"처럼 읽히는지
  - [ ] 언어 메뉴 항목의 선택 상태(선택됨/선택 안 됨)가 읽히는지, 각 언어 이름이 그 언어 발음으로 읽히는지
  - [ ] 메뉴의 ●/○ 기호를 읽지 않는지
  - [ ] 섹션 제목에서 번호와 "—"를 읽지 않고 이름만 읽는지 (예: "プロフィール")
  - [ ] 기간 "2023年8月 – 2026年9月"의 "–"가 어색하게 읽히지 않는지
- [ ] **SNS 공유 미리보기**: URL을 X·Slack·LINE 등에 붙여 OGP 이미지와 제목이 나오는지

## 8. 도메인을 정했을 때

- [ ] `astro.config.mjs` 의 `site` 변경 (canonical·hreflang·sitemap·og:url이 함께 바뀜)
- [ ] `scripts/brand/og-image.svg` 의 URL 줄을 고치고 `npm run brand` 로 OGP 이미지 재생성
- [ ] `README.md` 의 공개 URL 변경
