const Favorites = ({ onAddToCart, onItemClick, onRefresh }) => {
  const [favorites, setFavorites] = useState([]);
  
  useEffect(() => {
    setFavorites(FavoritesManager.getFavorites());
  }, [onRefresh]);
  
  const handleToggleFavorite = () => {
    setFavorites(FavoritesManager.getFavorites());
  };
  
  if (favorites.length === 0) {
    return React.createElement('div', {
      style: { 
        textAlign: 'center', 
        padding: '3rem 2rem',
        color: 'var(--text-secondary)',
        marginTop: 'calc(70px + env(safe-area-inset-top))'
      }
    }, [
      React.createElement('i', {
        key: 'icon',
        className: 'fas fa-heart',
        style: { fontSize: '3rem', marginBottom: '1rem', color: 'var(--text-secondary)', opacity: 0.5 }
      }),
      React.createElement('h3', {
        key: 'title',
        style: { marginBottom: '0.5rem' }
      }, 'No Favorites Yet'),
      React.createElement('p', {
        key: 'subtitle'
      }, 'Tap the heart icon on any item to add it to your favorites!')
    ]);
  }
  
  return React.createElement('div', {
    style: {
      marginTop: 'calc(70px + env(safe-area-inset-top))',
      padding: '1rem'
    }
  }, [
    React.createElement('h2', {
      key: 'title',
      style: {
        fontSize: '1.5rem',
        fontWeight: '700',
        marginBottom: '1.5rem',
        color: 'var(--text-primary)',
        textAlign: 'center'
      }
    }, 'Your Favorites'),
    
    React.createElement('div', {
      key: 'favorites-grid',
      className: 'menu-grid'
    }, favorites.map(item =>
      React.createElement(MenuItem, {
        key: item.id,
        item: item,
        onAddToCart: onAddToCart,
        onItemClick: onItemClick,
        onToggleFavorite: handleToggleFavorite
      })
    ))
  ]);
};
