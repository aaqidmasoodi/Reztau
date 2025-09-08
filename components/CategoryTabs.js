const CategoryTabs = ({ categories, activeCategory, onCategoryChange }) => {
  const [headerHeight, setHeaderHeight] = useState(0);
  
  useEffect(() => {
    const calculateHeaderHeight = () => {
      const header = document.querySelector('.header');
      if (header) {
        setHeaderHeight(header.offsetHeight);
      }
    };
    
    calculateHeaderHeight();
    window.addEventListener('resize', calculateHeaderHeight);
    
    return () => window.removeEventListener('resize', calculateHeaderHeight);
  }, []);
  
  return React.createElement('section', {
    style: {
      background: 'var(--surface-color)',
      borderBottom: '1px solid var(--border-color)',
      padding: '1rem 0',
      position: 'sticky',
      top: `${headerHeight}px`,
      zIndex: 99,
      boxShadow: 'var(--shadow)'
    }
  }, 
    React.createElement('div', {
      style: {
        display: 'flex',
        gap: '0.75rem',
        overflow: 'auto',
        padding: '0 1rem',
        scrollBehavior: 'smooth',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }
    }, [
      // All categories tab
      React.createElement('button', {
        key: 'all',
        onClick: () => onCategoryChange('all'),
        style: {
          background: activeCategory === 'all' ? 'var(--primary-color)' : 'var(--border-color)',
          color: activeCategory === 'all' ? 'white' : 'var(--text-primary)',
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: '25px',
          fontSize: '0.9rem',
          fontWeight: '600',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          transition: 'all 0.2s',
          minWidth: 'fit-content'
        }
      }, 'All'),
      
      // Category tabs
      ...categories.map(category =>
        React.createElement('button', {
          key: category.id,
          onClick: () => onCategoryChange(category.id),
          style: {
            background: activeCategory === category.id ? 'var(--primary-color)' : 'var(--border-color)',
            color: activeCategory === category.id ? 'white' : 'var(--text-primary)',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '25px',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s',
            minWidth: 'fit-content'
          }
        }, category.name)
      )
    ])
  );
};
