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
        currency: 'usd',
        paymentMethodCreation: 'manual'
      });
      
      // Create payment element with minimal configuration
      const paymentElementInstance = elementsInstance.create('payment', {
        layout: 'tabs',
        fields: {
          billingDetails: 'never'
        }
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
    console.log('🔄 Payment form submitted');
    
    if (!stripe || !elements || !cardElement) {
      console.error('❌ Stripe not properly initialized:', { stripe: !!stripe, elements: !!elements, cardElement: !!cardElement });
      setError('Stripe not initialized');
      return;
    }
    
    console.log('✅ Stripe components ready');
    setLoading(true);
    setError('');
    
    try {
      console.log('🔄 Submitting payment element...');
      // Submit payment element (works with all payment methods)
      const { error: submitError } = await elements.submit();
      
      if (submitError) {
        console.error('❌ Submit error:', submitError);
        throw new Error(submitError.message);
      }
      
      console.log('✅ Payment element submitted successfully');
      
      // Create payment method from payment element
      console.log('🔄 Creating payment method...');
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        elements,
        params: {
          billing_details: {
            name: orderData.customer.name,
            email: orderData.customer.email,
            phone: orderData.customer.phone,
            address: {
              line1: orderData.customer.address,
              city: 'New York',
              state: 'NY',
              postal_code: '12345',
              country: 'US'
            },
          },
        },
      });
      
      if (paymentMethodError) {
        console.error('❌ Payment method error:', paymentMethodError);
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
      
      console.log('✅ Payment method created successfully:', paymentMethod.type, paymentMethod.id);
      
      // Simulate payment processing (since we can't charge without a backend)
      console.log('🔄 Simulating payment processing...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if this is a test card that should fail
      const cardNumber = paymentMethod.card?.last4;
      console.log('💳 Card last 4 digits:', cardNumber);
      
      // Simulate different outcomes based on test cards
      if (cardNumber === '0002') {
        // 4000 0000 0000 0002 - Generic decline
        console.log('❌ Simulating card declined');
        throw new Error('Your card was declined. Please try a different payment method.');
      } else if (cardNumber === '0069') {
        // 4000 0000 0000 0069 - Expired card
        console.log('❌ Simulating expired card');
        throw new Error('Your card has expired. Please use a different card.');
      } else if (cardNumber === '0127') {
        // 4000 0000 0000 0127 - Incorrect CVC
        console.log('❌ Simulating incorrect CVC');
        throw new Error('Your card\'s security code is incorrect. Please try again.');
      }
      
      console.log('✅ Payment processing complete, calling onSuccess callback...');
      
      // For demo purposes, we'll consider this a successful payment
      const successData = {
        id: paymentMethod.id,
        status: 'succeeded',
        total: orderData.total
      };
      
      console.log('📤 Calling onSuccess with data:', successData);
      onSuccess(successData);
      
    } catch (error) {
      console.error('❌ Payment failed:', error);
      setError(error.message);
      console.log('📤 Calling onError with:', error);
      onError(error);
    } finally {
      console.log('🔄 Setting loading to false');
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
      padding: '1rem',
      overflowY: 'auto'
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
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        margin: 'auto'
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
          style: { fontWeight: '600', marginBottom: '0.5rem' }
        }, 'Test Cards:'),
        React.createElement('div', { key: 'success' }, '✅ Success: 4242 4242 4242 4242'),
        React.createElement('div', { key: 'decline' }, '❌ Declined: 4000 0000 0000 0002'),
        React.createElement('div', { key: 'expired' }, '⏰ Expired: 4000 0000 0000 0069'),
        React.createElement('div', { key: 'cvc' }, '🔒 Bad CVC: 4000 0000 0000 0127'),
        React.createElement('div', { key: 'exp' }, 'Exp: 12/25, CVC: 123')
      ])
    ])
  ]);
};
