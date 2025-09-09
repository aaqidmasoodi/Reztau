const Checkout = ({ cartItems, onBack, onOrderComplete, onShowOrderHistory, hideBottomButton = false, checkoutTrigger = 0, onSetLoading, onSetError, onShowOrderSuccess, onShowStripePayment }) => {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  
  useEffect(() => {
    // Pre-fill with user data
    const currentUser = NhostManager.getCurrentUser();
    if (currentUser) {
      setCustomerInfo(prev => ({
        ...prev,
        email: currentUser.email || '',
        name: currentUser.displayName || currentUser.email || ''
      }));
    }
  }, []);
  
  // Listen for external checkout trigger
  useEffect(() => {
    if (checkoutTrigger > 0 && !loading) {
      // Validate form before proceeding
      const isValid = validateForm();
      if (isValid) {
        // Set loading state in parent
        if (onSetLoading) onSetLoading(true);
        handleSubmit();
      }
    }
  }, [checkoutTrigger]);
  
  const validateForm = () => {
    // Check required fields
    if (!customerInfo.name.trim()) {
      const errorMsg = 'Please enter your name';
      setError(errorMsg);
      if (onSetError) onSetError(errorMsg);
      return false;
    }
    if (!customerInfo.email.trim()) {
      const errorMsg = 'Please enter your email';
      setError(errorMsg);
      if (onSetError) onSetError(errorMsg);
      return false;
    }
    if (!customerInfo.phone.trim()) {
      const errorMsg = 'Please enter your phone number';
      setError(errorMsg);
      if (onSetError) onSetError(errorMsg);
      return false;
    }
    if (!customerInfo.address.trim()) {
      const errorMsg = 'Please enter your address';
      setError(errorMsg);
      if (onSetError) onSetError(errorMsg);
      return false;
    }
    
    // Clear any existing errors
    setError('');
    if (onSetError) onSetError('');
    return true;
  };
  
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const handleInputChange = (field, value) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSubmit = async () => {
    // Validate form - only phone and address required
    if (!customerInfo.phone) {
      const errorMsg = 'Please provide a phone number';
      setError(errorMsg);
      if (onSetLoading) onSetLoading(false); // Reset loading state
      if (onSetError) onSetError(errorMsg);
      return;
    }
    
    if (!customerInfo.address) {
      const errorMsg = 'Please provide a delivery address';
      setError(errorMsg);
      if (onSetLoading) onSetLoading(false); // Reset loading state
      if (onSetError) onSetError(errorMsg);
      return;
    }
    
    // Show external Stripe payment form
    const orderData = {
      items: cartItems,
      customer: customerInfo,
      total: total,
      type: 'delivery'
    };
    
    if (onShowStripePayment) {
      onShowStripePayment(orderData);
    }
  };
  
  if (showSuccess && completedOrder) {
    return React.createElement(OrderSuccess, {
      orderId: completedOrder.orderId,
      total: completedOrder.total,
      onClose: () => {
        setShowSuccess(false);
        onOrderComplete(); // Clear cart and close checkout
      },
      onShowOrderHistory: () => {
        // This will be called when user clicks "Track Order"
        if (onShowOrderHistory) {
          onShowOrderHistory();
        }
      }
    });
  }
  
  return React.createElement('div', {
    style: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'var(--background-color)',
      zIndex: 2001,
      overflow: 'auto'
    }
  }, [
    // Header
    React.createElement(PageHeader, {
      key: 'header',
      title: 'Checkout',
      onBack: onBack
    }),
    
    // Content
    React.createElement('div', {
      key: 'content',
      style: { padding: '1rem', paddingBottom: '2rem' }
    }, [
      // Order summary
      React.createElement('div', {
        key: 'order-summary',
        style: {
          background: 'var(--surface-color)',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1rem',
          boxShadow: 'var(--shadow)',
          border: '1px solid var(--border-color)'
        }
      }, [
        React.createElement('h3', {
          key: 'title',
          style: {
            fontSize: '1rem',
            fontWeight: '700',
            marginBottom: '1rem',
            color: 'var(--text-primary)'
          }
        }, 'Order Summary'),
        
        // Items
        ...cartItems.map(item =>
          React.createElement('div', {
            key: item.id,
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.5rem 0',
              borderBottom: '1px solid var(--border-color)'
            }
          }, [
            React.createElement('div', {
              key: 'item-info',
              style: { flex: 1 }
            }, [
              React.createElement('div', {
                key: 'name',
                style: {
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)'
                }
              }, item.name),
              React.createElement('div', {
                key: 'quantity',
                style: {
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)'
                }
              }, `Quantity: ${item.quantity}`)
            ]),
            React.createElement('div', {
              key: 'price',
              style: {
                fontSize: '0.9rem',
                fontWeight: '600',
                color: 'var(--text-primary)'
              }
            }, `€${(item.price * item.quantity).toFixed(2)}`)
          ])
        ),
        
        // Total
        React.createElement('div', {
          key: 'total',
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 0 0',
            fontSize: '1.1rem',
            fontWeight: '700',
            color: 'var(--text-primary)'
          }
        }, [
          React.createElement('span', { key: 'label' }, 'Total'),
          React.createElement('span', { key: 'amount' }, `€${total.toFixed(2)}`)
        ])
      ]),
      
      // Customer info form
      React.createElement('div', {
        key: 'customer-form',
        style: {
          background: 'var(--surface-color)',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1rem',
          boxShadow: 'var(--shadow)',
          border: '1px solid var(--border-color)'
        }
      }, [
        React.createElement('h3', {
          key: 'title',
          style: {
            fontSize: '1rem',
            fontWeight: '700',
            marginBottom: '1rem',
            color: 'var(--text-primary)'
          }
        }, 'Delivery Information'),
        
        // Phone
        React.createElement('div', {
          key: 'phone-group',
          style: { marginBottom: '1rem' }
        }, [
          React.createElement('label', {
            key: 'label',
            style: {
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: 'var(--text-primary)'
            }
          }, 'Phone Number *'),
          React.createElement('input', {
            key: 'input',
            type: 'tel',
            value: customerInfo.phone,
            onChange: (e) => handleInputChange('phone', e.target.value),
            placeholder: '+353 1 234 5678',
            style: {
              width: '100%',
              padding: '0.75rem',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              fontSize: '1rem',
              outline: 'none',
              boxSizing: 'border-box'
            }
          })
        ]),
        
        // Address
        React.createElement('div', {
          key: 'address-group',
          style: { marginBottom: '1rem' }
        }, [
          React.createElement('label', {
            key: 'label',
            style: {
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: 'var(--text-primary)'
            }
          }, 'Delivery Address *'),
          React.createElement('textarea', {
            key: 'input',
            value: customerInfo.address,
            onChange: (e) => handleInputChange('address', e.target.value),
            placeholder: 'Street address, apartment, city, postal code',
            rows: 3,
            style: {
              width: '100%',
              padding: '0.75rem',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              fontSize: '1rem',
              outline: 'none',
              boxSizing: 'border-box',
              resize: 'vertical'
            }
          })
        ])
      ]),
      
      // Error message
      error && React.createElement('div', {
        key: 'error',
        style: {
          color: 'var(--error-color)',
          fontSize: '0.9rem',
          marginBottom: '1rem',
          textAlign: 'center',
          padding: '0.75rem',
          background: 'rgba(239, 68, 68, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(239, 68, 68, 0.2)'
        }
      }, error),
      
      // Place order button (conditionally rendered)
      !hideBottomButton && React.createElement('button', {
        key: 'place-order',
        onClick: handleSubmit,
        disabled: loading,
        style: {
          width: '100%',
          padding: '1rem',
          background: loading ? 'var(--border-color)' : 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '1.1rem',
          fontWeight: '700',
          cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: loading ? 'none' : '0 4px 12px rgba(0,0,0,0.15)',
          transition: 'all 0.2s'
        }
      }, loading ? 'Processing Order...' : `Place Order - €${total.toFixed(2)}`)
    ])
  ]);
};
