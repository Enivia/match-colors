import pDefer from 'p-defer';

type Element = string | HTMLImageElement;
type Params = any;
type Output = any;
type Handler = (data: Uint8ClampedArray, params: Params) => Output;

function getImageSrc(element: Element) {
  return typeof element === 'string' ? element : element.src;
}

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
    defer.reject(Error('Fail to load image'));
  };

  return defer.promise;
}

function getColors(data: Uint8ClampedArray, params: Params) {}

function getAverage(data: Uint8ClampedArray, params: Params) {}

async function caller(handler: Handler, element: Element, params: Params): Promise<Output> {
  const defer = pDefer<Output>();
  try {
    const src = getImageSrc(element);
    const data = await getImageData(src);
    defer.resolve(handler(data, params));
  } catch (e) {
    defer.resolve(e);
  }
  return defer.promise;
}

const matchColors = (element: Element, params: Params) => caller(getColors, element, params);
const avarage = (element: Element, params: Params) => caller(getAverage, element, params);

export default matchColors;
export { matchColors, avarage };
