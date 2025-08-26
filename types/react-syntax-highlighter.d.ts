declare module 'react-syntax-highlighter/dist/esm/languages/hljs/*' {
  const lang: any;
  export default lang;
}

declare module 'react-syntax-highlighter/dist/esm/styles/hljs/*' {
  const style: any;
  export default style;
}

declare module 'react-syntax-highlighter' {
  // Minimal typing to satisfy imports and usage
  export const Light: any;
  export const Prism: any;
  const DefaultExport: any;
  export default DefaultExport;
}
