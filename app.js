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
  const [showAbout, setShowAbout] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [overlayPage, setOverlayPage] = useState(null);
  const [itemDetailQuantity, setItemDetailQuantity] = useState(1);
  const [checkoutTrigger, setCheckoutTrigger] = useState(0);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState(null);
  const [showPaymentError, setShowPaymentError] = useState(false);
  const [paymentErrorData, setPaymentErrorData] = useState(null);
  const [showStripePayment, setShowStripePayment] = useState(false);
  const [stripePaymentData, setStripePaymentData] = useState(null);
  
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
        const initialTheme = savedTheme || 'light'; // Default to light mode
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
    // Close other overlays first
    setShowSettings(false);
    setShowOrderHistory(false);
    setShowAbout(false);
    setShowItemDetail(false);
    
    setShowCheckout(true);
    setShowSidebar(false);
    setOverlayPage('Checkout');
  };
  
  const handleItemClick = (item) => {
    // Close other overlays first
    setShowSettings(false);
    setShowOrderHistory(false);
    setShowAbout(false);
    setShowCheckout(false);
    
    setSelectedItem(item);
    setShowItemDetail(true);
    setShowSidebar(false);
    setOverlayPage('Item Details');
    setItemDetailQuantity(1); // Reset quantity
  };
  
  const handleCloseItemDetail = () => {
    setShowItemDetail(false);
    setSelectedItem(null);
    setOverlayPage(null);
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
    // Close all overlays first
    setShowSettings(false);
    setShowOrderHistory(false);
    setShowAbout(false);
    setShowItemDetail(false);
    setShowCheckout(false);
    setShowSidebar(false);
    setOverlayPage(null);
    
    setActiveTab('cart');
  };
  
  const handleFavoritesClick = () => {
    // Close all overlays first
    setShowSettings(false);
    setShowOrderHistory(false);
    setShowAbout(false);
    setShowItemDetail(false);
    setShowCheckout(false);
    setShowSidebar(false);
    setOverlayPage(null);
    
    setActiveTab('favorites');
  };
  
  const handleProfileEditToggle = () => {
    setIsProfileEditing(!isProfileEditing);
  };
  
  const handleTabChange = (tab) => {
    // Close all overlays first
    setShowSettings(false);
    setShowOrderHistory(false);
    setShowAbout(false);
    setShowItemDetail(false);
    setShowCheckout(false);
    setShowSidebar(false);
    setOverlayPage(null);
    
    setActiveTab(tab);
  };
  
  const handleOverlayBack = () => {
    // Add slide-out animation
    const overlayElement = document.querySelector('[style*="slideInFromRight"]');
    if (overlayElement) {
      overlayElement.style.animation = 'slideOutToRight 0.3s ease-in';
      overlayElement.style.transform = 'translateX(100%)';
      
      setTimeout(() => {
        if (showSettings) handleCloseSettings();
        else if (showOrderHistory) handleCloseOrderHistory();
        else if (showAbout) {
          setShowAbout(false);
          setOverlayPage(null);
        }
        else if (showItemDetail) handleCloseItemDetail();
        else if (showCheckout) handleCloseCheckout();
      }, 300);
    } else {
      // Fallback without animation
      if (showSettings) handleCloseSettings();
      else if (showOrderHistory) handleCloseOrderHistory();
      else if (showAbout) {
        setShowAbout(false);
        setOverlayPage(null);
      }
      else if (showItemDetail) handleCloseItemDetail();
      else if (showCheckout) handleCloseCheckout();
    }
  };
  
  const handleMenuToggle = () => {
    setShowSidebar(!showSidebar);
  };
  
  const handleCloseSidebar = () => {
    setShowSidebar(false);
  };
  
  const handleShowSettings = () => {
    // Close other overlays first
    setShowOrderHistory(false);
    setShowAbout(false);
    setShowItemDetail(false);
    setShowCheckout(false);
    
    setShowSettings(true);
    setShowSidebar(false);
    setOverlayPage('Settings');
  };
  
  const handleCloseSettings = () => {
    setShowSettings(false);
    setOverlayPage(null);
  };
  
  const handleShowOrderHistory = () => {
    // Close other overlays first
    setShowSettings(false);
    setShowAbout(false);
    setShowItemDetail(false);
    setShowCheckout(false);
    
    setShowOrderHistory(true);
    setShowSidebar(false);
    setOverlayPage('Order History');
  };
  
  const handleShowAbout = () => {
    // Close other overlays first
    setShowSettings(false);
    setShowOrderHistory(false);
    setShowItemDetail(false);
    setShowCheckout(false);
    
    setShowAbout(true);
    setShowSidebar(false);
    setOverlayPage('About Restaurant');
  };
  
  const handleCloseOrderHistory = () => {
    setShowOrderHistory(false);
    setOverlayPage(null);
  };
  
  const handleCloseCheckout = () => {
    setShowCheckout(false);
    setOverlayPage(null);
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
      
      case 'profile':
        return React.createElement(Profile, {
          onBack: () => setActiveTab('menu'),
          currentUser: currentUser,
          isEditing: isProfileEditing,
          setIsEditing: setIsProfileEditing
        });
        
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
          onRemoveItem: handleRemoveItem
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
        onFavoritesClick: handleFavoritesClick,
        activeTab: activeTab,
        isProfileEditing: isProfileEditing,
        onProfileEditToggle: handleProfileEditToggle,
        overlayPage: overlayPage,
        onOverlayBack: handleOverlayBack
      }),
      
      React.createElement('main', {
        key: 'main',
        className: 'main-content'
      }, renderContent()),
      
      // Sticky checkout button for cart page
      activeTab === 'cart' && cartItems.length > 0 && React.createElement('div', {
        key: 'sticky-checkout',
        style: {
          position: 'fixed',
          bottom: 'calc(80px + env(safe-area-inset-bottom))',
          left: '1rem',
          right: '1rem',
          zIndex: 999,
          background: 'hsl(var(--background))',
          borderTop: '1px solid hsl(var(--border))',
          boxShadow: '0 -4px 6px -1px rgb(0 0 0 / 0.1)'
        }
      }, React.createElement('div', {
        className: 'card'
      }, [
        React.createElement('div', {
          key: 'content',
          className: 'card-content',
          style: { padding: '1rem' }
        }, [
          React.createElement('div', {
            key: 'subtotal',
            className: 'total-row'
          }, [
            React.createElement('span', { key: 'label' }, 'Subtotal'),
            React.createElement('span', { key: 'value' }, `€${cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}`)
          ]),
          
          React.createElement('div', {
            key: 'tax',
            className: 'total-row'
          }, [
            React.createElement('span', { key: 'label' }, `Tax (${((ConfigManager.app?.tax?.rate || 0.08) * 100).toFixed(0)}%)`),
            React.createElement('span', { key: 'value' }, `€${(cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) * (ConfigManager.app?.tax?.rate || 0.08)).toFixed(2)}`)
          ]),
          
          (ConfigManager.restaurant?.delivery?.fee || 0) > 0 ? React.createElement('div', {
            key: 'delivery',
            className: 'total-row'
          }, [
            React.createElement('span', { key: 'label' }, 'Delivery'),
            React.createElement('span', { key: 'value' }, `€${(ConfigManager.restaurant?.delivery?.fee || 0).toFixed(2)}`)
          ]) : null,
          
          React.createElement('div', {
            key: 'total',
            className: 'total-row'
          }, [
            React.createElement('span', { key: 'label' }, 'Total'),
            React.createElement('span', { key: 'value' }, `€${(cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) * (1 + (ConfigManager.app?.tax?.rate || 0.08)) + (ConfigManager.restaurant?.delivery?.fee || 0)).toFixed(2)}`)
          ]),
          
          React.createElement('button', {
            key: 'checkout',
            className: 'btn btn-primary btn-lg',
            style: { width: '100%', marginTop: '1rem' },
            onClick: () => {
              const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
              const tax = subtotal * (ConfigManager.app?.tax?.rate || 0.08);
              const deliveryFee = ConfigManager.restaurant?.delivery?.fee || 0;
              const total = subtotal + tax + deliveryFee;
              handleCheckout(total);
            },
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
      ])),
      
      React.createElement(BottomNav, {
        key: 'nav',
        activeTab: activeTab,
        onTabChange: handleTabChange
      }),
      
      React.createElement(Sidebar, {
        key: 'sidebar',
        isOpen: showSidebar,
        onClose: handleCloseSidebar,
        onLogout: handleLogout,
        onShowSettings: handleShowSettings,
        onShowOrderHistory: handleShowOrderHistory,
        onShowAbout: handleShowAbout,
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
      
      showItemDetail && React.createElement('div', {
        key: 'item-detail-overlay',
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
          paddingBottom: '100px',
          transform: 'translateX(0)',
          transition: 'transform 0.3s ease-out',
          animation: 'slideInFromRight 0.3s ease-out'
        }
      }, [
        React.createElement(ItemDetail, {
          key: 'item-detail',
          item: selectedItem,
          onBack: handleCloseItemDetail,
          onAddToCart: handleAddToCart
        })
      ]),
      
      showCheckout && React.createElement('div', {
        key: 'checkout-overlay',
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
          paddingBottom: '100px',
          transform: 'translateX(0)',
          transition: 'transform 0.3s ease-out',
          animation: 'slideInFromRight 0.3s ease-out'
        }
      }, [
        React.createElement(Checkout, {
          key: 'checkout',
          cartItems: cartItems,
          onBack: handleCloseCheckout,
          onOrderComplete: (orderId) => {
            // This will be handled by OrderSuccess onClose now
          },
          hideBottomButton: true, // Tell checkout to hide its bottom button
          checkoutTrigger: checkoutTrigger, // Pass trigger to component
          onShowOrderHistory: () => {
            setShowOrderHistory(true);
            setOverlayPage('Order History');
          },
          onSetLoading: setCheckoutLoading, // Pass loading state setter
          onSetError: setCheckoutError, // Pass error state setter
          onShowOrderSuccess: (orderData) => {
            setOrderSuccessData(orderData);
            setShowOrderSuccess(true);
          },
          onShowStripePayment: (orderData) => {
            setStripePaymentData(orderData);
            setShowStripePayment(true);
          }
        })
      ]),
      
      showAbout && React.createElement('div', {
        key: 'about-overlay',
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
        React.createElement('div', {
          key: 'content'
        }, [
          // Hero section with logo
          React.createElement('div', {
            key: 'hero',
            style: {
              background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
              color: 'white',
              padding: '1.5rem 1rem',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }
          }, [
            // Logo
            React.createElement('img', {
              key: 'logo',
              src: 'Alkahir_logo.png',
              alt: ConfigManager.restaurant?.name,
              style: {
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginBottom: '0.75rem',
                border: '3px solid rgba(255,255,255,0.3)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
              },
              onError: (e) => {
                e.target.style.display = 'none';
              }
            }),
            
            React.createElement('h1', {
              key: 'name',
              style: {
                fontSize: '1.4rem',
                fontWeight: '800',
                marginBottom: '0.25rem',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }
            }, ConfigManager.restaurant?.name || 'Al Khair Restaurant'),
            
            React.createElement('p', {
              key: 'cuisine',
              style: {
                fontSize: '0.9rem',
                opacity: 0.9,
                marginBottom: '0.5rem',
                fontWeight: '500'
              }
            }, `${ConfigManager.restaurant?.cuisine || 'Halal'} Cuisine • Est. ${ConfigManager.restaurant?.established || '1990'}`),
            
            React.createElement('p', {
              key: 'description',
              style: {
                fontSize: '0.8rem',
                opacity: 0.85,
                lineHeight: '1.4',
                maxWidth: '400px',
                margin: '0 auto'
              }
            }, ConfigManager.restaurant?.description)
          ]),
          
          // Delivery info (moved to top)
          ConfigManager.restaurant?.delivery && React.createElement('div', {
            key: 'delivery',
            style: {
              background: 'var(--surface-color)',
              margin: '0.75rem',
              borderRadius: '12px',
              padding: '1rem 0.75rem',
              boxShadow: 'var(--shadow)'
            }
          }, [
            React.createElement('h2', {
              key: 'title',
              style: {
                fontSize: '1.1rem',
                fontWeight: '700',
                marginBottom: '0.75rem',
                color: 'var(--text-primary)',
                textAlign: 'center'
              }
            }, 'Delivery Information'),
            
            React.createElement('div', {
              key: 'info',
              style: {
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem'
              }
            }, [
              React.createElement('div', {
                key: 'time',
                style: {
                  textAlign: 'center'
                }
              }, [
                React.createElement('i', {
                  key: 'icon',
                  className: 'fas fa-clock',
                  style: { 
                    fontSize: '1.2rem', 
                    marginBottom: '0.25rem',
                    color: 'var(--primary-color)'
                  }
                }),
                React.createElement('div', {
                  key: 'value',
                  style: { 
                    fontSize: '0.85rem', 
                    fontWeight: '700',
                    color: 'var(--text-primary)'
                  }
                }, ConfigManager.restaurant.delivery.estimatedTime),
                React.createElement('div', {
                  key: 'label',
                  style: { 
                    fontSize: '0.7rem',
                    color: 'var(--text-secondary)'
                  }
                }, 'Delivery Time')
              ]),
              
              React.createElement('div', {
                key: 'fee',
                style: {
                  textAlign: 'center'
                }
              }, [
                React.createElement('i', {
                  key: 'icon',
                  className: 'fas fa-truck',
                  style: { 
                    fontSize: '1.2rem', 
                    marginBottom: '0.25rem',
                    color: 'var(--primary-color)'
                  }
                }),
                React.createElement('div', {
                  key: 'value',
                  style: { 
                    fontSize: '0.85rem', 
                    fontWeight: '700',
                    color: 'var(--text-primary)'
                  }
                }, `€${ConfigManager.restaurant.delivery.fee}`),
                React.createElement('div', {
                  key: 'label',
                  style: { 
                    fontSize: '0.7rem',
                    color: 'var(--text-secondary)'
                  }
                }, 'Delivery Fee')
              ]),
              
              React.createElement('div', {
                key: 'free',
                style: {
                  textAlign: 'center'
                }
              }, [
                React.createElement('i', {
                  key: 'icon',
                  className: 'fas fa-gift',
                  style: { 
                    fontSize: '1.2rem', 
                    marginBottom: '0.25rem',
                    color: 'var(--accent-color)'
                  }
                }),
                React.createElement('div', {
                  key: 'value',
                  style: { 
                    fontSize: '0.85rem', 
                    fontWeight: '700',
                    color: 'var(--text-primary)'
                  }
                }, `€${ConfigManager.restaurant.delivery.freeDeliveryMinimum}+`),
                React.createElement('div', {
                  key: 'label',
                  style: { 
                    fontSize: '0.7rem',
                    color: 'var(--text-secondary)'
                  }
                }, 'Free Delivery')
              ])
            ])
          ]),
          
          // Specialties section
          ConfigManager.restaurant?.specialties && React.createElement('div', {
            key: 'specialties',
            style: {
              padding: '1rem 0.75rem',
              background: 'var(--surface-color)',
              margin: '0.75rem',
              borderRadius: '12px',
              boxShadow: 'var(--shadow)'
            }
          }, [
            React.createElement('h2', {
              key: 'title',
              style: {
                fontSize: '1.1rem',
                fontWeight: '700',
                marginBottom: '0.75rem',
                color: 'var(--text-primary)',
                textAlign: 'center'
              }
            }, 'Our Specialties'),
            
            React.createElement('div', {
              key: 'grid',
              style: {
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '0.5rem'
              }
            }, ConfigManager.restaurant.specialties.map((specialty, index) =>
              React.createElement('div', {
                key: index,
                style: {
                  background: 'var(--background-color)',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  textAlign: 'center',
                  border: '1px solid var(--border-color)'
                }
              }, [
                React.createElement('i', {
                  key: 'icon',
                  className: 'fas fa-star',
                  style: {
                    color: 'var(--accent-color)',
                    fontSize: '1rem',
                    marginBottom: '0.5rem'
                  }
                }),
                React.createElement('h3', {
                  key: 'text',
                  style: {
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    lineHeight: '1.3'
                  }
                }, specialty)
              ])
            ))
          ]),
          
          // Values section
          ConfigManager.restaurant?.values && React.createElement('div', {
            key: 'values',
            style: {
              padding: '1rem 0.75rem',
              background: 'var(--surface-color)',
              margin: '0.75rem',
              borderRadius: '12px',
              boxShadow: 'var(--shadow)'
            }
          }, [
            React.createElement('h2', {
              key: 'title',
              style: {
                fontSize: '1.1rem',
                fontWeight: '700',
                marginBottom: '0.75rem',
                color: 'var(--text-primary)',
                textAlign: 'center'
              }
            }, 'Our Values'),
            
            React.createElement('div', {
              key: 'list',
              style: {
                display: 'grid',
                gap: '0.5rem'
              }
            }, ConfigManager.restaurant.values.map((value, index) =>
              React.createElement('div', {
                key: index,
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  background: 'var(--background-color)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)'
                }
              }, [
                React.createElement('div', {
                  key: 'icon',
                  style: {
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.9rem'
                  }
                }, React.createElement('i', { className: 'fas fa-check' })),
                React.createElement('span', {
                  key: 'text',
                  style: {
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: 'var(--text-primary)'
                  }
                }, value)
              ])
            ))
          ]),
          
          // Contact Information
          React.createElement('div', {
            key: 'contact',
            style: {
              background: 'var(--surface-color)',
              margin: '0.75rem',
              borderRadius: '12px',
              padding: '1rem 0.75rem',
              boxShadow: 'var(--shadow)'
            }
          }, [
            React.createElement('h2', {
              key: 'title',
              style: {
                fontSize: '1.1rem',
                fontWeight: '700',
                marginBottom: '0.75rem',
                color: 'var(--text-primary)',
                textAlign: 'center'
              }
            }, 'Contact Us'),
            
            React.createElement('div', {
              key: 'info',
              style: {
                display: 'grid',
                gap: '0.5rem'
              }
            }, [
              ConfigManager.restaurant?.contact?.phone && React.createElement('div', {
                key: 'phone',
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  background: 'var(--background-color)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)'
                }
              }, [
                React.createElement('div', {
                  key: 'icon',
                  style: {
                    width: '35px',
                    height: '35px',
                    borderRadius: '50%',
                    background: 'var(--primary-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.9rem'
                  }
                }, React.createElement('i', { className: 'fas fa-phone' })),
                React.createElement('div', {
                  key: 'text'
                }, [
                  React.createElement('div', {
                    key: 'label',
                    style: {
                      fontSize: '0.7rem',
                      color: 'var(--text-secondary)',
                      marginBottom: '0.1rem'
                    }
                  }, 'Phone'),
                  React.createElement('div', {
                    key: 'value',
                    style: {
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: 'var(--text-primary)'
                    }
                  }, ConfigManager.restaurant.contact.phone)
                ])
              ]),
              
              ConfigManager.restaurant?.contact?.email && React.createElement('div', {
                key: 'email',
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  background: 'var(--background-color)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)'
                }
              }, [
                React.createElement('div', {
                  key: 'icon',
                  style: {
                    width: '35px',
                    height: '35px',
                    borderRadius: '50%',
                    background: 'var(--accent-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.9rem'
                  }
                }, React.createElement('i', { className: 'fas fa-envelope' })),
                React.createElement('div', {
                  key: 'text'
                }, [
                  React.createElement('div', {
                    key: 'label',
                    style: {
                      fontSize: '0.7rem',
                      color: 'var(--text-secondary)',
                      marginBottom: '0.1rem'
                    }
                  }, 'Email'),
                  React.createElement('div', {
                    key: 'value',
                    style: {
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: 'var(--text-primary)'
                    }
                  }, ConfigManager.restaurant.contact.email)
                ])
              ]),
              
              ConfigManager.restaurant?.contact?.address && React.createElement('div', {
                key: 'address',
                style: {
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  background: 'var(--background-color)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)'
                }
              }, [
                React.createElement('div', {
                  key: 'icon',
                  style: {
                    width: '35px',
                    height: '35px',
                    borderRadius: '50%',
                    background: 'var(--primary-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    marginTop: '0.1rem',
                    fontSize: '0.9rem'
                  }
                }, React.createElement('i', { className: 'fas fa-map-marker-alt' })),
                React.createElement('div', {
                  key: 'text'
                }, [
                  React.createElement('div', {
                    key: 'label',
                    style: {
                      fontSize: '0.7rem',
                      color: 'var(--text-secondary)',
                      marginBottom: '0.1rem'
                    }
                  }, 'Address'),
                  React.createElement('div', {
                    key: 'value',
                    style: {
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      lineHeight: '1.3'
                    }
                  }, ConfigManager.restaurant.contact.address)
                ])
              ])
            ])
          ]),
          
          // Bottom padding for better scrolling
          React.createElement('div', {
            key: 'bottom-padding',
            style: {
              height: '4rem'
            }
          })
        ])
      ]),
      
      // Stripe Payment Form (at main app level - highest priority)
      showStripePayment && stripePaymentData && React.createElement(StripePaymentForm, {
        key: 'stripe-payment',
        orderData: stripePaymentData,
        onSuccess: async (paymentResult) => {
          console.log('📥 Main app received onSuccess:', paymentResult);
          try {
            console.log('🔄 Saving order to database...');
            // Save order to database
            const orderId = await StripeManager.saveOrderToDatabase(stripePaymentData, paymentResult.id);
            console.log('✅ Order saved with ID:', orderId);
            
            const completedOrderData = {
              orderId: orderId,
              total: stripePaymentData.total
            };
            
            console.log('🔄 Updating app state...');
            setShowStripePayment(false);
            setStripePaymentData(null);
            setCheckoutLoading(false);
            
            // Show order success
            console.log('🔄 Showing order success with data:', completedOrderData);
            setOrderSuccessData(completedOrderData);
            setShowOrderSuccess(true);
            console.log('✅ Order success state updated');
          } catch (error) {
            console.error('❌ Failed to save order:', error);
            setShowStripePayment(false);
            setStripePaymentData(null);
            setCheckoutLoading(false);
            setCheckoutError('Order processing failed. Please try again.');
          }
        },
        onError: (error) => {
          console.error('Payment failed:', error);
          setShowStripePayment(false);
          setStripePaymentData(null);
          setCheckoutLoading(false);
          
          // Show payment error screen
          setPaymentErrorData({
            message: error.message,
            originalOrderData: stripePaymentData
          });
          setShowPaymentError(true);
        },
        onCancel: () => {
          setShowStripePayment(false);
          setStripePaymentData(null);
          setCheckoutLoading(false);
        }
      }),
      
      // Payment Error Screen (at main app level - highest priority)
      showPaymentError && paymentErrorData && React.createElement(PaymentError, {
        key: 'payment-error',
        errorMessage: paymentErrorData.message,
        onRetry: () => {
          // Retry payment with same order data
          setShowPaymentError(false);
          setPaymentErrorData(null);
          setCheckoutLoading(true); // Keep loading state for retry
          setStripePaymentData(paymentErrorData.originalOrderData);
          setShowStripePayment(true);
        },
        onClose: () => {
          // Close error and return to checkout
          setShowPaymentError(false);
          setPaymentErrorData(null);
          setCheckoutLoading(false); // Reset loading state
        }
      }),
      
      // Order Success Animation (at main app level - highest priority)
      showOrderSuccess && orderSuccessData && React.createElement(OrderSuccess, {
        key: 'order-success',
        orderId: orderSuccessData.orderId,
        total: orderSuccessData.total,
        onClose: () => {
          setShowOrderSuccess(false);
          setOrderSuccessData(null);
          // Complete the order flow
          CartManager.clear();
          setCartItems([]);
          setCheckoutLoading(false);
          setShowCheckout(false);
          setOverlayPage(null);
          setActiveTab('cart'); // Go to cart page (empty)
          // Show order history after 10 seconds
          setTimeout(() => {
            setShowOrderHistory(true);
            setOverlayPage('Order History');
          }, 10000);
        },
        onShowOrderHistory: () => {
          setShowOrderHistory(true);
          setOverlayPage('Order History');
        }
      }),
      
      // Checkout Bottom Controls (at main app level)
      showCheckout && React.createElement('div', {
        key: 'checkout-bottom-controls',
        style: {
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'var(--surface-color)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          zIndex: 1002,
          boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
          paddingBottom: 'max(env(safe-area-inset-bottom), 2.5rem)',
          paddingTop: '0.75rem',
          paddingLeft: '1rem',
          paddingRight: '1rem'
        }
      }, [
        React.createElement('div', {
          key: 'checkout-controls',
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            width: '100%'
          }
        }, [
          React.createElement('div', {
            key: 'total-display',
            style: {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start'
            }
          }, [
            React.createElement('span', {
              key: 'label',
              style: {
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                fontWeight: '500'
              }
            }, 'Total'),
            React.createElement('span', {
              key: 'amount',
              style: {
                fontSize: '1.25rem',
                fontWeight: '700',
                color: 'var(--text-primary)'
              }
            }, `€${CartManager.getTotal().toFixed(2)}`)
          ]),
          
          React.createElement('button', {
            key: 'place-order-btn',
            onClick: () => {
              setCheckoutTrigger(prev => prev + 1); // Trigger checkout validation
            },
            disabled: cartItems.length === 0 || checkoutLoading,
            style: {
              background: (cartItems.length === 0 || checkoutLoading)
                ? 'var(--border-color)' 
                : 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
              color: (cartItems.length === 0 || checkoutLoading) ? 'var(--text-secondary)' : 'white',
              border: 'none',
              padding: '0.875rem 2rem',
              borderRadius: '25px',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: (cartItems.length === 0 || checkoutLoading) ? 'not-allowed' : 'pointer',
              flex: 1,
              maxWidth: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              minHeight: '50px'
            }
          }, [
            React.createElement('i', { 
              key: 'icon',
              className: checkoutLoading ? 'fas fa-spinner fa-spin' : 'fas fa-credit-card'
            }),
            React.createElement('span', {
              key: 'text'
            }, checkoutLoading ? 'Processing...' : 'Place Order')
          ])
        ])
      ]),
      
      // Item Detail Bottom Controls (at main app level)
      showItemDetail && React.createElement('div', {
        key: 'item-detail-bottom-controls',
        style: {
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'var(--surface-color)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          zIndex: 1002,
          boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
          paddingBottom: 'max(env(safe-area-inset-bottom), 2.5rem)',
          paddingTop: '0.75rem',
          paddingLeft: '1rem',
          paddingRight: '1rem'
        }
      }, [
        React.createElement('div', {
          key: 'controls',
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            width: '100%'
          }
        }, [
          React.createElement('div', {
            key: 'quantity-controls',
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'var(--border-color)',
              borderRadius: '20px',
              padding: '0.25rem'
            }
          }, [
            React.createElement('button', {
              key: 'decrease',
              onClick: () => {
                setItemDetailQuantity(Math.max(1, itemDetailQuantity - 1));
              },
              style: {
                background: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem'
              }
            }, React.createElement('i', { className: 'fas fa-minus' })),
            
            React.createElement('span', {
              key: 'display',
              style: {
                fontWeight: '600',
                minWidth: '2rem',
                textAlign: 'center',
                fontSize: '1rem',
                color: 'var(--text-primary)'
              }
            }, itemDetailQuantity),
            
            React.createElement('button', {
              key: 'increase',
              onClick: () => {
                setItemDetailQuantity(itemDetailQuantity + 1);
              },
              style: {
                background: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem'
              }
            }, React.createElement('i', { className: 'fas fa-plus' }))
          ]),
          
          React.createElement('button', {
            key: 'add-btn',
            onClick: () => {
              // Add multiple items based on quantity
              for (let i = 0; i < itemDetailQuantity; i++) {
                handleAddToCart(selectedItem);
              }
              setItemDetailQuantity(1); // Reset quantity after adding
            },
            style: {
              background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
              color: 'white',
              border: 'none',
              padding: '0.875rem 1.5rem',
              borderRadius: '25px',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: 'pointer',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              minHeight: '50px'
            }
          }, [
            React.createElement('i', { 
              key: 'icon',
              className: 'fas fa-shopping-cart' 
            }),
            React.createElement('span', {
              key: 'text'
            }, `Add ${itemDetailQuantity} - €${((selectedItem?.price || 0) * itemDetailQuantity).toFixed(2)}`)
          ])
        ])
      ]),
      
    ])
  );
};

ReactDOM.render(React.createElement(App), document.getElementById('root'));
