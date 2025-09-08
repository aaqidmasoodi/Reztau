const MenuItem = ({ item, onAddToCart, onItemClick, onToggleFavorite }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    setIsFavorite(FavoritesManager.isFavorite(item.id));
  }, [item.id]);
  
  const handleQuantityChange = (newQuantity) => {
    setQuantity(Math.max(1, newQuantity));
  };
  
  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      for (let i = 0; i < quantity; i++) {
        await onAddToCart(item);
      }
      setQuantity(1);
      setTimeout(() => setIsAdding(false), 300);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      setIsAdding(false);
    }
  };
  
  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    FavoritesManager.toggleItem(item);
    setIsFavorite(FavoritesManager.isFavorite(item.id));
    if (onToggleFavorite) onToggleFavorite();
  };
  
  return React.createElement('div', {
    className: 'menu-item'
  }, [
    React.createElement('img', {
      key: 'image',
      src: item.image,
      alt: item.name,
      className: 'item-image',
      onClick: () => onItemClick(item),
      onError: (e) => {
        e.target.style.display = 'none';
      }
    }),
    
    React.createElement('div', {
      key: 'content',
      className: 'item-content'
    }, [
      React.createElement('div', {
        key: 'header',
        className: 'item-header'
      }, [
        React.createElement('h3', {
          key: 'name',
          className: 'item-name',
          onClick: () => onItemClick(item)
        }, item.name),
        React.createElement('div', {
          key: 'header-right',
          style: { display: 'flex', alignItems: 'center', gap: '0.5rem' }
        }, [
          React.createElement('button', {
            key: 'favorite-btn',
            onClick: handleToggleFavorite,
            style: {
              background: 'none',
              border: 'none',
              color: isFavorite ? 'var(--error-color)' : 'var(--text-secondary)',
              fontSize: '1.1rem',
              cursor: 'pointer',
              padding: '0.25rem',
              transition: 'all 0.2s'
            }
          }, React.createElement('i', { 
            className: isFavorite ? 'fas fa-heart' : 'far fa-heart' 
          })),
          React.createElement('span', {
            key: 'price',
            className: 'item-price'
          }, `€${item.price.toFixed(2)}`)
        ])
      ]),
      
      React.createElement('p', {
        key: 'description',
        className: 'item-description'
      }, item.description),
      
      React.createElement('div', {
        key: 'actions',
        className: 'item-actions'
      }, [
        React.createElement('div', {
          key: 'quantity',
          className: 'quantity-selector'
        }, [
          React.createElement('button', {
            key: 'decrease',
            className: 'quantity-btn',
            onClick: () => handleQuantityChange(quantity - 1),
            disabled: quantity === 1
          }, React.createElement('i', { className: 'fas fa-minus' })),
          
          React.createElement('span', {
            key: 'display',
            className: 'quantity-display'
          }, quantity),
          
          React.createElement('button', {
            key: 'increase',
            className: 'quantity-btn',
            onClick: () => handleQuantityChange(quantity + 1),
            disabled: !item.available
          }, React.createElement('i', { className: 'fas fa-plus' }))
        ]),
        
        React.createElement('button', {
          key: 'add-btn',
          className: 'add-to-cart',
          onClick: handleAddToCart,
          disabled: !item.available || isAdding,
          style: {
            opacity: isAdding ? 0.7 : 1
          }
        }, [
          React.createElement('i', { 
            key: 'icon',
            className: 'fas fa-shopping-cart' 
          }),
          React.createElement('span', {
            key: 'text'
          }, isAdding ? 'Adding...' : 'Add to Cart')
        ])
      ])
    ])
  ]);
};
