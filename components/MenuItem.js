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
    onClick: onItemClick ? () => onItemClick(item) : undefined,
    style: {
      position: 'relative',
      height: '280px',
      backgroundImage: `url(${item.image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      overflow: 'hidden'
    }
  }, [
    // Gradient overlay
    React.createElement('div', {
      key: 'overlay',
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.1) 100%)'
      }
    }),
    
    // Favorite button - top right
    React.createElement('button', {
      key: 'favorite',
      className: 'btn btn-ghost btn-icon btn-sm',
      onClick: handleToggleFavorite,
      style: {
        position: 'absolute',
        top: '0.75rem',
        right: '0.75rem',
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(4px)',
        zIndex: 2
      }
    }, React.createElement('i', {
      className: `fas fa-heart`,
      style: { 
        color: isFavorite ? 'hsl(var(--destructive))' : 'hsl(var(--muted-foreground))'
      }
    })),
    
    // Content overlay - bottom left
    React.createElement('div', {
      key: 'content',
      style: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '1rem',
        color: 'white',
        zIndex: 1
      }
    }, [
      React.createElement('div', {
        key: 'header',
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '0.5rem'
        }
      }, [
        React.createElement('h3', {
          key: 'name',
          style: {
            fontSize: '1.125rem',
            fontWeight: '600',
            marginBottom: '0.25rem'
          }
        }, item.name),
        React.createElement('span', {
          key: 'price',
          style: {
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#4ade80'
          }
        }, `€${item.price.toFixed(2)}`)
      ]),
      
      React.createElement('p', {
        key: 'description',
        style: {
          fontSize: '0.875rem',
          opacity: 0.9,
          marginBottom: '0.75rem',
          lineHeight: '1.4'
        }
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
          style: {
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            padding: '0.125rem 0.5rem',
            borderRadius: '9999px',
            fontSize: '0.7rem',
            fontWeight: '500'
          }
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
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }
        }, [
          React.createElement('button', {
            key: 'decrease',
            onClick: (e) => {
              e.stopPropagation();
              handleQuantityChange(quantity - 1);
            },
            disabled: quantity === 1,
            style: {
              width: '2rem',
              height: '2rem',
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600'
            }
          }, React.createElement('i', { className: 'fas fa-minus' })),
          
          React.createElement('span', {
            key: 'display',
            style: {
              minWidth: '2rem',
              textAlign: 'center',
              fontWeight: '600',
              color: 'white'
            }
          }, quantity),
          
          React.createElement('button', {
            key: 'increase',
            onClick: (e) => {
              e.stopPropagation();
              handleQuantityChange(quantity + 1);
            },
            disabled: !item.available,
            style: {
              width: '2rem',
              height: '2rem',
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600'
            }
          }, React.createElement('i', { className: 'fas fa-plus' }))
        ]),
        
        React.createElement('button', {
          key: 'add-btn',
          onClick: (e) => {
            e.stopPropagation();
            handleAddToCart();
          },
          disabled: !item.available || isAdding,
          style: {
            flex: 1,
            padding: '0.5rem 1rem',
            background: item.available ? '#4ade80' : 'rgba(255,255,255,0.3)',
            color: item.available ? 'black' : 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: item.available ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }
        }, [
          React.createElement('i', { 
            key: 'icon',
            className: isAdding ? 'fas fa-spinner fa-spin' : 'fas fa-plus'
          }),
          React.createElement('span', {
            key: 'text'
          }, isAdding ? 'Adding...' : 'Add to Cart')
        ])
      ])
    ]),
    
    // Unavailable overlay
    !item.available && React.createElement('div', {
      key: 'unavailable',
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: '600',
        zIndex: 3
      }
    }, 'Currently Unavailable')
  ]);
};
