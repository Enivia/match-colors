export type ImageSrc = string | HTMLImageElement;
export type Format = 'RGB' | 'HEX';
export type Config = { format: Format; blockSize: number };
export type Rgb = [number, number, number];
export type Hex = string;
export type Method = (...args: any) => any;
