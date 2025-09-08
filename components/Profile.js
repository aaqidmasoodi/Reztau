const Profile = ({ onBack, currentUser, isEditing, setIsEditing }) => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    phone: '',
    address: '',
    avatarUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      // Load from localStorage
      const savedProfile = localStorage.getItem('reztau-user-profile');
      let profileData = {
        name: '',
        phone: '',
        address: '',
        avatarUrl: ''
      };
      
      if (savedProfile) {
        const saved = JSON.parse(savedProfile);
        profileData = {
          name: saved.name || '',
          phone: saved.phone || '',
          address: saved.address || '',
          avatarUrl: saved.avatarUrl || ''
        };
      }
      
      // Add avatar from Nhost if available
      if (currentUser?.avatarUrl) {
        profileData.avatarUrl = currentUser.avatarUrl;
      }
      
      setUserInfo(profileData);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate required fields
      if (!userInfo.name.trim()) {
        throw new Error('Name is required');
      }

      // Save to localStorage
      localStorage.setItem('reztau-user-profile', JSON.stringify(userInfo));
      
      // TODO: Save to database via Nhost
      // await NhostManager.updateUserProfile(userInfo);
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return React.createElement('div', {
    style: {
      minHeight: '100vh',
      background: 'var(--background-color)',
      paddingTop: 'calc(70px + env(safe-area-inset-top))',
      paddingBottom: '2rem'
    }
  }, [
    // Content
    React.createElement('div', {
      key: 'content',
      style: {
        padding: '1rem',
        maxWidth: '600px',
        margin: '0 auto'
      }
    }, [
      // Success/Error messages
      success && React.createElement('div', {
        key: 'success',
        style: {
          background: 'var(--success-color)',
          color: 'white',
          padding: '0.75rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          textAlign: 'center'
        }
      }, success),
      
      error && React.createElement('div', {
        key: 'error',
        style: {
          background: 'var(--error-color)',
          color: 'white',
          padding: '0.75rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          textAlign: 'center'
        }
      }, error),

      // Profile Avatar
      React.createElement('div', {
        key: 'avatar-section',
        style: {
          textAlign: 'center',
          marginBottom: '1.5rem'
        }
      }, [
        userInfo.avatarUrl ? React.createElement('img', {
          key: 'avatar-img',
          src: userInfo.avatarUrl,
          alt: userInfo.name || 'User',
          style: {
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            objectFit: 'cover',
            margin: '0 auto',
            border: '2px solid var(--primary-color)'
          },
          onError: (e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }
        }) : null,
        
        React.createElement('div', {
          key: 'avatar-fallback',
          style: {
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
            display: userInfo.avatarUrl ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: '700'
          }
        }, userInfo.name ? userInfo.name.charAt(0).toUpperCase() : 'U')
      ]),

      // Personal Information
      React.createElement('div', {
        key: 'personal-info',
        style: {
          background: 'var(--surface-color)',
          borderRadius: '12px',
          padding: '1.25rem',
          marginBottom: '1rem',
          border: '1px solid var(--border-color)'
        }
      }, [
        // Name field
        React.createElement('div', {
          key: 'name-field',
          style: { marginBottom: '1rem' }
        }, [
          React.createElement('label', {
            key: 'label',
            style: {
              display: 'block',
              marginBottom: '0.4rem',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: 'var(--text-primary)'
            }
          }, 'Full Name *'),
          React.createElement('input', {
            key: 'input',
            type: 'text',
            value: userInfo.name,
            onChange: (e) => handleInputChange('name', e.target.value),
            disabled: !isEditing,
            placeholder: 'Enter your full name',
            style: {
              width: '100%',
              padding: '0.65rem',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              fontSize: '0.95rem',
              background: isEditing ? 'var(--background-color)' : 'var(--surface-color)',
              color: 'var(--text-primary)',
              outline: 'none',
              boxSizing: 'border-box'
            }
          })
        ]),
        
        // Phone field
        React.createElement('div', {
          key: 'phone-field',
          style: { marginBottom: '1rem' }
        }, [
          React.createElement('label', {
            key: 'label',
            style: {
              display: 'block',
              marginBottom: '0.4rem',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: 'var(--text-primary)'
            }
          }, 'Phone Number'),
          React.createElement('input', {
            key: 'input',
            type: 'tel',
            value: userInfo.phone,
            onChange: (e) => handleInputChange('phone', e.target.value),
            disabled: !isEditing,
            placeholder: '+353 1 234 5678',
            style: {
              width: '100%',
              padding: '0.65rem',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              fontSize: '0.95rem',
              background: isEditing ? 'var(--background-color)' : 'var(--surface-color)',
              color: 'var(--text-primary)',
              outline: 'none',
              boxSizing: 'border-box'
            }
          })
        ]),
        
        // Address field
        React.createElement('div', {
          key: 'address-field'
        }, [
          React.createElement('label', {
            key: 'label',
            style: {
              display: 'block',
              marginBottom: '0.4rem',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: 'var(--text-primary)'
            }
          }, 'Address'),
          React.createElement('textarea', {
            key: 'input',
            value: userInfo.address,
            onChange: (e) => handleInputChange('address', e.target.value),
            disabled: !isEditing,
            placeholder: 'Enter your delivery address',
            rows: 2,
            style: {
              width: '100%',
              padding: '0.65rem',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              fontSize: '0.95rem',
              background: isEditing ? 'var(--background-color)' : 'var(--surface-color)',
              color: 'var(--text-primary)',
              outline: 'none',
              boxSizing: 'border-box',
              resize: 'vertical',
              fontFamily: 'inherit'
            }
          })
        ])
      ]),

      // Save button
      isEditing && React.createElement('button', {
        key: 'save-btn',
        onClick: handleSave,
        disabled: loading,
        style: {
          width: '100%',
          padding: '0.85rem',
          background: loading ? 'var(--border-color)' : 'var(--primary-color)',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          fontSize: '0.95rem',
          fontWeight: '700',
          cursor: loading ? 'not-allowed' : 'pointer'
        }
      }, loading ? 'Saving...' : 'Save Changes')
    ])
  ]);
};
