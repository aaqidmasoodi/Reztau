const StripeManager = {
  stripe: null,
  
  init(publishableKey) {
    this.stripe = Stripe(publishableKey);
  },
  
  async processPayment(orderData) {
    if (!navigator.onLine) {
      throw new Error('Internet connection required for payment processing');
    }
    
    try {
      // Calculate total
      const total = orderData.total;
      
      // Simulate payment processing for demo
      console.log('Processing payment for:', total);
      console.log('Customer:', orderData.customer);
      console.log('Items:', orderData.items);
      
      // Simulate payment delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create order in Nhost database after successful payment
      const currentUser = NhostManager.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
      
      // Create order
      const nhostOrderData = {
        user_id: currentUser.id,
        total: total,
        status: 'pending',
        customer_name: orderData.customer.name,
        customer_email: orderData.customer.email,
        customer_phone: orderData.customer.phone,
        delivery_address: orderData.customer.address
      };
      
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
      
      // Create order items one by one
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
      
      // Return success with order ID (simulating Stripe response format)
      return {
        id: 'pi_demo_' + Date.now(),
        status: 'succeeded',
        orderId: orderId,
        total: total
      };
      
    } catch (error) {
      console.error('Payment processing failed:', error);
      throw error;
    }
  }
};
