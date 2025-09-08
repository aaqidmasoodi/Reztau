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
      marginTop: 'calc(70px + env(safe-area-inset-top))',
      minHeight: 'calc(100vh - 70px - env(safe-area-inset-top))',
      background: 'var(--background-color)',
      paddingBottom: '120px'
    }
  }, [
    // Header with back button
    React.createElement('div', {
      key: 'header',
      style: {
        position: 'sticky',
        top: 'calc(70px + env(safe-area-inset-top))',
        background: 'var(--surface-color)',
        borderBottom: '1px solid var(--border-color)',
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 100
      }
    }, [
      React.createElement('div', {
        key: 'header-left',
        style: { display: 'flex', alignItems: 'center', gap: '1rem' }
      }, [
        React.createElement('button', {
          key: 'back-btn',
          onClick: onBack,
          style: {
            background: 'none',
            border: 'none',
            color: 'var(--primary-color)',
            fontSize: '1.25rem',
            cursor: 'pointer',
            padding: '0.5rem'
          }
        }, React.createElement('i', { className: 'fas fa-arrow-left' })),
        
        React.createElement('h1', {
          key: 'title',
          style: {
            fontSize: '1.1rem',
            fontWeight: '700',
            color: 'var(--text-primary)'
          }
        }, item.name)
      ]),
      
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
    
    // Hero image
    React.createElement('div', {
      key: 'hero',
      style: {
        position: 'relative',
        height: '200px',
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
    ]),
    
    // Fixed bottom add to cart section
    React.createElement('div', {
      key: 'bottom-section',
      style: {
        position: 'fixed',
        bottom: 'calc(80px + env(safe-area-inset-bottom))',
        left: 0,
        right: 0,
        background: 'var(--surface-color)',
        borderTop: '1px solid var(--border-color)',
        padding: '1rem',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.1)'
      }
    }, [
      React.createElement('div', {
        key: 'controls',
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }
      }, [
        React.createElement('div', {
          key: 'quantity-controls',
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--border-color)',
            borderRadius: '20px',
            padding: '0.25rem'
          }
        }, [
          React.createElement('button', {
            key: 'decrease',
            onClick: () => setQuantity(Math.max(1, quantity - 1)),
            style: {
              background: 'var(--primary-color)',
              color: 'white',
              border: 'none',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem'
            }
          }, React.createElement('i', { className: 'fas fa-minus' })),
          
          React.createElement('span', {
            key: 'display',
            style: {
              fontWeight: '600',
              minWidth: '1.5rem',
              textAlign: 'center',
              fontSize: '0.9rem'
            }
          }, quantity),
          
          React.createElement('button', {
            key: 'increase',
            onClick: () => setQuantity(quantity + 1),
            style: {
              background: 'var(--primary-color)',
              color: 'white',
              border: 'none',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem'
            }
          }, React.createElement('i', { className: 'fas fa-plus' }))
        ]),
        
        React.createElement('button', {
          key: 'add-btn',
          onClick: handleAddToCart,
          disabled: !item.available || isAdding,
          style: {
            background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '20px',
            fontSize: '1rem',
            fontWeight: '700',
            cursor: 'pointer',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }
        }, [
          React.createElement('i', { 
            key: 'icon',
            className: 'fas fa-shopping-cart' 
          }),
          React.createElement('span', {
            key: 'text'
          }, isAdding ? 'Adding...' : `Add ${quantity} - €${(item.price * quantity).toFixed(2)}`)
        ])
      ])
    ])
  ]);
};
