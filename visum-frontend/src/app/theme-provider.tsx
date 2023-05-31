import { ConfigProvider, theme } from 'antd';
import { createContext, useContext, useState } from 'react';

// Создаем контекст для хранения текущей темы
export const ThemeContext = createContext<any>(null);

// Компонент, предоставляющий контекст
export const ThemeProvider = ({ children }: any) => {
  const { defaultAlgorithm, darkAlgorithm } = theme;
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleClick = () => {
    setIsDarkMode((previousValue) => !previousValue);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, handleClick }}>
      <ConfigProvider
        theme={{
          algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};
