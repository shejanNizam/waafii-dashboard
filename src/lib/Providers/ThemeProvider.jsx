import { ConfigProvider } from "antd";
import { mainTheme } from "../../utils/antTheme";

function ThemeProvider({ children }) {
  return (
    <>
      <ConfigProvider theme={mainTheme}>{children}</ConfigProvider>
    </>
  );
}

export default ThemeProvider;
