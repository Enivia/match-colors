import pDefer from 'p-defer';

type ImageSrc = string | HTMLImageElement;
type Format = 'RGB' | 'HEX';
type Rgb = [number, number, number];
type Config = { format: Format; size: number };
type MatchConfig = Config & { group: number };

function getImageData(imageSrc: ImageSrc): Promise<Uint8ClampedArray> {
  const src = typeof imageSrc === 'string' ? imageSrc : imageSrc.src;
  const defer = pDefer<Uint8ClampedArray>();
  const image = new Image();
  image.crossOrigin = '';
  image.src = src;

  image.onload = () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    const { width, height } = image;
    canvas.width = width;
    canvas.height = height;
    context.drawImage(image, 0, 0);

    const imageData = context.getImageData(0, 0, width, height);
    defer.resolve(imageData.data);
  };
  image.onerror = () => {
    defer.reject(Error('Fail to load image.'));
  };

  return defer.promise;
}

function groupColor(color: number, group: number) {
  return Math.min(Math.round(color / group) * group, 255);
}

function formatColor(rgb: Rgb, format: Format) {
  if (format === 'RGB') {
    return `rgb(${rgb.join(',')})`;
  } else {
    return `#${rgb.map(color => color.toString(16))}`;
  }
}

function getMatchColors(data: Uint8ClampedArray, config: MatchConfig): string[] {
  const { format, group } = config;
  const gap = 4 * config.size;
  const counter: { [k: string]: number } = {};

  for (let i = 0; i < data.length; i += gap) {
    const color = formatColor(
      [
        groupColor(data[i], group),
        groupColor(data[i + 1], group),
        groupColor(data[i + 2], group),
      ],
      format
    );
    counter[color] = counter[color] ? counter[color] + 1 : 1;
  }
  return Object.entries(counter).reduce<string[]>((res, [key, num]) => {
    if (num > 50) res.push(key);
    return res;
  }, []);
}

function getAverage(data: Uint8ClampedArray, config: Config): string {
  const gap = 4 * config.size;
  const count = data.length / gap;
  const rgb = { r: 0, g: 0, b: 0 };

  for (let i = 0; i < data.length; i += gap) {
    rgb.r += data[i];
    rgb.g += data[i + 1];
    rgb.b += data[i + 2];
  }
  return formatColor(
    [Math.round(rgb.r / count), Math.round(rgb.g / count), Math.round(rgb.b / count)],
    config.format
  );
}

const defaultConfig: Config = { format: 'RGB', size: 5 };
/* get avarage color */
export async function avarage(image: ImageSrc, config?: Partial<Config>) {
  const defer = pDefer<string>();
  try {
    const data = await getImageData(image);
    defer.resolve(getAverage(data, { ...defaultConfig, ...config }));
  } catch (e) {
    defer.resolve(e);
  }
  return defer.promise;
}

const defaultMatchConfig: MatchConfig = { ...defaultConfig, group: 50 };
/* get match colors */
export async function matchColors(image: ImageSrc, config?: Partial<MatchConfig>) {
  const defer = pDefer<string[]>();
  try {
    const data = await getImageData(image);
    defer.resolve(getMatchColors(data, { ...defaultMatchConfig, ...config }));
  } catch (e) {
    defer.resolve(e);
  }
  return defer.promise;
}

export default { matchColors, avarage };
