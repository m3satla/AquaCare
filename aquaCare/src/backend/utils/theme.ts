import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",  // כחול כהה - צבע ראשי
    },
    secondary: {
      main: "#f50057",  // ורוד אדום - צבע משני
    },
    background: {
      default: "#f5f5f5",  // רקע דף כללי
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
});

export default theme;
