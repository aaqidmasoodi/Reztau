const Menu = ({ onAddToCart, onItemClick }) => {
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  useEffect(() => {
    if (ConfigManager.menu) {
      setMenuData(ConfigManager.menu);
      setLoading(false);
    } else {
      setError('Menu data not available');
      setLoading(false);
    }
  }, []);

  // Synchronized scrolling effect
  useEffect(() => {
    if (!menuData || activeCategory !== 'all' || searchQuery) return;

    const handleScroll = () => {
      const sections = menuData.categories.map(category => {
        const element = document.getElementById(`category-${category.id}`);
        if (element) {
          const rect = element.getBoundingClientRect();
          return {
            id: category.id,
            top: rect.top,
            bottom: rect.bottom,
            element
          };
        }
        return null;
      }).filter(Boolean);

      // Find the category that's most in view
      const viewportCenter = window.innerHeight / 2;
      let activeSection = null;
      let minDistance = Infinity;

      sections.forEach(section => {
        const sectionCenter = (section.top + section.bottom) / 2;
        const distance = Math.abs(sectionCenter - viewportCenter);
        
        if (distance < minDistance && section.top < viewportCenter && section.bottom > 0) {
          minDistance = distance;
          activeSection = section;
        }
      });

      if (activeSection) {
        // Scroll the category filter to center the active category
        const categoryButton = document.querySelector(`[data-category="${activeSection.id}"]`);
        const filterContainer = document.querySelector('.category-tabs-container');
        
        if (categoryButton && filterContainer) {
          const buttonRect = categoryButton.getBoundingClientRect();
          const containerRect = filterContainer.getBoundingClientRect();
          const scrollLeft = categoryButton.offsetLeft - (containerRect.width / 2) + (buttonRect.width / 2);
          
          filterContainer.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [menuData, activeCategory, searchQuery]);
  
  if (loading) {
    return React.createElement('div', {
      className: 'loading'
    }, 'Loading delicious menu...');
  }
  
  if (error) {
    return React.createElement('div', {
      className: 'error'
    }, error);
  }
  
  // Filter categories based on active category and search
  const getFilteredCategories = () => {
    let categories = menuData.categories;
    
    // Filter by active category
    if (activeCategory !== 'all') {
      categories = categories.filter(cat => cat.id === activeCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      categories = categories.map(category => ({
        ...category,
        items: category.items.filter(item => 
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.items.length > 0);
    }
    
    return categories;
  };
  
  const filteredCategories = getFilteredCategories();
  
  return React.createElement('div', {
    className: 'menu',
    style: {
      marginTop: 'calc(70px + env(safe-area-inset-top))'
    }
  }, [
    // Permanent search bar
    React.createElement('div', {
      key: 'search-container',
      style: {
        background: 'var(--surface-color)',
        borderBottom: '1px solid var(--border-color)',
        padding: '1rem',
        boxShadow: 'var(--shadow)'
      }
    }, 
      React.createElement('div', {
        style: {
          position: 'relative',
          maxWidth: '400px',
          margin: '0 auto'
        }
      }, [
        React.createElement('i', {
          key: 'search-icon',
          className: 'fas fa-search',
          style: {
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-secondary)',
            zIndex: 1
          }
        }),
        React.createElement('input', {
          key: 'search-input',
          type: 'text',
          placeholder: 'Search menu items...',
          value: searchQuery,
          onChange: (e) => setSearchQuery(e.target.value),
          style: {
            width: '100%',
            padding: '0.75rem 3rem 0.75rem 3rem',
            border: '1px solid var(--border-color)',
            borderRadius: '25px',
            background: 'var(--background-color)',
            color: 'var(--text-primary)',
            fontSize: '1rem',
            outline: 'none',
            boxSizing: 'border-box'
          }
        }),
        searchQuery && React.createElement('button', {
          key: 'clear-btn',
          onClick: () => setSearchQuery(''),
          style: {
            position: 'absolute',
            right: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '1rem'
          }
        }, React.createElement('i', { className: 'fas fa-times' }))
      ])
    ),
    
    // Category tabs (only show when not searching)
    !searchQuery && React.createElement(CategoryTabs, {
      key: 'category-tabs',
      categories: menuData.categories,
      activeCategory: activeCategory,
      onCategoryChange: setActiveCategory
    }),
    
    React.createElement('div', {
      key: 'menu-sections',
      className: 'menu-sections'
    }, [
      // Search results header
      searchQuery && React.createElement('div', {
        key: 'search-results-header',
        style: {
          marginBottom: '1.5rem',
          textAlign: 'center'
        }
      }, [
        React.createElement('h2', {
          key: 'title',
          style: {
            fontSize: '1.25rem',
            fontWeight: '700',
            color: 'var(--text-primary)',
            marginBottom: '0.5rem'
          }
        }, `Search Results for "${searchQuery}"`),
        React.createElement('p', {
          key: 'count',
          style: {
            color: 'var(--text-secondary)',
            fontSize: '0.9rem'
          }
        }, `${filteredCategories.reduce((total, cat) => total + cat.items.length, 0)} items found`)
      ]),
      
      // Menu categories
      filteredCategories.map(category =>
        React.createElement('section', {
          key: category.id,
          id: `category-${category.id}`,
          className: 'menu-section'
        }, [
          // Only show category title if showing all categories or searching
          (activeCategory === 'all' || searchQuery) && React.createElement('div', {
            key: 'header',
            className: 'section-header'
          }, [
            React.createElement('h2', {
              key: 'title',
              className: 'section-title'
            }, category.name),
            !searchQuery && activeCategory === 'all' && React.createElement('a', {
              key: 'view-all',
              href: '#',
              className: 'view-all',
              onClick: (e) => {
                e.preventDefault();
                setActiveCategory(category.id);
              }
            }, 'View All')
          ]),
          
          React.createElement('div', {
            key: 'items',
            className: 'menu-grid'
          }, (searchQuery || activeCategory !== 'all' ? category.items : category.items.slice(0, 4))
            .filter(item => item.available)
            .map(item =>
              React.createElement(MenuItem, {
                key: item.id,
                item: item,
                onAddToCart: onAddToCart,
                onItemClick: onItemClick,
                onToggleFavorite: () => {}
              })
            )
          )
        ])
      ),
      
      // No results message
      searchQuery && filteredCategories.length === 0 && React.createElement('div', {
        key: 'no-results',
        style: {
          textAlign: 'center',
          padding: '3rem 2rem',
          color: 'var(--text-secondary)'
        }
      }, [
        React.createElement('i', {
          key: 'icon',
          className: 'fas fa-search',
          style: { fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }
        }),
        React.createElement('h3', {
          key: 'title',
          style: { marginBottom: '0.5rem' }
        }, 'No items found'),
        React.createElement('p', {
          key: 'subtitle'
        }, `Try searching for something else`)
      ])
    ])
  ]);
};
