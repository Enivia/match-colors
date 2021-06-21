# match-colors

## Install

```
yarn add match-colors
```

## Example

```ts
// get avarage color
avarage('image.png').then(res => console.log(color));

// get match colors
matchColors('image.png').then(res => console.log(color));
```

![image](https://raw.githubusercontent.com/Enivia/match-colors/master/example/demo.png)

## API

- imageSrc: `string | HTMLImageElement`

- config: `Config`

```ts
avarage('image.png');

avarage(imageElement.ref, { format: 'HEX' });

matchColors(document.getElementById('image'), { count: 5 });
```

## Config

### format

default: `'RGB'`

options: `'HEX' | 'RGB'`

Config the format of colors that should be returned.

### size

default: `5`

Config the size of a sample to extract color.

### group

default: `40`

Config how many similar colors should be combined into one color.

_Only applicable for matchColor_

### count

default: `5`

Config the amount of colors that should be returned.

_Only applicable for matchColor_
