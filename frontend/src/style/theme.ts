// src/style/theme.ts
import { createTheme } from "@mui/material/styles";

// Tema claro
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff", // Fundo do Drawer no modo claro
    },
    text: {
      primary: "#000000", // Cor do texto no modo claro
      secondary: "#555555",
    },
  },
});

// Tema escuro
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e", // Fundo do Drawer no modo escuro
    },
    text: {
      primary: "#ffffff", // Cor do texto no modo escuro
      secondary: "#bbbbbb",
    },
  },
});
