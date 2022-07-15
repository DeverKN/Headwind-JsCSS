import * as React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToString, renderToStyleSheet, stringifyHWStyleSheet } from './Headwind/Headwind';
import { styleAllNodes, createStyleTagFromString } from './Headwind/HeadwindDom';

import App from './App';

const rootElement = document.getElementById('root');
// renderToString();
styleAllNodes(document.getElementById('test'));
// const stringifiedStyles = stringifyHWStyleSheet();
// const styleTag = createStyleTagFromString(stringifiedStyles)
// console.log({stringifiedStyles, styleTag})
// document.body.appendChild(styleTag);

renderToStyleSheet();
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
