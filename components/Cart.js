const Cart = ({ items, onUpdateQuantity, onRemoveItem, onCheckout }) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * (ConfigManager.app?.tax?.rate || 0.08);
  const deliveryFee = ConfigManager.restaurant?.delivery?.fee || 0;
  const total = subtotal + tax + deliveryFee;
  
  if (items.length === 0) {
    return React.createElement('div', {
      className: 'cart-container',
      style: { 
        textAlign: 'center', 
        padding: '3rem 2rem',
        marginTop: 'calc(70px + env(safe-area-inset-top))'
      }
    }, [
      React.createElement('div', {
        key: 'icon',
        style: { 
          fontSize: '3rem', 
          marginBottom: '1rem',
          color: 'hsl(var(--muted-foreground))'
        }
      }, '🛒'),
      React.createElement('h3', {
        key: 'title',
        className: 'text-xl font-semibold',
        style: { marginBottom: '0.5rem' }
      }, 'Your cart is empty'),
      React.createElement('p', {
        key: 'subtitle',
        className: 'text-muted'
      }, 'Add some delicious items from our menu!')
    ]);
  }
  
  return React.createElement('div', {
    style: {
      marginTop: 'calc(70px + env(safe-area-inset-top))',
      paddingBottom: '140px'
    }
  }, [
    React.createElement('div', {
      key: 'header',
      style: {
        padding: '1rem',
        borderBottom: '1px solid hsl(var(--border))',
        background: 'hsl(var(--card))'
      }
    }, React.createElement('h2', {
      className: 'text-xl font-bold',
      style: { textAlign: 'center' }
    }, 'Your Order')),
    
    React.createElement('div', {
      key: 'items',
      style: { padding: '1rem' }
    }, items.map(item => 
      React.createElement('div', {
        key: item.id,
        className: 'card',
        style: { marginBottom: '1rem' }
      }, [
        React.createElement('div', {
          key: 'content',
          className: 'card-content',
          style: { padding: '1rem' }
        }, [
          React.createElement('div', {
            key: 'header',
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '0.75rem'
            }
          }, [
            React.createElement('h3', {
              key: 'name',
              className: 'font-semibold'
            }, item.name),
            React.createElement('button', {
              key: 'remove',
              className: 'btn btn-ghost btn-icon btn-sm',
              onClick: () => onRemoveItem(item.id),
              title: 'Remove item'
            }, React.createElement('i', { 
              className: 'fas fa-trash',
              style: { color: 'hsl(var(--destructive))' }
            }))
          ]),
          
          React.createElement('div', {
            key: 'controls',
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }
          }, [
            React.createElement('div', {
              key: 'quantity',
              className: 'quantity-controls'
            }, [
              React.createElement('button', {
                key: 'decrease',
                className: 'quantity-btn',
                onClick: () => onUpdateQuantity(item.id, item.quantity - 1),
                disabled: item.quantity <= 1
              }, React.createElement('i', { className: 'fas fa-minus' })),
              
              React.createElement('span', {
                key: 'display',
                className: 'quantity-display'
              }, item.quantity),
              
              React.createElement('button', {
                key: 'increase',
                className: 'quantity-btn',
                onClick: () => onUpdateQuantity(item.id, item.quantity + 1)
              }, React.createElement('i', { className: 'fas fa-plus' }))
            ]),
            
            React.createElement('div', {
              key: 'price',
              className: 'text-lg font-bold text-primary'
            }, `€${(item.price * item.quantity).toFixed(2)}`)
          ])
        ])
      ])
    )),
    
    React.createElement('div', {
      key: 'total',
      style: { padding: '1rem' }
    }, React.createElement('div', {
      className: 'card'
    }, [
      React.createElement('div', {
        key: 'content',
        className: 'card-content',
        style: { padding: '1.5rem' }
      }, [
        React.createElement('div', {
          key: 'subtotal',
          className: 'total-row'
        }, [
          React.createElement('span', { key: 'label' }, 'Subtotal'),
          React.createElement('span', { key: 'value' }, `€${subtotal.toFixed(2)}`)
        ]),
        
        React.createElement('div', {
          key: 'tax',
          className: 'total-row'
        }, [
          React.createElement('span', { key: 'label' }, `Tax (${((ConfigManager.app?.tax?.rate || 0.08) * 100).toFixed(0)}%)`),
          React.createElement('span', { key: 'value' }, `€${tax.toFixed(2)}`)
        ]),
        
        deliveryFee > 0 ? React.createElement('div', {
          key: 'delivery',
          className: 'total-row'
        }, [
          React.createElement('span', { key: 'label' }, 'Delivery'),
          React.createElement('span', { key: 'value' }, `€${deliveryFee.toFixed(2)}`)
        ]) : null,
        
        React.createElement('div', {
          key: 'total',
          className: 'total-row'
        }, [
          React.createElement('span', { key: 'label' }, 'Total'),
          React.createElement('span', { key: 'value' }, `€${total.toFixed(2)}`)
        ]),
        
        React.createElement('button', {
          key: 'checkout',
          className: 'btn btn-primary btn-lg',
          style: { width: '100%', marginTop: '1rem' },
          onClick: () => onCheckout(total)
        }, 'Proceed to Checkout')
      ])
    ]))
  ]);
};
    
    React.createElement('div', {
      key: 'items',
      style: { padding: '0.5rem' }
    }, items.map(item =>
      React.createElement('div', {
        key: item.id,
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.75rem',
          background: 'var(--surface-color)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          marginBottom: '0.5rem'
        }
      }, [
        React.createElement('img', {
          key: 'image',
          src: item.image,
          alt: item.name,
          style: {
            width: '50px',
            height: '50px',
            borderRadius: '6px',
            objectFit: 'cover',
            flexShrink: 0
          },
          onError: (e) => {
            e.target.style.display = 'none';
          }
        }),
        
        React.createElement('div', {
          key: 'info',
          style: { flex: 1, minWidth: 0 }
        }, [
          React.createElement('h4', {
            key: 'name',
            style: {
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '0.25rem',
              color: 'var(--text-primary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }
          }, item.name),
          React.createElement('p', {
            key: 'price',
            style: { 
              color: 'var(--text-secondary)',
              fontSize: '0.8rem',
              margin: 0
            }
          }, `€${item.price.toFixed(2)} each`)
        ]),
        
        React.createElement('div', {
          key: 'controls',
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }
        }, [
          React.createElement('div', {
            key: 'quantity-controls',
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'var(--border-color)',
              borderRadius: '15px',
              padding: '0.2rem'
            }
          }, [
            React.createElement('button', {
              key: 'decrease',
              onClick: () => onUpdateQuantity(item.id, item.quantity - 1),
              style: {
                background: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem'
              }
            }, React.createElement('i', { className: 'fas fa-minus' })),
            
            React.createElement('span', {
              key: 'quantity',
              style: { 
                fontWeight: '600',
                minWidth: '1.2rem',
                textAlign: 'center',
                fontSize: '0.85rem'
              }
            }, item.quantity),
            
            React.createElement('button', {
              key: 'increase',
              onClick: () => onUpdateQuantity(item.id, item.quantity + 1),
              style: {
                background: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem'
              }
            }, React.createElement('i', { className: 'fas fa-plus' }))
          ]),
          
          React.createElement('div', {
            key: 'total',
            style: { 
              fontWeight: '600',
              minWidth: '3rem',
              textAlign: 'right',
              fontSize: '0.9rem'
            }
          }, `€${(item.price * item.quantity).toFixed(2)}`),
          
          React.createElement('button', {
            key: 'remove',
            onClick: () => onRemoveItem(item.id),
            style: {
              background: 'none',
              border: 'none',
              color: 'var(--error-color)',
              cursor: 'pointer',
              padding: '0.25rem',
              fontSize: '0.9rem'
            }
          }, React.createElement('i', { className: 'fas fa-trash' }))
        ])
      ])
    )),
    
    // Fixed bottom summary
    React.createElement('div', {
      key: 'summary',
      style: {
        position: 'fixed',
        bottom: 'calc(80px + env(safe-area-inset-bottom))',
        left: 0,
        right: 0,
        background: 'var(--surface-color)',
        borderTop: '1px solid var(--border-color)',
        padding: '1rem',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
        zIndex: 99
      }
    }, [
      React.createElement('div', {
        key: 'totals',
        style: { marginBottom: '1rem' }
      }, [
        React.createElement('div', {
          key: 'subtotal',
          style: { 
            display: 'flex', 
            justifyContent: 'space-between',
            marginBottom: '0.25rem',
            fontSize: '0.9rem'
          }
        }, [
          React.createElement('span', { key: 'label' }, 'Subtotal:'),
          React.createElement('span', { key: 'value' }, `€${subtotal.toFixed(2)}`)
        ]),
        
        React.createElement('div', {
          key: 'tax',
          style: { 
            display: 'flex', 
            justifyContent: 'space-between',
            marginBottom: '0.25rem',
            fontSize: '0.9rem'
          }
        }, [
          React.createElement('span', { key: 'label' }, 'Tax:'),
          React.createElement('span', { key: 'value' }, `€${tax.toFixed(2)}`)
        ]),
        
        deliveryFee > 0 && React.createElement('div', {
          key: 'delivery',
          style: { 
            display: 'flex', 
            justifyContent: 'space-between',
            marginBottom: '0.25rem',
            fontSize: '0.9rem'
          }
        }, [
          React.createElement('span', { key: 'label' }, 'Delivery:'),
          React.createElement('span', { key: 'value' }, `€${deliveryFee.toFixed(2)}`)
        ]),
        
        React.createElement('hr', {
          key: 'divider',
          style: { 
            margin: '0.5rem 0',
            border: 'none',
            borderTop: '1px solid var(--border-color)'
          }
        }),
        
        React.createElement('div', {
          key: 'total',
          style: { 
            display: 'flex', 
            justifyContent: 'space-between',
            fontSize: '1.1rem',
            fontWeight: '700'
          }
        }, [
          React.createElement('span', { key: 'label' }, 'Total:'),
          React.createElement('span', { key: 'value' }, `€${total.toFixed(2)}`)
        ])
      ]),
      
      React.createElement('button', {
        key: 'checkout',
        onClick: () => onCheckout(total),
        disabled: !navigator.onLine,
        style: {
          background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
          color: 'white',
          border: 'none',
          padding: '0.75rem 2rem',
          borderRadius: '25px',
          fontSize: '1rem',
          fontWeight: '700',
          cursor: 'pointer',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }
      }, [
        React.createElement('i', { 
          key: 'icon',
          className: 'fas fa-credit-card' 
        }),
        React.createElement('span', {
          key: 'text'
        }, navigator.onLine ? 'Proceed to Checkout' : 'Online Required for Checkout')
      ])
    ])
  ]);
};
