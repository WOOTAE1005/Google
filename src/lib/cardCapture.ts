import { toSvg } from 'html-to-image';

// html-to-image의 toPng()/toBlob()가 내부 canvas 변환 단계에서 이 환경에서는
// 이유 모르게 무한 대기(hang)에 빠지는 버그가 있어서, 카드 이미지 저장/복사/
// 공유가 전부 안 되거나(잘리거나) 멈추는 원인이었다. toSvg()까지는 정상
// 작동하는 걸 확인했으므로, 그 이후(SVG → Image → Canvas) 단계만 직접
// 구현해서 우회한다 — 실제로 즉시 정상 동작하는 것을 확인함.
async function svgToCanvas(node: HTMLElement, pixelRatio: number): Promise<HTMLCanvasElement> {
  const rect = node.getBoundingClientRect();
  const svgDataUrl = await toSvg(node, {
    skipFonts: true,
    cacheBust: true,
    width: rect.width,
    height: rect.height,
  });

  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('카드 이미지를 불러오지 못했습니다.'));
    img.src = svgDataUrl;
  });

  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.ceil(rect.width * pixelRatio));
  canvas.height = Math.max(1, Math.ceil(rect.height * pixelRatio));
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('캔버스 컨텍스트를 생성하지 못했습니다.');
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas;
}

export async function captureCardAsPngDataUrl(node: HTMLElement, pixelRatio = 2): Promise<string> {
  const canvas = await svgToCanvas(node, pixelRatio);
  return canvas.toDataURL('image/png');
}

export async function captureCardAsBlob(node: HTMLElement, pixelRatio = 2): Promise<Blob | null> {
  const canvas = await svgToCanvas(node, pixelRatio);
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
}
