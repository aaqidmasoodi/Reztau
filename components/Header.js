const Header = ({ onMenuToggle, cartCount, onCartClick, onFavoritesClick }) => {
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
        className: 'header-left'
      }, 
        React.createElement('button', {
          key: 'burger',
          className: 'burger-menu',
          onClick: onMenuToggle,
          'aria-label': 'Menu'
        }, React.createElement('i', { className: 'fas fa-bars' }))
      ),
      
      React.createElement('div', {
        key: 'header-right',
        className: 'header-right'
      }, [
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
