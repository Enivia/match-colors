import 'react-app-polyfill/ie11';
import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { avarage, matchColors } from '../src';

const Color = ({ color }: { color: string }) => (
  <div
    style={{
      width: 60,
      height: 60,
      marginRight: 12,
      display: 'inline-block',
      backgroundColor: color,
    }}
  />
);

const App = () => {
  const [file, setFile] = useState<File>();
  const imageRef = useRef<HTMLImageElement>();

  const [color, setColor] = useState<string>();
  const [colors, setColors] = useState<string[]>([]);

  const src = file && URL.createObjectURL(file);

  return (
    <div style={{ padding: 12 }}>
      <input
        type="file"
        accept="image/png, image/jpeg"
        onChange={e => setFile(e.target.files[0])}
      />
      <div>
        <img ref={imageRef} src={src} height="300" />
      </div>
      <div style={{ margin: '12px 0' }}>
        <button onClick={() => avarage(imageRef.current).then(res => setColor(res))}>
          get avarage color
        </button>
        <div style={{ margin: '12px 0' }}>
          <Color color={color} />
        </div>
        <button onClick={() => matchColors(imageRef.current).then(res => setColors(res))}>
          get match colors
        </button>
        <div style={{ margin: '12px 0' }}>
          {colors.map(c => (
            <Color key={c} color={c} />
          ))}
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
