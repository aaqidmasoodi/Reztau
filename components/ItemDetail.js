const ItemDetail = ({ item, onBack, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    setIsFavorite(FavoritesManager.isFavorite(item.id));
  }, [item.id]);
  
  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      for (let i = 0; i < quantity; i++) {
        await onAddToCart(item);
      }
      setQuantity(1);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
    setIsAdding(false);
  };
  
  const handleToggleFavorite = () => {
    FavoritesManager.toggleItem(item);
    setIsFavorite(FavoritesManager.isFavorite(item.id));
  };
  
  const getSpiceLevelText = (level) => {
    const levels = ['Mild', 'Medium', 'Hot', 'Very Hot', 'Extremely Hot'];
    return levels[level - 1] || 'Mild';
  };
  
  const getSpiceIcons = (level) => {
    return '🌶️'.repeat(level);
  };
  
  return React.createElement('div', {
    style: {
      minHeight: '100vh',
      background: 'var(--background-color)',
      paddingBottom: '120px'
    }
  }, [
    // Hero image (moved to top, close to header)
    React.createElement('div', {
      key: 'hero',
      style: {
        position: 'relative',
        height: '250px',
        overflow: 'hidden'
      }
    }, [
      React.createElement('img', {
        key: 'image',
        src: item.image,
        alt: item.name,
        style: {
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        },
        onError: (e) => {
          e.target.src = 'https://via.placeholder.com/400x200/ff6b35/ffffff?text=No+Image';
        }
      }),
      
      // Price overlay
      React.createElement('div', {
        key: 'price-overlay',
        style: {
          position: 'absolute',
          bottom: '0.75rem',
          right: '0.75rem',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          fontSize: '1.25rem',
          fontWeight: '700'
        }
      }, `€${item.price.toFixed(2)}`)
    ]),
    
    // Item name and favorite button (under image)
    React.createElement('div', {
      key: 'item-header',
      style: {
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-color)'
      }
    }, [
      React.createElement('h1', {
        key: 'item-name',
        style: {
          fontSize: '1.5rem',
          fontWeight: '700',
          color: 'var(--text-primary)',
          margin: 0
        }
      }, item.name),
      
      React.createElement('button', {
        key: 'favorite-btn',
        onClick: handleToggleFavorite,
        style: {
          background: 'none',
          border: 'none',
          color: isFavorite ? 'var(--error-color)' : 'var(--text-secondary)',
          fontSize: '1.5rem',
          cursor: 'pointer',
          padding: '0.5rem',
          transition: 'all 0.2s'
        }
      }, React.createElement('i', { 
        className: isFavorite ? 'fas fa-heart' : 'far fa-heart' 
      }))
    ]),
    
    // Content
    React.createElement('div', {
      key: 'content',
      style: {
        padding: '1rem'
      }
    }, [
      // Description
      React.createElement('div', {
        key: 'description-section',
        style: { marginBottom: '1.5rem' }
      }, [
        React.createElement('h2', {
          key: 'desc-title',
          style: {
            fontSize: '1.1rem',
            fontWeight: '700',
            marginBottom: '0.75rem',
            color: 'var(--text-primary)'
          }
        }, 'Description'),
        React.createElement('p', {
          key: 'description',
          style: {
            fontSize: '1rem',
            lineHeight: '1.5',
            color: 'var(--text-secondary)'
          }
        }, item.description)
      ]),
      
      // Compact info grid
      React.createElement('div', {
        key: 'info-grid',
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }
      }, [
        // Dietary info
        item.dietary && item.dietary.length > 0 && React.createElement('div', {
          key: 'dietary',
          style: {
            background: 'var(--surface-color)',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid var(--border-color)'
          }
        }, [
          React.createElement('h3', {
            key: 'dietary-title',
            style: {
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }
          }, [
            React.createElement('i', { 
              key: 'icon',
              className: 'fas fa-leaf',
              style: { color: 'var(--success-color)' }
            }),
            'Dietary'
          ]),
          React.createElement('div', {
            key: 'dietary-tags',
            style: { display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }
          }, item.dietary.map(diet => 
            React.createElement('span', {
              key: diet,
              style: {
                background: 'var(--success-color)',
                color: 'white',
                padding: '0.2rem 0.5rem',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: '500',
                textTransform: 'capitalize'
              }
            }, diet)
          ))
        ]),
        
        // Spice level
        item.spiceLevel && React.createElement('div', {
          key: 'spice',
          style: {
            background: 'var(--surface-color)',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid var(--border-color)'
          }
        }, [
          React.createElement('h3', {
            key: 'spice-title',
            style: {
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }
          }, [
            React.createElement('span', { key: 'icon' }, '🌶️'),
            'Spice Level'
          ]),
          React.createElement('div', {
            key: 'spice-info',
            style: { display: 'flex', alignItems: 'center', gap: '0.5rem' }
          }, [
            React.createElement('span', {
              key: 'icons',
              style: { fontSize: '1rem' }
            }, getSpiceIcons(item.spiceLevel)),
            React.createElement('span', {
              key: 'text',
              style: { fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.85rem' }
            }, getSpiceLevelText(item.spiceLevel))
          ])
        ])
      ]),
      
      // Ingredients
      item.ingredients && React.createElement('div', {
        key: 'ingredients-section',
        style: { marginBottom: '1.5rem' }
      }, [
        React.createElement('h3', {
          key: 'ingredients-title',
          style: {
            fontSize: '1.1rem',
            fontWeight: '700',
            marginBottom: '0.75rem',
            color: 'var(--text-primary)'
          }
        }, 'Ingredients'),
        React.createElement('div', {
          key: 'ingredients-list',
          style: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.4rem'
          }
        }, item.ingredients.map(ingredient =>
          React.createElement('span', {
            key: ingredient,
            style: {
              background: 'var(--border-color)',
              color: 'var(--text-primary)',
              padding: '0.3rem 0.7rem',
              borderRadius: '15px',
              fontSize: '0.8rem'
            }
          }, ingredient)
        ))
      ]),
      
      // Allergens
      item.allergens && item.allergens.length > 0 && React.createElement('div', {
        key: 'allergens-section',
        style: { marginBottom: '1.5rem' }
      }, [
        React.createElement('h3', {
          key: 'allergens-title',
          style: {
            fontSize: '1.1rem',
            fontWeight: '700',
            marginBottom: '0.75rem',
            color: 'var(--error-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }
        }, [
          React.createElement('i', { 
            key: 'icon',
            className: 'fas fa-exclamation-triangle'
          }),
          'Allergens'
        ]),
        React.createElement('div', {
          key: 'allergens-list',
          style: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.4rem'
          }
        }, item.allergens.map(allergen =>
          React.createElement('span', {
            key: allergen,
            style: {
              background: 'var(--error-color)',
              color: 'white',
              padding: '0.3rem 0.7rem',
              borderRadius: '15px',
              fontSize: '0.8rem',
              fontWeight: '600'
            }
          }, allergen)
        ))
      ]),
      
      // Serving info
      item.servingInfo && React.createElement('div', {
        key: 'serving-section',
        style: {
          background: 'var(--surface-color)',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
          marginBottom: '1rem'
        }
      }, [
        React.createElement('h3', {
          key: 'serving-title',
          style: {
            fontSize: '0.9rem',
            fontWeight: '600',
            marginBottom: '0.5rem',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }
        }, [
          React.createElement('i', { 
            key: 'icon',
            className: 'fas fa-info-circle',
            style: { color: 'var(--primary-color)' }
          }),
          'Serving Information'
        ]),
        React.createElement('p', {
          key: 'serving-text',
          style: {
            color: 'var(--text-secondary)',
            fontSize: '0.9rem'
          }
        }, item.servingInfo)
      ])
    ])
  ]);
};
