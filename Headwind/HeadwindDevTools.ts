export const createDevTools = (hwStylesheet, classNamesSet) => {
  document['adoptedStyleSheets'] = [
    ...document['adoptedStyleSheets'],
    hwStylesheet,
  ];
  
  const HeadwindDevTools = {
    hwStylesheet,
    classNamesSet,
  };
  
  window['HeadwindDevTools'] = HeadwindDevTools;
}
