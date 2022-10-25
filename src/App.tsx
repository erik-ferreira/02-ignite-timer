import { ThemeProvider } from "styled-components";
import { Button } from "./components/Button";

import { GlobalStyle } from "./styles/global";
import { defaultTheme } from "./styles/theme/default";

export function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <h1>Hello</h1>
      <Button variant="secondary" />

      <GlobalStyle />
    </ThemeProvider>
  );
}
