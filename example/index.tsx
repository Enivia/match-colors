import 'react-app-polyfill/ie11';
import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { avarage, matchColors } from '../src';

const App = () => {
  const [file, setFile] = useState<File>();
  const imageRef = useRef<HTMLImageElement>();

  const [color, setColor] = useState<string>();
  const [colors, setColors] = useState<string[]>([]);

  const src = file && URL.createObjectURL(file);

  return (
    <div>
      <input
        type="file"
        accept="image/png, image/jpeg"
        onChange={e => setFile(e.target.files[0])}
      />
      <div>
        <img ref={imageRef} src={src} width="300" />
      </div>
      <div style={{ margin: 12 }}>
        <button onClick={() => avarage(imageRef.current).then(res => setColor(res))}>
          get avarage color
        </button>
        <div>{color}</div>
        <button
          onClick={() =>
            matchColors(imageRef.current, { merge: 100 }).then(res => setColors(res))
          }
        >
          get match colors
        </button>
        <div>{colors.join(',')}</div>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
