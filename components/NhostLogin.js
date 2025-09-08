const NhostLogin = ({ onLogin }) => {
  const [step, setStep] = useState('signin'); // 'signin' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await NhostManager.signIn(email, password);
      
      console.log('Raw signin result:', result);
      console.log('Current user after signin:', NhostManager.getCurrentUser());
      
      if (result.success) {
        console.log('✅ User signed in:', result.user);
        onLogin();
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      setError('Login failed: ' + error.message);
    }
    
    setLoading(false);
  };
  
  const handleSignUp = async () => {
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await NhostManager.signUp(email, password);
      
      console.log('Raw signup result:', result);
      console.log('Current user after signup:', NhostManager.getCurrentUser());
      
      if (result.success) {
        console.log('✅ User created and signed in:', result.user);
        onLogin();
      } else {
        setError(result.error || 'Signup failed');
      }
    } catch (error) {
      setError('Signup failed: ' + error.message);
    }
    
    setLoading(false);
  };
  
  const handleSubmit = () => {
    if (step === 'signin') {
      handleSignIn();
    } else {
      handleSignUp();
    }
  };
  
  return React.createElement('div', {
    style: {
      minHeight: '100vh',
      background: 'var(--background-color)',
      display: 'flex',
      flexDirection: 'column',
      paddingTop: 'env(safe-area-inset-top)'
    }
  }, [
    // Compact header
    React.createElement('div', {
      key: 'header',
      style: {
        padding: '2rem 1.5rem 1rem',
        textAlign: 'center'
      }
    }, [
      React.createElement('div', {
        key: 'logo-container',
        style: {
          width: '80px',
          height: '80px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
        }
      }, [
        React.createElement('img', {
          key: 'logo',
          src: 'Alkahir_logo.png',
          alt: 'Al Khair',
          style: {
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            objectFit: 'cover'
          },
          onError: (e) => {
            e.target.style.display = 'none';
          }
        })
      ]),
      
      React.createElement('h1', {
        key: 'title',
        style: {
          fontSize: '1.5rem',
          fontWeight: '700',
          color: 'var(--text-primary)',
          marginBottom: '0.25rem'
        }
      }, 'Al Khair Restaurant'),
      
      React.createElement('p', {
        key: 'subtitle',
        style: {
          fontSize: '0.9rem',
          color: 'var(--text-secondary)',
          fontWeight: '400'
        }
      }, 'Authentic Pakistani Cuisine')
    ]),
    
    // Form section - positioned higher
    React.createElement('div', {
      key: 'form-section',
      style: {
        background: 'var(--surface-color)',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        padding: '1.5rem',
        flex: 1,
        boxShadow: '0 -5px 20px rgba(0,0,0,0.1)'
      }
    }, [
      // Compact tab switcher
      React.createElement('div', {
        key: 'tabs',
        style: {
          display: 'flex',
          background: 'var(--border-color)',
          borderRadius: '10px',
          padding: '3px',
          marginBottom: '1.5rem'
        }
      }, [
        React.createElement('button', {
          key: 'signin-tab',
          onClick: () => {
            setStep('signin');
            setError('');
          },
          style: {
            flex: 1,
            padding: '10px',
            background: step === 'signin' ? 'var(--surface-color)' : 'transparent',
            color: step === 'signin' ? 'var(--text-primary)' : 'var(--text-secondary)',
            border: 'none',
            borderRadius: '7px',
            fontSize: '0.95rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: step === 'signin' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none'
          }
        }, 'Sign In'),
        
        React.createElement('button', {
          key: 'signup-tab',
          onClick: () => {
            setStep('signup');
            setError('');
          },
          style: {
            flex: 1,
            padding: '10px',
            background: step === 'signup' ? 'var(--surface-color)' : 'transparent',
            color: step === 'signup' ? 'var(--text-primary)' : 'var(--text-secondary)',
            border: 'none',
            borderRadius: '7px',
            fontSize: '0.95rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: step === 'signup' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none'
          }
        }, 'Sign Up')
      ]),
      
      // Email input
      React.createElement('div', {
        key: 'email-group',
        style: { marginBottom: '1rem' }
      }, [
        React.createElement('div', {
          key: 'email-container',
          style: {
            background: 'var(--background-color)',
            borderRadius: '12px',
            border: '1px solid var(--border-color)'
          }
        }, [
          React.createElement('input', {
            key: 'email-input',
            type: 'email',
            value: email,
            onChange: (e) => setEmail(e.target.value),
            placeholder: 'Email address',
            style: {
              width: '100%',
              padding: '14px 16px',
              background: 'transparent',
              border: 'none',
              fontSize: '1rem',
              color: 'var(--text-primary)',
              outline: 'none',
              boxSizing: 'border-box'
            },
            onKeyPress: (e) => e.key === 'Enter' && handleSubmit()
          })
        ])
      ]),
      
      // Password input
      React.createElement('div', {
        key: 'password-group',
        style: { marginBottom: '1.5rem' }
      }, [
        React.createElement('div', {
          key: 'password-container',
          style: {
            background: 'var(--background-color)',
            borderRadius: '12px',
            border: '1px solid var(--border-color)'
          }
        }, [
          React.createElement('input', {
            key: 'password-input',
            type: 'password',
            value: password,
            onChange: (e) => setPassword(e.target.value),
            placeholder: step === 'signup' ? 'Password (6+ chars)' : 'Password',
            style: {
              width: '100%',
              padding: '14px 16px',
              background: 'transparent',
              border: 'none',
              fontSize: '1rem',
              color: 'var(--text-primary)',
              outline: 'none',
              boxSizing: 'border-box'
            },
            onKeyPress: (e) => e.key === 'Enter' && handleSubmit()
          })
        ])
      ]),
      
      // Error message
      error && React.createElement('div', {
        key: 'error',
        style: {
          color: 'var(--error-color)',
          fontSize: '0.85rem',
          marginBottom: '1rem',
          textAlign: 'center',
          padding: '0.75rem',
          background: 'rgba(239, 68, 68, 0.1)',
          borderRadius: '10px',
          border: '1px solid rgba(239, 68, 68, 0.2)'
        }
      }, error),
      
      // Submit button
      React.createElement('button', {
        key: 'submit-btn',
        onClick: handleSubmit,
        disabled: loading,
        style: {
          width: '100%',
          padding: '14px',
          background: loading ? 'var(--border-color)' : 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: loading ? 'none' : '0 4px 12px rgba(0,0,0,0.15)',
          transition: 'all 0.2s'
        }
      }, loading ? 'Please wait...' : (step === 'signin' ? 'Sign In' : 'Create Account'))
    ])
  ]);
};
