declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: any;
  export default value;
}

declare module 'react-alert';

/// <reference path="pathTo/chrome.d.ts"/>
