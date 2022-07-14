import * as React from 'react';
import { useState, useEffect } from 'react';
import './style.css';
import { hw } from './Headwind/Headwind';

export default function App() {
  const [color, setColor] = useState('red');
  const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'violet'];

  const updateColor = () => {
    let newColorIndex = colors.indexOf(color) + 1;
    if (newColorIndex >= colors.length) newColorIndex = 0;
    setColor(colors[newColorIndex]);
  };

  const css = `bg-${color} @focus:@hover:bg-green color-sexypink font`

  return (
    <div className={hw(`flex`)}>
      <p>Start editing to see some magic happen :)</p>
      <h1
        className={hw(css)}
        onClick={updateColor}
        tabIndex={1}
      >
        Hello StackBlitz!
      </h1>
    </div>
  );
}
