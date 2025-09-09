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
    setIsFavorite(!isFavorite);
    if (onToggleFavorite) {
      onToggleFavorite(item);
    }
  };
  
  return React.createElement('div', {
    className: 'menu-item',
    onClick: onItemClick ? () => onItemClick(item) : undefined
  }, [
    React.createElement('div', {
      key: 'image',
      style: {
        position: 'relative',
        overflow: 'hidden'
      }
    }, [
      React.createElement('img', {
        key: 'img',
        src: item.image,
        alt: item.name,
        style: {
          width: '100%',
          height: '160px',
          objectFit: 'cover'
        },
        onError: (e) => {
          e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop';
        }
      }),
      
      React.createElement('button', {
        key: 'favorite',
        className: 'btn btn-ghost btn-icon btn-sm',
        onClick: handleToggleFavorite,
        style: {
          position: 'absolute',
          top: '0.5rem',
          right: '0.5rem',
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(4px)'
        }
      }, React.createElement('i', {
        className: `fas fa-heart`,
        style: { 
          color: isFavorite ? 'hsl(var(--destructive))' : 'hsl(var(--muted-foreground))'
        }
      })),
      
      !item.available && React.createElement('div', {
        key: 'overlay',
        style: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: '600'
        }
      }, 'Currently Unavailable')
    ]),
    
    React.createElement('div', {
      key: 'content',
      className: 'menu-item-content'
    }, [
      React.createElement('div', {
        key: 'header',
        className: 'menu-item-footer'
      }, [
        React.createElement('h3', {
          key: 'name'
        }, item.name),
        React.createElement('span', {
          key: 'price',
          className: 'price'
        }, `€${item.price.toFixed(2)}`)
      ]),
      
      React.createElement('p', {
        key: 'description',
        className: 'text-sm text-muted',
        style: { marginBottom: '0.75rem' }
      }, item.description),
      
      item.dietary && item.dietary.length > 0 && React.createElement('div', {
        key: 'dietary',
        style: {
          display: 'flex',
          gap: '0.25rem',
          marginBottom: '0.75rem',
          flexWrap: 'wrap'
        }
      }, item.dietary.map(diet => 
        React.createElement('span', {
          key: diet,
          className: 'badge badge-secondary',
          style: { fontSize: '0.7rem' }
        }, diet)
      )),
      
      React.createElement('div', {
        key: 'actions',
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem'
        }
      }, [
        React.createElement('div', {
          key: 'quantity',
          className: 'quantity-controls'
        }, [
          React.createElement('button', {
            key: 'decrease',
            className: 'quantity-btn',
            onClick: (e) => {
              e.stopPropagation();
              handleQuantityChange(quantity - 1);
            },
            disabled: quantity === 1
          }, React.createElement('i', { className: 'fas fa-minus' })),
          
          React.createElement('span', {
            key: 'display',
            className: 'quantity-display'
          }, quantity),
          
          React.createElement('button', {
            key: 'increase',
            className: 'quantity-btn',
            onClick: (e) => {
              e.stopPropagation();
              handleQuantityChange(quantity + 1);
            },
            disabled: !item.available
          }, React.createElement('i', { className: 'fas fa-plus' }))
        ]),
        
        React.createElement('button', {
          key: 'add-btn',
          className: `btn ${item.available ? 'btn-primary' : 'btn-secondary'} btn-sm`,
          onClick: (e) => {
            e.stopPropagation();
            handleAddToCart();
          },
          disabled: !item.available || isAdding,
          style: { flex: 1 }
        }, [
          React.createElement('i', { 
            key: 'icon',
            className: isAdding ? 'fas fa-spinner fa-spin' : 'fas fa-plus',
            style: { marginRight: '0.5rem' }
          }),
          React.createElement('span', {
            key: 'text'
          }, isAdding ? 'Adding...' : 'Add to Cart')
        ])
      ])
    ])
  ]);
};
