import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      black: string;
    };
    breakpoints: {
      tablet: string;
      desktop: string;
    };
  }
}
