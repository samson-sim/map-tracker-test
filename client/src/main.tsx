import React from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { RootStoreProvider } from "./stores/RootStore";
import { App } from "./App";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RootStoreProvider>
        <App />
      </RootStoreProvider>
    </ThemeProvider>
  </React.StrictMode>
);
