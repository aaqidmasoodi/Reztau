const StripePaymentForm = ({ orderData, onSuccess, onError, onCancel }) => {
  const [stripe, setStripe] = useState(null);
  const [elements, setElements] = useState(null);
  const [cardElement, setCardElement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    initializeStripe();
  }, []);
  
  const initializeStripe = async () => {
    try {
      // Load Stripe.js if not already loaded
      if (!window.Stripe) {
        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/';
        script.async = true;
        document.head.appendChild(script);
        
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }
      
      // Get publishable key from config
      const publishableKey = ConfigManager.app?.stripe?.publishableKey;
      
      if (!publishableKey || publishableKey === 'pk_test_your_stripe_publishable_key_here') {
        throw new Error('Please add your Stripe publishable key to config/app-config.json');
      }
      
      const stripeInstance = Stripe(publishableKey);
      const elementsInstance = stripeInstance.elements({
        mode: 'setup',
        currency: 'usd'
      });
      
      // Create payment element with minimal configuration
      const paymentElementInstance = elementsInstance.create('payment', {
        layout: 'tabs'
      });
      
      setStripe(stripeInstance);
      setElements(elementsInstance);
      setCardElement(paymentElementInstance);
      
      // Add error listener
      paymentElementInstance.on('loaderror', (event) => {
        console.error('Payment Element load error:', event.error);
        setError('Failed to load payment form. Please refresh and try again.');
      });
      
      // Mount payment element after a short delay to ensure DOM is ready
      setTimeout(() => {
        const paymentContainer = document.getElementById('payment-element');
        if (paymentContainer) {
          paymentElementInstance.mount('#payment-element');
        }
      }, 100);
      
    } catch (error) {
      console.error('Failed to initialize Stripe:', error);
      setError(error.message);
    }
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements || !cardElement) {
      setError('Stripe not initialized');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Submit payment element (works with all payment methods)
      const { error: submitError } = await elements.submit();
      
      if (submitError) {
        throw new Error(submitError.message);
      }
      
      // Create payment method from payment element
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        elements,
        params: {
          billing_details: {
            name: orderData.customer.name,
            email: orderData.customer.email,
            phone: orderData.customer.phone,
            address: {
              line1: orderData.customer.address,
              postal_code: '12345',
              country: 'US'
            },
          },
        },
      });
      
      if (paymentMethodError) {
        // Handle common Stripe errors more gracefully
        let errorMessage = paymentMethodError.message;
        
        if (errorMessage.includes('postal code')) {
          errorMessage = 'Please enter a valid postal code in the payment form';
        } else if (errorMessage.includes('card number')) {
          errorMessage = 'Please enter a valid card number';
        } else if (errorMessage.includes('expiry') || errorMessage.includes('expiration')) {
          errorMessage = 'Please enter a valid expiration date';
        } else if (errorMessage.includes('cvc') || errorMessage.includes('security')) {
          errorMessage = 'Please enter a valid CVC code';
        }
        
        throw new Error(errorMessage);
      }
      
      console.log('✅ Payment method created successfully:', paymentMethod.type);
      
      // Simulate payment processing (since we can't charge without a backend)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, we'll consider this a successful payment
      onSuccess({
        id: paymentMethod.id,
        status: 'succeeded',
        total: orderData.total
      });
      
    } catch (error) {
      console.error('Payment failed:', error);
      setError(error.message);
      onError(error);
    } finally {
      setLoading(false);
    }
  };
  
  return React.createElement('div', {
    style: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '1rem'
    }
  }, [
    React.createElement('div', {
      key: 'payment-form',
      style: {
        background: 'var(--surface-color)',
        borderRadius: '16px',
        padding: '2rem',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
      }
    }, [
      // Header
      React.createElement('div', {
        key: 'header',
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem'
        }
      }, [
        React.createElement('h2', {
          key: 'title',
          style: {
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'var(--text-primary)',
            margin: 0
          }
        }, 'Payment Details'),
        React.createElement('button', {
          key: 'close',
          onClick: onCancel,
          style: {
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: 'var(--text-secondary)'
          }
        }, '×')
      ]),
      
      // Order summary
      React.createElement('div', {
        key: 'summary',
        style: {
          background: 'var(--background-color)',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1.5rem'
        }
      }, [
        React.createElement('div', {
          key: 'total',
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '1.2rem',
            fontWeight: '700',
            color: 'var(--text-primary)'
          }
        }, [
          React.createElement('span', { key: 'label' }, 'Total'),
          React.createElement('span', { key: 'amount' }, `$${orderData.total.toFixed(2)}`)
        ])
      ]),
      
      // Payment form
      React.createElement('form', {
        key: 'form',
        onSubmit: handleSubmit
      }, [
        // Payment element container
        React.createElement('div', {
          key: 'payment-container',
          style: {
            marginBottom: '1rem'
          }
        }, [
          React.createElement('label', {
            key: 'label',
            style: {
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '0.5rem'
            }
          }, 'Payment Method'),
          React.createElement('div', {
            key: 'payment-element',
            id: 'payment-element',
            style: {
              padding: '0',
              border: 'none',
              borderRadius: '8px',
              background: 'transparent'
            }
          })
        ]),
        
        // Error message
        error && React.createElement('div', {
          key: 'error',
          style: {
            color: '#fa755a',
            fontSize: '0.9rem',
            marginBottom: '1rem',
            textAlign: 'center'
          }
        }, error),
        
        // Submit button
        React.createElement('button', {
          key: 'submit',
          type: 'submit',
          disabled: loading || !stripe,
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }
        }, [
          loading && React.createElement('i', {
            key: 'spinner',
            className: 'fas fa-spinner fa-spin'
          }),
          React.createElement('span', {
            key: 'text'
          }, loading ? 'Processing...' : `Pay $${orderData.total.toFixed(2)}`)
        ])
      ]),
      
      // Test card info
      React.createElement('div', {
        key: 'test-info',
        style: {
          marginTop: '1rem',
          padding: '0.75rem',
          background: 'var(--background-color)',
          borderRadius: '8px',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)'
        }
      }, [
        React.createElement('div', {
          key: 'title',
          style: { fontWeight: '600', marginBottom: '0.25rem' }
        }, 'Test Card:'),
        React.createElement('div', { key: 'card' }, '4242 4242 4242 4242'),
        React.createElement('div', { key: 'exp' }, 'Exp: 12/25, CVC: 123')
      ])
    ])
  ]);
};
