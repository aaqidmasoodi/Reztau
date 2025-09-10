const Sidebar = ({ isOpen, onClose, onLogout, onShowSettings, onShowOrderHistory, onShowAbout = () => {}, onShowDeveloperInfo = () => {}, onShowPrivacyPolicy = () => {}, onShowTermsConditions = () => {}, currentUser }) => {
  const handleNavigation = (page) => {
    if (page === 'settings') {
      onShowSettings();
    } else if (page === 'order-history') {
      onShowOrderHistory();
    } else if (page === 'about') {
      onShowAbout();
    } else if (page === 'developer') {
      onShowDeveloperInfo();
    } else if (page === 'privacy-policy') {
      onShowPrivacyPolicy();
    } else if (page === 'terms-conditions') {
      onShowTermsConditions();
    } else {
      // Handle other pages later
      onClose();
    }
  };
  
  const handleLogout = () => {
    onLogout();
    onClose();
  };
  
  return React.createElement('div', {
    style: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 2000,
      pointerEvents: isOpen ? 'auto' : 'none'
    }
  }, [
    // Backdrop
    React.createElement('div', {
      key: 'sidebar-backdrop',
      onClick: onClose,
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
        opacity: isOpen ? 1 : 0,
        transition: 'opacity 0.3s ease'
      }
    }),
    
    // Sidebar content
    React.createElement('div', {
      key: 'sidebar',
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '280px',
        height: '100vh',
        maxHeight: '100vh',
        background: 'var(--surface-color)',
        boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 'calc(env(safe-area-inset-top))',
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 2rem)',
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease',
        overflow: 'hidden'
      }
    }, [
      // Header
      React.createElement('div', {
        key: 'header',
        style: {
          padding: '2rem 1.5rem',
          background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
          color: 'white',
          textAlign: 'center'
        }
      }, currentUser ? [
        // User Avatar
        currentUser.avatarUrl ? React.createElement('img', {
          key: 'avatar',
          src: currentUser.avatarUrl,
          alt: currentUser.email,
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
            e.target.nextSibling.style.display = 'flex';
          }
        }) : null,
        
        // Fallback avatar
        React.createElement('div', {
          key: 'avatar-fallback',
          style: {
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: currentUser.avatarUrl ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            color: 'white',
            fontSize: '2rem',
            fontWeight: '700',
            border: '3px solid rgba(255,255,255,0.3)'
          }
        }, currentUser.email ? currentUser.email.charAt(0).toUpperCase() : 'U'),
        
        // Email
        React.createElement('p', {
          key: 'email',
          style: {
            fontSize: '0.85rem',
            opacity: 0.9,
            wordBreak: 'break-word'
          }
        }, currentUser.email)
      ] : [
        React.createElement('p', {
          key: 'welcome',
          style: {
            fontSize: '0.85rem',
            opacity: 0.9
          }
        }, 'Welcome!')
      ]),
      
      // Navigation
      React.createElement('div', {
        key: 'navigation',
        style: {
          flex: 1,
          padding: '1rem 0',
          overflowY: 'auto',
          minHeight: 0
        }
      }, [
        React.createElement('div', {
          key: 'nav-section',
          style: { marginBottom: '1.5rem' }
        }, [
          React.createElement('h3', {
            key: 'nav-title',
            style: {
              fontSize: '0.8rem',
              fontWeight: '600',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              padding: '0 1.5rem',
              marginBottom: '0.75rem'
            }
          }, 'App'),
          
          React.createElement('button', {
            key: 'order-history',
            onClick: () => handleNavigation('order-history'),
            style: {
              width: '100%',
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              border: 'none',
              textAlign: 'left',
              color: 'var(--text-primary)',
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'background-color 0.2s'
            }
          }, [
            React.createElement('i', { 
              key: 'icon',
              className: 'fas fa-receipt',
              style: { 
                width: '20px',
                color: 'var(--primary-color)'
              }
            }),
            'Order History'
          ]),
          
          React.createElement('button', {
            key: 'about',
            onClick: () => handleNavigation('about'),
            style: {
              width: '100%',
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              border: 'none',
              textAlign: 'left',
              color: 'var(--text-primary)',
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'background-color 0.2s'
            }
          }, [
            React.createElement('i', { 
              key: 'icon',
              className: 'fas fa-info-circle',
              style: { 
                width: '20px',
                color: 'var(--primary-color)'
              }
            }),
            'About Restaurant'
          ]),
          
          React.createElement('button', {
            key: 'settings',
            onClick: () => handleNavigation('settings'),
            style: {
              width: '100%',
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              border: 'none',
              textAlign: 'left',
              color: 'var(--text-primary)',
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'background-color 0.2s'
            }
          }, [
            React.createElement('i', { 
              key: 'icon',
              className: 'fas fa-cog',
              style: { color: 'var(--primary-color)', width: '16px' }
            }),
            'Settings'
          ])
        ]),
        
        // Legal Section
        React.createElement('div', {
          key: 'legal-section',
          style: { marginBottom: '1.5rem' }
        }, [
          React.createElement('div', {
            key: 'legal-title',
            style: {
              fontSize: '0.8rem',
              fontWeight: '600',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              padding: '0 1.5rem',
              marginBottom: '0.75rem'
            }
          }, 'Legal'),
          
          React.createElement('button', {
            key: 'privacy-policy',
            onClick: () => handleNavigation('privacy-policy'),
            style: {
              width: '100%',
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              border: 'none',
              textAlign: 'left',
              color: 'var(--text-primary)',
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'background-color 0.2s'
            }
          }, [
            React.createElement('i', { 
              key: 'icon',
              className: 'fas fa-shield-alt',
              style: { color: 'var(--primary-color)', width: '16px' }
            }),
            'Privacy Policy'
          ]),
          
          React.createElement('button', {
            key: 'terms-conditions',
            onClick: () => handleNavigation('terms-conditions'),
            style: {
              width: '100%',
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              border: 'none',
              textAlign: 'left',
              color: 'var(--text-primary)',
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'background-color 0.2s'
            }
          }, [
            React.createElement('i', { 
              key: 'icon',
              className: 'fas fa-file-contract',
              style: { color: 'var(--primary-color)', width: '16px' }
            }),
            'Terms & Conditions'
          ])
        ]),

        React.createElement('div', {
          key: 'info-section'
        }, [
          React.createElement('h3', {
            key: 'info-title',
            style: {
              fontSize: '0.8rem',
              fontWeight: '600',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              padding: '0 1.5rem',
              marginBottom: '0.75rem'
            }
          }, 'Information'),
          
          React.createElement('button', {
            key: 'developer',
            onClick: () => handleNavigation('developer'),
            style: {
              width: '100%',
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              border: 'none',
              textAlign: 'left',
              color: 'var(--text-primary)',
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'background-color 0.2s'
            }
          }, [
            React.createElement('i', { 
              key: 'icon',
              className: 'fas fa-code',
              style: { color: 'var(--primary-color)', width: '16px' }
            }),
            'Developer Info'
          ])
        ])
      ]),
      
      // Footer
      React.createElement('div', {
        key: 'footer',
        style: {
          padding: '1rem 1.5rem 2rem 1.5rem',
          borderTop: '1px solid var(--border-color)',
          marginTop: 'auto',
          flexShrink: 0
        }
      }, [
        React.createElement('button', {
          key: 'logout',
          onClick: handleLogout,
          style: {
            width: '100%',
            padding: '0.75rem',
            background: 'var(--error-color)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.95rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'opacity 0.2s'
          }
        }, [
          React.createElement('i', { 
            key: 'icon',
            className: 'fas fa-sign-out-alt'
          }),
          'Logout'
        ]),
        
        React.createElement('div', {
          key: 'version',
          style: {
            textAlign: 'center',
            marginTop: '1rem',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            paddingBottom: '1rem'
          }
        }, 'Version 1.7.3')
      ])
    ]),
    
    // Backdrop
    React.createElement('div', {
      key: 'backdrop',
      onClick: onClose,
      style: {
        flex: 1,
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.3s ease-out'
      }
    })
  ]);
};
