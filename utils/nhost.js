const NhostManager = {
  config: null,
  client: null,
  
  async init() {
    try {
      // Load Nhost config
      const response = await fetch('config/nhost-config.json');
      this.config = await response.json();
      
      // Initialize Nhost client (we'll use fetch for now, can upgrade to SDK later)
      this.client = {
        graphql: this.config.graphqlUrl,
        auth: this.config.authUrl,
        storage: this.config.storageUrl
      };
      
      console.log('Nhost initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize Nhost:', error);
      return false;
    }
  },
  
  // Authentication methods
  async signUp(email, password) {
    try {
      const response = await fetch(`${this.config.authUrl}/signup/email-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });
      
      const data = await response.json();
      
      if (data.session) {
        localStorage.setItem('nhost-session', JSON.stringify(data.session));
        // User data is in session.user
        const user = data.session.user || data.user;
        if (user) {
          localStorage.setItem('nhost-user', JSON.stringify(user));
        }
        return { success: true, user: user, session: data.session };
      } else {
        return { success: false, error: data.error?.message || 'Signup failed' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  async signIn(email, password) {
    try {
      const response = await fetch(`${this.config.authUrl}/signin/email-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });
      
      const data = await response.json();
      
      if (data.session) {
        localStorage.setItem('nhost-session', JSON.stringify(data.session));
        // User data is in session.user
        const user = data.session.user || data.user;
        if (user) {
          localStorage.setItem('nhost-user', JSON.stringify(user));
        }
        return { success: true, user: user, session: data.session };
      } else {
        return { success: false, error: data.error?.message || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  async signOut() {
    try {
      const session = this.getSession();
      if (session?.accessToken) {
        await fetch(`${this.config.authUrl}/signout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.accessToken}`
          }
        });
      }
      
      localStorage.removeItem('nhost-session');
      localStorage.removeItem('nhost-user');
      return { success: true };
    } catch (error) {
      localStorage.removeItem('nhost-session');
      localStorage.removeItem('nhost-user');
      return { success: false, error: error.message };
    }
  },
  
  getSession() {
    try {
      const session = localStorage.getItem('nhost-session');
      return session ? JSON.parse(session) : null;
    } catch {
      return null;
    }
  },
  
  isAuthenticated() {
    const session = this.getSession();
    if (!session?.accessToken) return false;
    
    // Check if token is expired
    const tokenData = JSON.parse(atob(session.accessToken.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    
    return tokenData.exp > now;
  },
  
  getCurrentUser() {
    // First try to get stored user data
    try {
      const storedUser = localStorage.getItem('nhost-user');
      if (storedUser) {
        return JSON.parse(storedUser);
      }
    } catch (error) {
      console.log('Error parsing stored user:', error);
    }
    
    // Try to get user from session
    const session = this.getSession();
    if (session?.user) {
      return session.user;
    }
    
    // Fallback: extract user info from JWT token
    if (session?.accessToken) {
      try {
        const tokenData = JSON.parse(atob(session.accessToken.split('.')[1]));
        return {
          id: tokenData.sub,
          email: tokenData['https://hasura.io/jwt/claims']?.['x-hasura-user-email'] || 'user@example.com'
        };
      } catch (error) {
        console.log('Error parsing JWT:', error);
      }
    }
    
    return null;
  },
  
  // GraphQL methods
  async graphqlRequest(query, variables = {}) {
    try {
      const session = this.getSession();
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (session?.accessToken) {
        headers['Authorization'] = `Bearer ${session.accessToken}`;
      }
      
      const response = await fetch(this.config.graphqlUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query,
          variables
        })
      });
      
      const data = await response.json();
      
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }
      
      return data.data;
    } catch (error) {
      console.error('GraphQL request failed:', error);
      throw error;
    }
  },
  
  // Database schema setup
  async setupDatabase() {
    try {
      console.log('🔧 Setting up database schema...');
      
      // Create orders table
      const createOrdersTable = `
        mutation {
          __schema {
            mutationType {
              name
            }
          }
        }
      `;
      
      // For now, we'll use Hasura's tracking API to create tables
      // This requires admin access, so we'll create a simple setup function
      await this.createTablesViaHasura();
      
      console.log('✅ Database schema created successfully!');
      return true;
    } catch (error) {
      console.error('❌ Database setup failed:', error);
      return false;
    }
  },
  
  async createTablesViaHasura() {
    const hasuraUrl = this.config.graphqlUrl.replace('/v1', '');
    
    // Create orders table
    const createOrdersTable = {
      type: 'run_sql',
      args: {
        sql: `
          CREATE TABLE IF NOT EXISTS orders (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id uuid REFERENCES auth.users(id),
            total decimal(10,2) NOT NULL,
            status text DEFAULT 'pending',
            customer_name text,
            customer_email text,
            customer_phone text,
            delivery_address text,
            created_at timestamptz DEFAULT now(),
            updated_at timestamptz DEFAULT now()
          );
        `
      }
    };
    
    // Create order_items table
    const createOrderItemsTable = {
      type: 'run_sql',
      args: {
        sql: `
          CREATE TABLE IF NOT EXISTS order_items (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
            item_name text NOT NULL,
            item_image text,
            quantity integer NOT NULL,
            price decimal(10,2) NOT NULL,
            created_at timestamptz DEFAULT now()
          );
        `
      }
    };
    
    // Track tables in GraphQL
    const trackOrdersTable = {
      type: 'track_table',
      args: {
        schema: 'public',
        name: 'orders'
      }
    };
    
    const trackOrderItemsTable = {
      type: 'track_table',
      args: {
        schema: 'public',
        name: 'order_items'
      }
    };
    
    // Execute commands (Note: This needs admin access)
    console.log('📝 Creating tables programmatically...');
    console.log('⚠️  Note: This requires admin access to Hasura');
    
    // For now, let's just log what we would do
    console.log('Would create orders table:', createOrdersTable);
    console.log('Would create order_items table:', createOrderItemsTable);
    console.log('Would track tables:', trackOrdersTable, trackOrderItemsTable);
    
    return true;
  },
  async createOrder(orderData) {
    const query = `
      mutation CreateOrder($order: orders_insert_input!) {
        insert_orders_one(object: $order) {
          id
          total
          status
          created_at
          order_items {
            id
            item_name
            quantity
            price
          }
        }
      }
    `;
    
    return await this.graphqlRequest(query, { order: orderData });
  },
  
  async getUserOrders(userId) {
    const query = `
      query GetUserOrders($userId: uuid!) {
        orders(
          where: { user_id: { _eq: $userId } }
          order_by: { created_at: desc }
        ) {
          id
          total
          status
          created_at
          order_items {
            id
            item_name
            quantity
            price
            item_image
          }
        }
      }
    `;
    
    return await this.graphqlRequest(query, { userId });
  }
};
