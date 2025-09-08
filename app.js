const { useState, useEffect } = React;

const App = () => {
  const [activeTab, setActiveTab] = useState('menu');
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showItemDetail, setShowItemDetail] = useState(false);
  const [currentView, setCurrentView] = useState('menu');
  const [showSidebar, setShowSidebar] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [favoritesRefresh, setFavoritesRefresh] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  
  // Initialize app
  // Update cart count when cart items change
  useEffect(() => {
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(count);
  }, [cartItems]);
  
  useEffect(() => {
    const initApp = async () => {
      try {
        await ConfigManager.loadAll();
        CartManager.init();
        setCartItems([...CartManager.items]);
        
        // Initialize favorites
        FavoritesManager.init();
        
        // Initialize Nhost
        const nhostReady = await NhostManager.init();
        if (nhostReady) {
          console.log('✅ Nhost connected successfully!');
        } else {
          console.log('❌ Nhost connection failed');
        }
        
        // Initialize auth with Nhost
        const authenticated = NhostManager.isAuthenticated();
        setIsAuthenticated(authenticated);
        if (authenticated) {
          setCurrentUser(NhostManager.getCurrentUser());
        }
        
        if (ConfigManager.app?.stripe?.publishableKey) {
          StripeManager.init(ConfigManager.app.stripe.publishableKey);
        }
        
        const savedTheme = localStorage.getItem('reztau-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        ConfigManager.applyTheme(initialTheme);
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to initialize app:', err);
        setError('Failed to load app configuration');
        setLoading(false);
      }
    };
    
    initApp();
  }, []);
  
  // Cart management
  const handleAddToCart = (item) => {
    CartManager.addItem(item);
    setCartItems([...CartManager.items]);
  };
  
  const handleUpdateQuantity = (itemId, quantity) => {
    CartManager.updateQuantity(itemId, quantity);
    setCartItems([...CartManager.items]);
  };
  
  const handleRemoveItem = (itemId) => {
    CartManager.removeItem(itemId);
    setCartItems([...CartManager.items]);
  };
  
  const handleCheckout = (total) => {
    setShowCheckout(true);
  };
  
  const handleItemClick = (item) => {
    setSelectedItem(item);
    setCurrentView('item-detail');
  };
  
  const handleBackToMenu = () => {
    setCurrentView('menu');
    setSelectedItem(null);
  };
  
  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentUser(NhostManager.getCurrentUser());
  };
  
  const handleLogout = async () => {
    await NhostManager.signOut();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setActiveTab('menu');
  };
  
  const handleCartClick = () => {
    setActiveTab('cart');
  };
  
  const handleFavoritesClick = () => {
    setActiveTab('favorites');
  };
  
  const handleMenuToggle = () => {
    setShowSidebar(!showSidebar);
  };
  
  const handleCloseSidebar = () => {
    setShowSidebar(false);
  };
  
  const handleShowSettings = () => {
    setShowSettings(true);
    setShowSidebar(false);
  };
  
  const handleCloseSettings = () => {
    setShowSettings(false);
  };
  
  const handleShowOrderHistory = () => {
    setShowOrderHistory(true);
    setShowSidebar(false);
  };
  
  const handleCloseOrderHistory = () => {
    setShowOrderHistory(false);
  };
  
  const handleCloseCheckout = () => {
    setShowCheckout(false);
  };
  
  if (loading) {
    return React.createElement('div', {
      className: 'app'
    }, React.createElement('div', {
      className: 'loading',
      style: { 
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem'
      }
    }, 'Loading Reztau...'));
  }
  
  if (error) {
    return React.createElement('div', {
      className: 'app'
    }, React.createElement('div', {
      className: 'error',
      style: { margin: '2rem' }
    }, error));
  }
  
  // Show login if not authenticated
  if (!isAuthenticated) {
    return React.createElement(NhostLogin, {
      onLogin: handleLogin
    });
  }
  
  const renderContent = () => {
    if (currentView === 'item-detail' && selectedItem) {
      return React.createElement(ItemDetail, {
        item: selectedItem,
        onBack: handleBackToMenu,
        onAddToCart: handleAddToCart
      });
    }
    
    switch (activeTab) {
      case 'menu':
        return React.createElement(Menu, {
          onAddToCart: handleAddToCart,
          onItemClick: handleItemClick
        });
      
      case 'favorites':
        return React.createElement(Favorites, {
          onAddToCart: handleAddToCart,
          onItemClick: handleItemClick,
          onRefresh: favoritesRefresh
        });
      
      case 'orders':
        return React.createElement('div', {
          style: { 
            textAlign: 'center', 
            padding: '3rem 2rem',
            color: 'var(--text-secondary)',
            marginTop: 'calc(70px + env(safe-area-inset-top))'
          }
        }, [
          React.createElement('i', {
            key: 'icon',
            className: 'fas fa-receipt',
            style: { fontSize: '3rem', marginBottom: '1rem', color: 'var(--primary-color)' }
          }),
          React.createElement('h3', {
            key: 'title',
            style: { marginBottom: '0.5rem' }
          }, 'Order History'),
          React.createElement('p', {
            key: 'subtitle'
          }, 'Your past orders will appear here')
        ]);
      
      case 'about':
        return React.createElement('div', {
          style: { 
            marginTop: 'calc(70px + env(safe-area-inset-top))',
            paddingBottom: '2rem'
          }
        }, [
          // Hero section
          React.createElement('div', {
            key: 'hero',
            style: {
              background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
              color: 'white',
              padding: '2rem 1rem',
              textAlign: 'center'
            }
          }, [
            ConfigManager.restaurant?.logo && React.createElement('img', {
              key: 'logo',
              src: ConfigManager.restaurant.logo,
              alt: ConfigManager.restaurant.name,
              style: {
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginBottom: '1rem',
                border: '3px solid rgba(255,255,255,0.3)'
              },
              onError: (e) => {
                e.target.style.display = 'none';
              }
            }),
            React.createElement('h1', {
              key: 'name',
              style: {
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '0.5rem'
              }
            }, ConfigManager.restaurant?.name || 'Al Khair Restaurant'),
            React.createElement('p', {
              key: 'cuisine',
              style: {
                fontSize: '1rem',
                opacity: 0.9,
                marginBottom: '0.5rem'
              }
            }, `${ConfigManager.restaurant?.cuisine || 'Halal'} Cuisine • Est. ${ConfigManager.restaurant?.established || '2018'}`),
            React.createElement('p', {
              key: 'description',
              style: {
                fontSize: '0.9rem',
                opacity: 0.8,
                lineHeight: '1.4'
              }
            }, ConfigManager.restaurant?.description)
          ]),
          
          // Quick stats
          React.createElement('div', {
            key: 'stats',
            style: {
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              padding: '1rem',
              marginTop: '1rem',
              position: 'relative',
              zIndex: 1
            }
          }, [
            React.createElement('div', {
              key: 'delivery-time',
              style: {
                background: 'var(--surface-color)',
                padding: '1rem',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: 'var(--shadow)',
                border: '1px solid var(--border-color)'
              }
            }, [
              React.createElement('i', {
                key: 'icon',
                className: 'fas fa-clock',
                style: { color: 'var(--primary-color)', fontSize: '1.2rem', marginBottom: '0.5rem' }
              }),
              React.createElement('div', {
                key: 'time',
                style: { fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-primary)' }
              }, ConfigManager.restaurant?.delivery?.estimatedTime || '30-45 min'),
              React.createElement('div', {
                key: 'label',
                style: { fontSize: '0.7rem', color: 'var(--text-secondary)' }
              }, 'Delivery')
            ]),
            React.createElement('div', {
              key: 'min-order',
              style: {
                background: 'var(--surface-color)',
                padding: '1rem',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: 'var(--shadow)',
                border: '1px solid var(--border-color)'
              }
            }, [
              React.createElement('i', {
                key: 'icon',
                className: 'fas fa-euro-sign',
                style: { color: 'var(--primary-color)', fontSize: '1.2rem', marginBottom: '0.5rem' }
              }),
              React.createElement('div', {
                key: 'amount',
                style: { fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-primary)' }
              }, `€${ConfigManager.restaurant?.delivery?.freeDeliveryMinimum?.toFixed(2) || '25.00'}`),
              React.createElement('div', {
                key: 'label',
                style: { fontSize: '0.7rem', color: 'var(--text-secondary)' }
              }, 'Free Delivery')
            ]),
            React.createElement('div', {
              key: 'rating',
              style: {
                background: 'var(--surface-color)',
                padding: '1rem',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: 'var(--shadow)',
                border: '1px solid var(--border-color)'
              }
            }, [
              React.createElement('i', {
                key: 'icon',
                className: 'fas fa-star',
                style: { color: 'var(--warning-color)', fontSize: '1.2rem', marginBottom: '0.5rem' }
              }),
              React.createElement('div', {
                key: 'rating',
                style: { fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-primary)' }
              }, '4.8'),
              React.createElement('div', {
                key: 'label',
                style: { fontSize: '0.7rem', color: 'var(--text-secondary)' }
              }, 'Rating')
            ])
          ]),
          
          // Contact info
          React.createElement('div', {
            key: 'contact',
            style: {
              background: 'var(--surface-color)',
              margin: '1rem',
              borderRadius: '12px',
              padding: '1rem',
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
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }
            }, [
              React.createElement('i', { 
                key: 'icon',
                className: 'fas fa-address-book',
                style: { color: 'var(--primary-color)' }
              }),
              'Contact Information'
            ]),
            React.createElement('div', {
              key: 'contact-items',
              style: { display: 'flex', flexDirection: 'column', gap: '0.75rem' }
            }, [
              React.createElement('a', {
                key: 'phone',
                href: `tel:${ConfigManager.restaurant?.contact?.phone}`,
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  textDecoration: 'none',
                  color: 'var(--text-primary)',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  transition: 'background-color 0.2s'
                }
              }, [
                React.createElement('i', { 
                  key: 'icon',
                  className: 'fas fa-phone',
                  style: { color: 'var(--primary-color)', width: '16px' }
                }),
                React.createElement('span', {
                  key: 'text',
                  style: { fontSize: '0.9rem' }
                }, ConfigManager.restaurant?.contact?.phone)
              ]),
              React.createElement('a', {
                key: 'email',
                href: `mailto:${ConfigManager.restaurant?.contact?.email}`,
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  textDecoration: 'none',
                  color: 'var(--text-primary)',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  transition: 'background-color 0.2s'
                }
              }, [
                React.createElement('i', { 
                  key: 'icon',
                  className: 'fas fa-envelope',
                  style: { color: 'var(--primary-color)', width: '16px' }
                }),
                React.createElement('span', {
                  key: 'text',
                  style: { fontSize: '0.9rem' }
                }, ConfigManager.restaurant?.contact?.email)
              ]),
              React.createElement('div', {
                key: 'address',
                style: {
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '0.5rem'
                }
              }, [
                React.createElement('i', { 
                  key: 'icon',
                  className: 'fas fa-map-marker-alt',
                  style: { color: 'var(--primary-color)', width: '16px', marginTop: '0.1rem' }
                }),
                React.createElement('span', {
                  key: 'text',
                  style: { fontSize: '0.9rem', lineHeight: '1.4' }
                }, ConfigManager.restaurant?.contact?.address)
              ])
            ])
          ]),
          
          // Values & Specialties
          React.createElement('div', {
            key: 'features',
            style: {
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem',
              margin: '1rem'
            }
          }, [
            // Values
            ConfigManager.restaurant?.values && React.createElement('div', {
              key: 'values',
              style: {
                background: 'var(--surface-color)',
                borderRadius: '12px',
                padding: '1rem',
                boxShadow: 'var(--shadow)',
                border: '1px solid var(--border-color)'
              }
            }, [
              React.createElement('h4', {
                key: 'title',
                style: {
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  marginBottom: '0.75rem',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }
              }, [
                React.createElement('i', { 
                  key: 'icon',
                  className: 'fas fa-heart',
                  style: { color: 'var(--primary-color)' }
                }),
                'Our Values'
              ]),
              React.createElement('div', {
                key: 'list',
                style: { display: 'flex', flexDirection: 'column', gap: '0.4rem' }
              }, ConfigManager.restaurant.values.map((value, index) =>
                React.createElement('div', {
                  key: index,
                  style: {
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }
                }, [
                  React.createElement('i', { 
                    key: 'bullet',
                    className: 'fas fa-check',
                    style: { color: 'var(--success-color)', fontSize: '0.7rem' }
                  }),
                  value
                ])
              ))
            ]),
            
            // Specialties
            ConfigManager.restaurant?.specialties && React.createElement('div', {
              key: 'specialties',
              style: {
                background: 'var(--surface-color)',
                borderRadius: '12px',
                padding: '1rem',
                boxShadow: 'var(--shadow)',
                border: '1px solid var(--border-color)'
              }
            }, [
              React.createElement('h4', {
                key: 'title',
                style: {
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  marginBottom: '0.75rem',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }
              }, [
                React.createElement('i', { 
                  key: 'icon',
                  className: 'fas fa-utensils',
                  style: { color: 'var(--primary-color)' }
                }),
                'Specialties'
              ]),
              React.createElement('div', {
                key: 'list',
                style: { display: 'flex', flexDirection: 'column', gap: '0.4rem' }
              }, ConfigManager.restaurant.specialties.map((specialty, index) =>
                React.createElement('div', {
                  key: index,
                  style: {
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }
                }, [
                  React.createElement('i', { 
                    key: 'bullet',
                    className: 'fas fa-star',
                    style: { color: 'var(--warning-color)', fontSize: '0.7rem' }
                  }),
                  specialty
                ])
              ))
            ])
          ])
        ]);
      
      case 'cart':
        return React.createElement('div', {
          style: {
            marginTop: 'calc(70px + env(safe-area-inset-top))'
          }
        }, React.createElement(Cart, {
          items: cartItems,
          onUpdateQuantity: handleUpdateQuantity,
          onRemoveItem: handleRemoveItem,
          onCheckout: handleCheckout
        }));
      
      default:
        return React.createElement('div', null, 'Page not found');
    }
  };
  
  return React.createElement(ThemeProvider, null,
    React.createElement('div', {
      className: 'app'
    }, [
      React.createElement(Header, { 
        key: 'header',
        onMenuToggle: handleMenuToggle,
        cartCount: cartCount,
        onCartClick: handleCartClick,
        onFavoritesClick: handleFavoritesClick
      }),
      
      React.createElement('main', {
        key: 'main',
        className: 'main-content'
      }, renderContent()),
      
      React.createElement(BottomNav, {
        key: 'nav',
        activeTab: activeTab,
        onTabChange: setActiveTab
      }),
      
      React.createElement(Sidebar, {
        key: 'sidebar',
        isOpen: showSidebar,
        onClose: handleCloseSidebar,
        onLogout: handleLogout,
        onShowSettings: handleShowSettings,
        onShowOrderHistory: handleShowOrderHistory,
        currentUser: currentUser
      }),
      
      showSettings && React.createElement(Settings, {
        key: 'settings',
        onBack: handleCloseSettings,
        currentUser: currentUser
      }),
      
      showOrderHistory && React.createElement(OrderHistory, {
        key: 'order-history',
        onBack: handleCloseOrderHistory
      }),
      
      showCheckout && React.createElement(Checkout, {
        key: 'checkout',
        cartItems: cartItems,
        onBack: handleCloseCheckout,
        onOrderComplete: () => {
          CartManager.clear(); // Clear localStorage
          setCartItems([]); // Clear React state
          setShowCheckout(false);
          setActiveTab('menu');
        }
      })
    ])
  );
};

ReactDOM.render(React.createElement(App), document.getElementById('root'));
