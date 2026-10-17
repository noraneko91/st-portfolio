import { createRoot } from 'react-dom/client';

import { CommandPalette, type PaletteData } from './CommandPalette';

// 初めて呼ばれたときにだけ React を読み込んで描画する (CommandTrigger から動的 import) / 처음 호출될 때만 React를 불러와 그린다 (CommandTrigger에서 동적 import)
export function mountCommandPalette(data: PaletteData) {
  const container = document.createElement('div');
  document.body.append(container);
  createRoot(container).render(<CommandPalette data={data} initialOpen />);
}
