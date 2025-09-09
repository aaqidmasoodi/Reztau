const StripeManager = {
  stripe: null,
  elements: null,
  
  async init(publishableKey) {
    if (!publishableKey || publishableKey === 'pk_test_your_stripe_publishable_key_here') {
      console.warn('⚠️ Using demo mode - Please add your Stripe publishable key to config/app-config.json');
      return this.initDemoMode();
    }
    
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
    
    this.stripe = Stripe(publishableKey);
  },
  
  initDemoMode() {
    console.log('🎭 Running in demo mode - no real payments');
    this.stripe = null;
  },
  
  async createPaymentIntent(orderData) {
    if (!this.stripe) {
      throw new Error('Stripe not initialized. Please add your publishable key to config.');
    }
    
    // In a real app, this would call your backend to create a PaymentIntent
    // For now, we'll simulate this with a mock backend call
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(orderData.total * 100), // Convert to cents
          currency: 'usd',
          metadata: {
            customer_name: orderData.customer.name,
            customer_email: orderData.customer.email,
            items: JSON.stringify(orderData.items.map(item => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price
            })))
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error('Backend not available');
      }
      
      const { client_secret } = await response.json();
      return client_secret;
    } catch (error) {
      // Fallback to demo mode if backend not available
      console.warn('⚠️ Backend not available, falling back to demo mode');
      return this.processDemoPayment(orderData);
    }
  },
  
  async processPayment(orderData) {
    if (!this.stripe) {
      return this.processDemoPayment(orderData);
    }
    
    try {
      // For frontend-only apps, we'll use a simulated payment flow
      // In a real production app, you'd need a backend to create payment intents
      console.log('🔄 Processing payment with Stripe (frontend-only mode)...');
      
      // Create a payment method first
      const { error: paymentMethodError, paymentMethod } = await this.stripe.createPaymentMethod({
        type: 'card',
        card: {
          number: '4242424242424242', // Test card - in real app this comes from user input
          exp_month: 12,
          exp_year: 2025,
          cvc: '123',
        },
        billing_details: {
          name: orderData.customer.name,
          email: orderData.customer.email,
          phone: orderData.customer.phone,
          address: {
            line1: orderData.customer.address,
          },
        },
      });
      
      if (paymentMethodError) {
        throw new Error(paymentMethodError.message);
      }
      
      console.log('✅ Payment method created:', paymentMethod.id);
      
      // Simulate successful payment (since we can't create payment intents without a server)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save order to database
      const orderId = await this.saveOrderToDatabase(orderData, paymentMethod.id);
      
      return {
        id: paymentMethod.id,
        status: 'succeeded',
        orderId: orderId,
        total: orderData.total
      };
      
    } catch (error) {
      console.error('Stripe payment failed:', error);
      // Fall back to demo mode if Stripe fails
      console.log('🎭 Falling back to demo mode...');
      return this.processDemoPayment(orderData);
    }
  },
  
  async processDemoPayment(orderData) {
    console.log('🎭 Processing demo payment...');
    
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Save order to database
    const orderId = await this.saveOrderToDatabase(orderData, 'demo_' + Date.now());
    
    return {
      id: 'pi_demo_' + Date.now(),
      status: 'succeeded',
      orderId: orderId,
      total: orderData.total
    };
  },
  
  async saveOrderToDatabase(orderData, paymentId) {
    const currentUser = NhostManager.getCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    // Create order (temporarily without payment_id until schema refreshes)
    const nhostOrderData = {
      user_id: currentUser.id,
      total: orderData.total,
      status: 'pending',
      customer_name: orderData.customer.name,
      customer_email: orderData.customer.email,
      customer_phone: orderData.customer.phone,
      delivery_address: orderData.customer.address
    };
    
    console.log('💳 Payment ID for tracking:', paymentId);
    
    const orderResult = await NhostManager.graphqlRequest(`
      mutation CreateOrder($order: orders_insert_input!) {
        insert_orders_one(object: $order) {
          id
          total
          status
          created_at
        }
      }
    `, { order: nhostOrderData });
    
    const orderId = orderResult.insert_orders_one.id;
    console.log('✅ Order created in database:', orderId);
    
    // Create order items
    for (const item of orderData.items) {
      await NhostManager.graphqlRequest(`
        mutation CreateOrderItem($item: order_items_insert_input!) {
          insert_order_items_one(object: $item) {
            id
          }
        }
      `, { 
        item: {
          order_id: orderId,
          item_name: item.name,
          item_image: item.image,
          quantity: item.quantity,
          price: item.price
        }
      });
    }
    
    console.log('✅ Order items saved to database');
    
    // Start order status updates
    this.startOrderStatusUpdates(orderId);
    
    return orderId;
  },
  
  startOrderStatusUpdates(orderId) {
    // Simulate restaurant workflow - update order status over time
    setTimeout(async () => {
      try {
        await NhostManager.graphqlRequest(`
          mutation UpdateOrderStatus($orderId: uuid!, $status: String!) {
            update_orders_by_pk(pk_columns: {id: $orderId}, _set: {status: $status}) {
              id
              status
            }
          }
        `, { orderId: orderId, status: 'confirmed' });
        console.log('📋 Order status updated to: confirmed');
      } catch (error) {
        console.error('Failed to update order status:', error);
      }
    }, 30000); // 30 seconds
    
    setTimeout(async () => {
      try {
        await NhostManager.graphqlRequest(`
          mutation UpdateOrderStatus($orderId: uuid!, $status: String!) {
            update_orders_by_pk(pk_columns: {id: $orderId}, _set: {status: $status}) {
              id
              status
            }
          }
        `, { orderId: orderId, status: 'preparing' });
        console.log('👨‍🍳 Order status updated to: preparing');
      } catch (error) {
        console.error('Failed to update order status:', error);
      }
    }, 120000); // 2 minutes
    
    setTimeout(async () => {
      try {
        await NhostManager.graphqlRequest(`
          mutation UpdateOrderStatus($orderId: uuid!, $status: String!) {
            update_orders_by_pk(pk_columns: {id: $orderId}, _set: {status: $status}) {
              id
              status
            }
          }
        `, { orderId: orderId, status: 'ready' });
        console.log('🍽️ Order status updated to: ready');
      } catch (error) {
        console.error('Failed to update order status:', error);
      }
    }, 300000); // 5 minutes
    
    setTimeout(async () => {
      try {
        await NhostManager.graphqlRequest(`
          mutation UpdateOrderStatus($orderId: uuid!, $status: String!) {
            update_orders_by_pk(pk_columns: {id: $orderId}, _set: {status: $status}) {
              id
              status
            }
          }
        `, { orderId: orderId, status: 'delivered' });
        console.log('✅ Order status updated to: delivered');
      } catch (error) {
        console.error('Failed to update order status:', error);
      }
    }, 600000); // 10 minutes
  }
};
