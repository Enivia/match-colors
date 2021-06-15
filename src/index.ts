import pDefer from 'p-defer';
import { Config, Format, Method, ImageSrc, Rgb } from './interface';

function getImageData(src: string): Promise<Uint8ClampedArray> {
  const defer = pDefer<Uint8ClampedArray>();
  const image = new Image();
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

function formatColor(rgb: Rgb, format: Format) {
  if (format === 'RGB') {
    return `rgb(${rgb.join(',')})`;
  } else {
    return `#${rgb.map(color => color.toString(16))}`;
  }
}

function getMatchColors(data: Uint8ClampedArray, config: Config): string[] {
  const gap = 4 * config.blockSize;
  const set = new Set<string>();

  for (let i = 0; i < data.length; i += gap) {
    const color = formatColor([data[i], data[i + 1], data[i + 2]], config.format);
    set.add(color);
  }
  return [...set];
}

function getAverage(data: Uint8ClampedArray, config: Config): string {
  const gap = 4 * config.blockSize;
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

const defaultConfig: Config = {
  format: 'RGB',
  blockSize: 5,
};
async function caller<T extends Method>(method: T, imageSrc: ImageSrc, config?: Config) {
  const defer = pDefer<ReturnType<T>>();
  try {
    const src = typeof imageSrc === 'string' ? imageSrc : imageSrc.src;
    const data = await getImageData(src);
    const res = method(data, { ...defaultConfig, ...config });
    defer.resolve(res);
  } catch (e) {
    defer.resolve(e);
  }
  return defer.promise;
}

/* get avarage color */
export const avarage = (imageSrc: ImageSrc, config?: Config) =>
  caller(getAverage, imageSrc, config);
/* get match colors */
export const matchColors = (imageSrc: ImageSrc, config?: Config) =>
  caller(getMatchColors, imageSrc, config);

export default { matchColors, avarage };
