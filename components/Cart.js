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
          onClick: () => onCheckout(total),
          disabled: !navigator.onLine
        }, [
          React.createElement('i', { 
            key: 'icon',
            className: 'fas fa-credit-card',
            style: { marginRight: '0.5rem' }
          }),
          React.createElement('span', {
            key: 'text'
          }, navigator.onLine ? 'Proceed to Checkout' : 'Online Required for Checkout')
        ])
      ])
    ]))
  ]);
};
