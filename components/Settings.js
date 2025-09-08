const Settings = ({ onBack, currentUser }) => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');
  const [appVersion, setAppVersion] = useState('Loading...');
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setDarkMode(currentTheme === 'dark');
    
    const notifPref = localStorage.getItem('reztau-notifications');
    setNotifications(notifPref !== 'false');
    
    // Get app version and check for updates
    getAppVersion();
    checkForUpdates();
  }, []);
  
  const getAppVersion = async () => {
    try {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        const caches = await window.caches.keys();
        const reztauCache = caches.find(cache => cache.startsWith('reztau-v'));
        if (reztauCache) {
          const version = reztauCache.replace('reztau-v', '');
          setAppVersion(version);
        } else {
          setAppVersion('1.0.1');
        }
      } else {
        setAppVersion('1.0.1');
      }
    } catch (error) {
      console.error('Error getting app version:', error);
      setAppVersion('1.0.1');
    }
  };
  
  const checkForUpdates = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setUpdateAvailable(true);
      });
      
      navigator.serviceWorker.getRegistration().then(registration => {
        if (registration && registration.waiting) {
          setUpdateAvailable(true);
        }
      });
    }
  };
  
  const installUpdate = async () => {
    if (!('serviceWorker' in navigator)) return;
    
    setIsUpdating(true);
    
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error('Error installing update:', error);
      setIsUpdating(false);
    }
  };
  
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
          ['Version', `v${appVersion}`, 'fas fa-tag'],
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
      ]),
      
      // Update notification
      updateAvailable && React.createElement('div', {
        key: 'update-notification',
        style: {
          background: 'linear-gradient(135deg, var(--accent-color), var(--primary-color))',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1rem',
          color: 'white',
          textAlign: 'center'
        }
      }, [
        React.createElement('i', {
          key: 'icon',
          className: 'fas fa-download',
          style: {
            fontSize: '2rem',
            marginBottom: '0.5rem',
            opacity: 0.9
          }
        }),
        React.createElement('h3', {
          key: 'title',
          style: {
            fontSize: '1rem',
            fontWeight: '700',
            marginBottom: '0.5rem'
          }
        }, 'Update Available!'),
        React.createElement('p', {
          key: 'desc',
          style: {
            fontSize: '0.85rem',
            marginBottom: '1rem',
            opacity: 0.9
          }
        }, 'A new version of the app is ready to install'),
        React.createElement('button', {
          key: 'install-btn',
          onClick: installUpdate,
          disabled: isUpdating,
          style: {
            padding: '0.75rem 2rem',
            background: 'rgba(255, 255, 255, 0.9)',
            color: 'var(--primary-color)',
            border: 'none',
            borderRadius: '25px',
            fontSize: '0.9rem',
            fontWeight: '700',
            cursor: isUpdating ? 'not-allowed' : 'pointer',
            opacity: isUpdating ? 0.7 : 1
          }
        }, isUpdating ? 'Installing Update...' : 'Install Now')
      ])
    ])
  ]);
};
