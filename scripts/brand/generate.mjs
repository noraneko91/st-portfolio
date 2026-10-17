// favicon.ico・apple-touch-icon.png・og-image.png を SVG の原本から生成する（ローカルの Chrome を使い、追加パッケージは不要）
// favicon.ico·apple-touch-icon.png·og-image.png를 SVG 원본으로 생성한다 (로컬 Chrome을 쓰며 추가 패키지는 불필요)
//
// 使い方 / 사용법: npm run brand   (Chrome の場所が違う場合 / Chrome 위치가 다르면: CHROME_PATH=... npm run brand)
import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const chromePath = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const faviconSvg = readFileSync('public/favicon.svg', 'utf8');
const ogSvg = readFileSync('scripts/brand/og-image.svg', 'utf8');

const profile = mkdtempSync(join(tmpdir(), 'brand-chrome-'));
const chrome = spawn(chromePath, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--user-data-dir=${profile}`, '--remote-debugging-port=0', 'about:blank'], { stdio: 'ignore' });

// 空いているポートを Chrome に選ばせ、DevToolsActivePort から読む / 빈 포트를 Chrome이 고르게 하고 DevToolsActivePort에서 읽는다
async function connect() {
  for (let i = 0; i < 100; i++) {
    try {
      const port = readFileSync(join(profile, 'DevToolsActivePort'), 'utf8').split('\n')[0].trim();
      const page = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === 'page');
      if (page) return new WebSocket(page.webSocketDebuggerUrl);
    } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(`Chrome を起動できません / Chrome을 실행할 수 없습니다: ${chromePath}`);
}

const ws = await connect();
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let nextId = 0;
const pending = new Map();
ws.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  pending.get(message.id)?.(message);
  pending.delete(message.id);
});
const send = (method, params = {}) =>
  new Promise((resolve) => {
    const id = ++nextId;
    pending.set(id, resolve);
    ws.send(JSON.stringify({ id, method, params }));
  });

// HTML を指定サイズで描画して PNG を返す / HTML을 지정 크기로 그려서 PNG를 반환한다
async function render(html, width, height, transparent) {
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
  await send('Emulation.setDefaultBackgroundColorOverride', transparent ? { color: { r: 0, g: 0, b: 0, a: 0 } } : {});
  await send('Page.navigate', { url: `data:text/html;charset=utf-8,${encodeURIComponent(html)}` });
  await new Promise((r) => setTimeout(r, 500));
  const shot = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width, height, scale: 1 } });
  return Buffer.from(shot.result.data, 'base64');
}

const iconHtml = (size) =>
  `<style>html,body{margin:0;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>${faviconSvg}`;

// iOS は透明部分を黒で塗るため、背景を全面に敷いて枠線は消す / iOS는 투명 부분을 검게 칠하므로 배경을 전면에 깔고 테두리는 없앤다
const touchHtml = `<style>html,body{margin:0;background:#fafaf7}svg{display:block;width:140px;height:140px;margin:20px}.bg{stroke:none!important}</style>${faviconSvg}`;

// PNG をそのまま格納する ICO 形式 (Vista 以降のブラウザが対応) / PNG를 그대로 담는 ICO 형식 (Vista 이후 브라우저가 지원)
function toIco(images) {
  const header = Buffer.alloc(6 + 16 * images.length);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, png }, i) => {
    const entry = 6 + 16 * i;
    header.writeUInt8(size, entry);
    header.writeUInt8(size, entry + 1);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(png.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += png.length;
  });
  return Buffer.concat([header, ...images.map(({ png }) => png)]);
}

try {
  await send('Page.enable');
  const icons = [];
  for (const size of [16, 32]) icons.push({ size, png: await render(iconHtml(size), size, size, true) });
  writeFileSync('public/favicon.ico', toIco(icons));
  writeFileSync('public/apple-touch-icon.png', await render(touchHtml, 180, 180, false));
  writeFileSync('public/og-image.png', await render(`<style>html,body{margin:0}</style>${ogSvg}`, 1200, 630, false));
  console.log('generated: public/favicon.ico, public/apple-touch-icon.png, public/og-image.png');
} finally {
  ws.close();
  chrome.kill();
  await new Promise((r) => setTimeout(r, 500));
  rmSync(profile, { recursive: true, force: true });
}
