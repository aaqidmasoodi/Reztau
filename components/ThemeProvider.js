const { createContext, useContext, useState, useEffect } = React;

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    const saved = localStorage.getItem('reztau-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = saved ? saved === 'dark' : prefersDark;
    
    setIsDark(shouldUseDark);
    if (ConfigManager.theme) {
      ConfigManager.applyTheme(shouldUseDark ? 'dark' : 'light');
    }
  }, []);
  
  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    localStorage.setItem('reztau-theme', newMode ? 'dark' : 'light');
    if (ConfigManager.theme) {
      ConfigManager.applyTheme(newMode ? 'dark' : 'light');
    }
  };
  
  return React.createElement(ThemeContext.Provider, {
    value: { isDark, toggleTheme }
  }, children);
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
