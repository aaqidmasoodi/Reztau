const OrderHistory = ({ onBack }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    loadOrders();
  }, []);
  
  const loadOrders = async () => {
    try {
      setLoading(true);
      const currentUser = NhostManager.getCurrentUser();
      
      if (!currentUser) {
        setError('Please sign in to view order history');
        return;
      }
      
      const result = await NhostManager.graphqlRequest(`
        query GetUserOrders($userId: uuid!) {
          orders(
            where: { user_id: { _eq: $userId } }
            order_by: { created_at: desc }
          ) {
            id
            total
            status
            customer_name
            customer_phone
            delivery_address
            created_at
          }
        }
      `, { userId: currentUser.id });
      
      // Get order items separately for now
      const ordersWithItems = await Promise.all(
        result.orders.map(async (order) => {
          const itemsResult = await NhostManager.graphqlRequest(`
            query GetOrderItems($orderId: uuid!) {
              order_items(where: { order_id: { _eq: $orderId } }) {
                id
                item_name
                item_image
                quantity
                price
              }
            }
          `, { orderId: order.id });
          
          return {
            ...order,
            order_items: itemsResult.order_items || []
          };
        })
      );
      
      setOrders(ordersWithItems);
    } catch (error) {
      console.error('Failed to load orders:', error);
      setError('Failed to load order history');
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'preparing': return '#3b82f6';
      case 'ready': return '#10b981';
      case 'delivered': return '#6b7280';
      default: return '#6b7280';
    }
  };
  
  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Order Received';
      case 'preparing': return 'Preparing';
      case 'ready': return 'Ready for Pickup';
      case 'delivered': return 'Delivered';
      default: return status;
    }
  };
  
  const loadingContent = React.createElement('div', {
    style: {
      textAlign: 'center',
      padding: '3rem 1rem',
      color: 'var(--text-secondary)'
    }
  }, [
    React.createElement('i', {
      key: 'icon',
      className: 'fas fa-spinner fa-spin',
      style: { fontSize: '2rem', marginBottom: '1rem' }
    }),
    React.createElement('div', {
      key: 'text',
      style: { fontSize: '1.1rem' }
    }, 'Loading your orders...')
  ]);
  
  return React.createElement('div', {
    style: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'var(--background-color)',
      zIndex: 1000,
      overflow: 'auto',
      paddingTop: 'calc(70px + env(safe-area-inset-top))',
      transform: 'translateX(0)',
      transition: 'transform 0.3s ease-out',
      animation: 'slideInFromRight 0.3s ease-out'
    }
  }, [
    // Content
    React.createElement('div', {
      key: 'content',
      style: { padding: '1rem', paddingBottom: '2rem' }
    }, loading ? [loadingContent] : [
      error && React.createElement('div', {
        key: 'error',
        style: {
          color: 'var(--error-color)',
          textAlign: 'center',
          padding: '2rem',
          fontSize: '1rem'
        }
      }, error),
      
      orders.length === 0 && !error && React.createElement('div', {
        key: 'empty',
        style: {
          textAlign: 'center',
          padding: '3rem 1rem',
          color: 'var(--text-secondary)'
        }
      }, [
        React.createElement('i', {
          key: 'icon',
          className: 'fas fa-receipt',
          style: {
            fontSize: '3rem',
            marginBottom: '1rem',
            opacity: 0.5
          }
        }),
        React.createElement('h3', {
          key: 'title',
          style: {
            fontSize: '1.2rem',
            marginBottom: '0.5rem',
            color: 'var(--text-primary)'
          }
        }, 'No Orders Yet'),
        React.createElement('p', {
          key: 'subtitle',
          style: { fontSize: '0.9rem' }
        }, 'Your order history will appear here')
      ]),
      
      // Orders list
      ...orders.map(order => 
        React.createElement('div', {
          key: order.id,
          style: {
            background: 'var(--surface-color)',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '1rem',
            boxShadow: 'var(--shadow)',
            border: '1px solid var(--border-color)'
          }
        }, [
          // Order header
          React.createElement('div', {
            key: 'header',
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '1rem'
            }
          }, [
            React.createElement('div', {
              key: 'info'
            }, [
              React.createElement('div', {
                key: 'date',
                style: {
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '0.25rem'
                }
              }, formatDate(order.created_at)),
              React.createElement('div', {
                key: 'id',
                style: {
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  fontFamily: 'monospace'
                }
              }, `Order #${order.id.slice(-8)}`)
            ]),
            React.createElement('div', {
              key: 'status-total',
              style: { textAlign: 'right' }
            }, [
              React.createElement('div', {
                key: 'status',
                style: {
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: 'white',
                  background: getStatusColor(order.status),
                  marginBottom: '0.5rem'
                }
              }, getStatusText(order.status)),
              React.createElement('div', {
                key: 'total',
                style: {
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  color: 'var(--text-primary)'
                }
              }, `€${order.total.toFixed(2)}`)
            ])
          ]),
          
          // Order items
          React.createElement('div', {
            key: 'items',
            style: {
              borderTop: '1px solid var(--border-color)',
              paddingTop: '1rem'
            }
          }, order.order_items.map(item =>
            React.createElement('div', {
              key: item.id,
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '0.75rem'
              }
            }, [
              React.createElement('div', {
                key: 'image',
                style: {
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: 'var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem'
                }
              }, item.item_image ? 
                React.createElement('img', {
                  src: item.item_image,
                  alt: item.item_name,
                  style: {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  },
                  onError: (e) => {
                    e.target.style.display = 'none';
                  }
                }) : '🍽️'
              ),
              React.createElement('div', {
                key: 'details',
                style: { flex: 1 }
              }, [
                React.createElement('div', {
                  key: 'name',
                  style: {
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    marginBottom: '0.25rem'
                  }
                }, item.item_name),
                React.createElement('div', {
                  key: 'quantity-price',
                  style: {
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)'
                  }
                }, `${item.quantity}x €${item.price.toFixed(2)}`)
              ])
            ])
          )),
          
          // Delivery info
          order.delivery_address && React.createElement('div', {
            key: 'delivery',
            style: {
              borderTop: '1px solid var(--border-color)',
              paddingTop: '1rem',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)'
            }
          }, [
            React.createElement('div', {
              key: 'address',
              style: { marginBottom: '0.25rem' }
            }, [
              React.createElement('i', {
                key: 'icon',
                className: 'fas fa-map-marker-alt',
                style: { marginRight: '0.5rem' }
              }),
              order.delivery_address
            ]),
            order.customer_phone && React.createElement('div', {
              key: 'phone'
            }, [
              React.createElement('i', {
                key: 'icon',
                className: 'fas fa-phone',
                style: { marginRight: '0.5rem' }
              }),
              order.customer_phone
            ])
          ])
        ])
      )
    ].filter(Boolean))
  ]);
};
