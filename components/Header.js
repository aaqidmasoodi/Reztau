const Header = ({ onMenuToggle, cartCount, onCartClick, onFavoritesClick, activeTab, isProfileEditing, onProfileEditToggle, overlayPage, onOverlayBack }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return React.createElement('div', null, [
    !isOnline && React.createElement('div', {
      key: 'offline-banner',
      className: 'offline-banner'
    }, '⚠️ You are offline. Online connection required for placing orders.'),
    
    React.createElement('header', {
      key: 'header',
      className: 'header'
    }, [
      React.createElement('div', {
        key: 'header-left',
        className: 'header-left',
        style: {
          display: 'flex',
          alignItems: 'center'
        }
      }, overlayPage ? [
        // Back button for overlay pages
        React.createElement('button', {
          key: 'back',
          onClick: onOverlayBack,
          className: 'burger-menu',
          'aria-label': 'Back'
        }, React.createElement('i', { className: 'fas fa-arrow-left' })),
        
        // Page title
        React.createElement('h1', {
          key: 'title',
          style: {
            fontSize: '1.1rem',
            fontWeight: '700',
            color: 'var(--text-primary)',
            margin: 0,
            marginLeft: '0.75rem'
          }
        }, overlayPage)
      ] : [
        // Regular menu button
        React.createElement('button', {
          key: 'burger',
          className: 'burger-menu',
          onClick: onMenuToggle,
          'aria-label': 'Menu'
        }, React.createElement('i', { className: 'fas fa-bars' }))
      ]),
      
      React.createElement('div', {
        key: 'header-right',
        className: 'header-right'
      }, activeTab === 'profile' ? [
        // Profile edit button
        React.createElement('button', {
          key: 'edit',
          onClick: onProfileEditToggle,
          style: {
            background: isProfileEditing ? 'var(--accent-color)' : 'none',
            border: isProfileEditing ? 'none' : '1px solid var(--border-color)',
            color: isProfileEditing ? 'white' : 'var(--primary-color)',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            padding: '0.5rem 1rem',
            borderRadius: '20px'
          }
        }, isProfileEditing ? 'Cancel' : 'Edit')
      ] : [
        React.createElement('button', {
          key: 'cart',
          className: 'cart-icon',
          onClick: onCartClick,
          'aria-label': 'Shopping cart'
        }, [
          React.createElement('i', { 
            key: 'icon',
            className: 'fas fa-shopping-cart' 
          }),
          cartCount > 0 && React.createElement('span', {
            key: 'badge',
            className: 'cart-badge'
          }, cartCount)
        ]),
        
        React.createElement('button', {
          key: 'favorites',
          onClick: onFavoritesClick,
          'aria-label': 'View favorites',
          style: {
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '1.2rem',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }
        }, React.createElement('i', { 
          className: 'fas fa-heart'
        }))
      ])
    ])
  ]);
};
