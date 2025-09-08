const ConfigManager = {
  restaurant: null,
  theme: null,
  menu: null,
  app: null,
  
  async loadAll() {
    try {
      const [restaurant, theme, menu, app] = await Promise.all([
        fetch('config/restaurant-config.json').then(r => r.json()),
        fetch('config/theme-config.json').then(r => r.json()),
        fetch('config/menu-data.json').then(r => r.json()),
        fetch('config/app-config.json').then(r => r.json())
      ]);
      
      this.restaurant = restaurant;
      this.theme = theme;
      this.menu = menu;
      this.app = app;
      
      return { restaurant, theme, menu, app };
    } catch (error) {
      console.error('Failed to load configuration:', error);
      throw error;
    }
  },
  
  applyTheme(mode = 'light') {
    const colors = this.theme[mode];
    const root = document.documentElement;
    
    Object.entries(colors).forEach(([key, value]) => {
      const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      root.style.setProperty(`--${cssVar}-color`, value);
    });
    
    // Update status bar color to match app background
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    const msNavButtonMeta = document.querySelector('meta[name="msapplication-navbutton-color"]');
    
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', colors.background);
    }
    if (msNavButtonMeta) {
      msNavButtonMeta.setAttribute('content', colors.background);
    }
    
    document.documentElement.setAttribute('data-theme', mode);
  }
};
