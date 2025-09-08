const Settings = ({ onBack, currentUser }) => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');
  
  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setDarkMode(currentTheme === 'dark');
    
    const notifPref = localStorage.getItem('reztau-notifications');
    setNotifications(notifPref !== 'false');
  }, []);
  
  const handleThemeToggle = () => {
    const newTheme = darkMode ? 'light' : 'dark';
    setDarkMode(!darkMode);
    ConfigManager.applyTheme(newTheme);
    localStorage.setItem('reztau-theme', newTheme);
  };
  
  const handleNotificationToggle = () => {
    const newValue = !notifications;
    setNotifications(newValue);
    localStorage.setItem('reztau-notifications', newValue.toString());
  };
  
  const ToggleSwitch = ({ isOn, onToggle }) => {
    return React.createElement('button', {
      onClick: onToggle,
      style: {
        width: '44px',
        height: '24px',
        borderRadius: '12px',
        border: 'none',
        background: isOn ? 'var(--primary-color)' : '#E5E7EB',
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }
    }, React.createElement('div', {
      style: {
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        background: 'white',
        position: 'absolute',
        top: '3px',
        left: isOn ? '23px' : '3px',
        transition: 'all 0.2s ease',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
      }
    }));
  };
  
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
      title: 'Settings',
      onBack: onBack
    }),
    
    // Content
    React.createElement('div', {
      key: 'content',
      style: { padding: '0.75rem', paddingBottom: '2rem' }
    }, [
      // Account section
      React.createElement('div', {
        key: 'account',
        style: {
          background: 'var(--surface-color)',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1rem',
          boxShadow: 'var(--shadow)',
          border: '1px solid var(--border-color)'
        }
      }, [
        React.createElement('div', {
          key: 'user-card',
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }
        }, [
          React.createElement('div', {
            key: 'avatar',
            style: {
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'var(--primary-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              fontWeight: '700',
              color: 'white'
            }
          }, currentUser?.email?.charAt(0).toUpperCase() || 'U'),
          
          React.createElement('div', {
            key: 'info',
            style: { flex: 1 }
          }, [
            React.createElement('div', {
              key: 'email',
              style: {
                fontSize: '1rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '0.25rem'
              }
            }, currentUser?.email || 'User'),
            React.createElement('div', {
              key: 'status',
              style: {
                fontSize: '0.8rem',
                color: 'var(--success-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }
            }, [
              React.createElement('i', { 
                key: 'icon',
                className: 'fas fa-check-circle',
                style: { fontSize: '0.7rem' }
              }),
              'Verified'
            ])
          ])
        ])
      ]),
      
      // Preferences
      React.createElement('div', {
        key: 'preferences',
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
            fontSize: '0.9rem',
            fontWeight: '700',
            marginBottom: '1rem',
            color: 'var(--text-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }
        }, 'Preferences'),
        
        // Dark mode
        React.createElement('div', {
          key: 'dark-mode',
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 0',
            borderBottom: '1px solid var(--border-color)'
          }
        }, [
          React.createElement('div', {
            key: 'info',
            style: { display: 'flex', alignItems: 'center', gap: '0.75rem' }
          }, [
            React.createElement('div', {
              key: 'icon-bg',
              style: {
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }
            }, React.createElement('i', { 
              className: 'fas fa-moon',
              style: { color: 'var(--primary-color)', fontSize: '0.9rem' }
            })),
            React.createElement('div', {
              key: 'text'
            }, [
              React.createElement('div', {
                key: 'label',
                style: {
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)'
                }
              }, 'Dark Mode'),
              React.createElement('div', {
                key: 'desc',
                style: {
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)'
                }
              }, 'Switch app theme')
            ])
          ]),
          React.createElement(ToggleSwitch, {
            key: 'toggle',
            isOn: darkMode,
            onToggle: handleThemeToggle
          })
        ]),
        
        // Notifications
        React.createElement('div', {
          key: 'notifications',
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 0',
            borderBottom: '1px solid var(--border-color)'
          }
        }, [
          React.createElement('div', {
            key: 'info',
            style: { display: 'flex', alignItems: 'center', gap: '0.75rem' }
          }, [
            React.createElement('div', {
              key: 'icon-bg',
              style: {
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }
            }, React.createElement('i', { 
              className: 'fas fa-bell',
              style: { color: 'var(--primary-color)', fontSize: '0.9rem' }
            })),
            React.createElement('div', {
              key: 'text'
            }, [
              React.createElement('div', {
                key: 'label',
                style: {
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)'
                }
              }, 'Notifications'),
              React.createElement('div', {
                key: 'desc',
                style: {
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)'
                }
              }, 'Order updates & offers')
            ])
          ]),
          React.createElement(ToggleSwitch, {
            key: 'toggle',
            isOn: notifications,
            onToggle: handleNotificationToggle
          })
        ]),
        
        // Language
        React.createElement('div', {
          key: 'language',
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 0'
          }
        }, [
          React.createElement('div', {
            key: 'info',
            style: { display: 'flex', alignItems: 'center', gap: '0.75rem' }
          }, [
            React.createElement('div', {
              key: 'icon-bg',
              style: {
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }
            }, React.createElement('i', { 
              className: 'fas fa-globe',
              style: { color: 'var(--primary-color)', fontSize: '0.9rem' }
            })),
            React.createElement('div', {
              key: 'text'
            }, [
              React.createElement('div', {
                key: 'label',
                style: {
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)'
                }
              }, 'Language'),
              React.createElement('div', {
                key: 'desc',
                style: {
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)'
                }
              }, 'App language')
            ])
          ]),
          React.createElement('select', {
            key: 'select',
            value: language,
            onChange: (e) => setLanguage(e.target.value),
            style: {
              padding: '0.4rem 0.75rem',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              background: 'var(--background-color)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              minWidth: '90px'
            }
          }, [
            React.createElement('option', { key: 'en', value: 'English' }, 'English'),
            React.createElement('option', { key: 'ur', value: 'Urdu' }, 'اردو'),
            React.createElement('option', { key: 'ar', value: 'Arabic' }, 'العربية')
          ])
        ])
      ]),
      
      // App info
      React.createElement('div', {
        key: 'info',
        style: {
          background: 'var(--surface-color)',
          borderRadius: '12px',
          padding: '1rem',
          boxShadow: 'var(--shadow)',
          border: '1px solid var(--border-color)'
        }
      }, [
        React.createElement('h3', {
          key: 'title',
          style: {
            fontSize: '0.9rem',
            fontWeight: '700',
            marginBottom: '1rem',
            color: 'var(--text-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }
        }, 'App Information'),
        
        React.createElement('div', {
          key: 'stats',
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.75rem'
          }
        }, [
          ['Version', 'v1.0.0', 'fas fa-tag'],
          ['Build', '2024.1', 'fas fa-code-branch'],
          ['Storage', '2.4MB', 'fas fa-hdd'],
          ['Cache', '1.2MB', 'fas fa-database']
        ].map(([label, value, icon]) =>
          React.createElement('div', {
            key: label.toLowerCase(),
            style: {
              padding: '0.75rem',
              background: 'var(--border-color)',
              borderRadius: '8px',
              textAlign: 'center'
            }
          }, [
            React.createElement('i', {
              key: 'icon',
              className: icon,
              style: {
                color: 'var(--primary-color)',
                fontSize: '1rem',
                marginBottom: '0.4rem'
              }
            }),
            React.createElement('div', {
              key: 'value',
              style: {
                fontSize: '0.95rem',
                fontWeight: '700',
                color: 'var(--text-primary)',
                marginBottom: '0.2rem'
              }
            }, value),
            React.createElement('div', {
              key: 'label',
              style: {
                fontSize: '0.75rem',
                color: 'var(--text-secondary)'
              }
            }, label)
          ])
        ))
      ])
    ])
  ]);
};
