/*
 * ページ見出しに添える 16×16 のドット絵 (オリジナル)。1 文字 = 1 マスで、'.' は透明
 * 페이지 제목에 곁들이는 16×16 도트 그림 (오리지널). 1글자 = 1칸이고 '.'은 투명
 */

export const palette: Record<string, string> = {
  k: '#26233a', // 輪郭 / 윤곽
  w: '#ffffff',
  l: '#fff4d6', // 紙 / 종이
  g: '#c9cbd6',
  d: '#8a8fa3',
  b: '#4f7cff',
  B: '#2f4fc8',
  c: '#9fe8ff',
  y: '#ffd23f',
  o: '#ff9f1c',
  r: '#ff5964',
  p: '#9b5de5',
  P: '#6a3fb5',
  n: '#c27a3a',
  N: '#7a4416',
  G: '#3cbf6a',
};

export const sprites = {
  // ノートパソコン (プロフィール) / 노트북 (프로필)
  laptop: [
    '................',
    '..kkkkkkkkkkkk..',
    '..kddddddddddk..',
    '..kdbbbbbbbbdk..',
    '..kdbcbbbbbbdk..',
    '..kdbbwwbbbbdk..',
    '..kdbbbbwwwbdk..',
    '..kdbwwbbbbbdk..',
    '..kdbbbbbbbbdk..',
    '..kddddddddddk..',
    '..kkkkkkkkkkkk..',
    '.kggggggggggggk.',
    'kgdgdgdgdgdgdggk',
    'kggggggkkggggggk',
    '.kkkkkkkkkkkkkk.',
    '................',
  ],
  // スキルブック (スキル) / 스킬북 (스킬)
  skillbook: [
    '................',
    '.kkkkkkkkkkkkkk.',
    '.kNppppppppppPk.',
    '.kNpppppyppppPk.',
    '.kNppppywypppPk.',
    '.kNpppyoyoyppPk.',
    '.kNppppyoypppPk.',
    '.kNpppppyppppPk.',
    '.kNppppppppppPk.',
    '.kNpyyyyyyyypPk.',
    '.kNppppppppppPk.',
    '.kNppppppppppPk.',
    '.kNwwwwwwwwwwwk.',
    '.kNgggggggggggk.',
    '.kkkkkkkkkkkkkk.',
    '................',
  ],
  // タスクボード (プロジェクト) / 태스크 보드 (프로젝트)
  board: [
    '......kkkk......',
    '..kkkkkddkkkkk..',
    '..knnnkddknnnk..',
    '..knwwwkkwwwnk..',
    '..knwwwwwwwwnk..',
    '..knwwGwbbbbnk..',
    '..knGGwwwwwwnk..',
    '..knwwwwwwwwnk..',
    '..knwwGwbbbwnk..',
    '..knGGwwwwwwnk..',
    '..knwwwwwwwwnk..',
    '..knwwrwbbbbnk..',
    '..knwwwwwwwwnk..',
    '..knnnnnnnnnnk..',
    '..kkkkkkkkkkkk..',
    '................',
  ],
  // 手紙 (お問い合わせ) / 편지 (문의)
  letter: [
    '................',
    '............y...',
    '...........yyy..',
    '.kkkkkkkkkkkkkk.',
    '.kkllllllllllkk.',
    '.klkllllllllklk.',
    '.kllkllllllkllk.',
    '.klllklrrlklllk.',
    '.kllllkrrkllllk.',
    '.klllklkklklllk.',
    '.kllkllllllkllk.',
    '.klkllllllllklk.',
    '.kkllllllllllkk.',
    '.kkkkkkkkkkkkkk.',
    '................',
    '................',
  ],
} satisfies Record<string, string[]>;

export type PixelIconName = keyof typeof sprites;

// 同じ色が横に続くマスを 1 つの rect にまとめ、要素数を減らす / 같은 색이 가로로 이어지는 칸을 하나의 rect로 묶어 요소 수를 줄인다
export function toRects(name: PixelIconName) {
  const rects: { x: number; y: number; w: number; fill: string }[] = [];
  sprites[name].forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const key = row[x];
      let w = 1;
      while (row[x + w] === key) w++;
      if (key !== '.') rects.push({ x, y, w, fill: palette[key] });
      x += w;
    }
  });
  return rects;
}
