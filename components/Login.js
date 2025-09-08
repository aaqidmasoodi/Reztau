const Login = ({ onLogin }) => {
  const [step, setStep] = useState('email'); // 'email' or 'token'
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSendToken = () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    setError('');
    
    // Generate token
    const generatedToken = AuthManager.generateToken(email);
    
    // Console log for now (later replace with email service)
    console.log('=== EMAIL WOULD BE SENT ===');
    console.log('To:', email);
    console.log('Subject: Your Al Khair Restaurant Login Code');
    console.log('Token:', generatedToken);
    console.log('========================');
    
    setTimeout(() => {
      setLoading(false);
      setStep('token');
    }, 1000);
  };
  
  const handleVerifyToken = () => {
    if (!token) {
      setError('Please enter the token');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const result = AuthManager.verifyToken(email, token);
    
    setTimeout(() => {
      setLoading(false);
      
      if (result.valid) {
        AuthManager.login(email);
        onLogin();
      } else {
        setError(result.reason || 'Invalid token');
      }
    }, 500);
  };
  
  const handleBack = () => {
    setStep('email');
    setToken('');
    setError('');
  };
  
  return React.createElement('div', {
    style: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
      padding: '2rem 1rem'
    }
  }, 
    React.createElement('div', {
      style: {
        background: 'var(--surface-color)',
        borderRadius: '16px',
        padding: '2rem',
        width: '100%',
        maxWidth: '400px',
        boxShadow: 'var(--shadow-lg)'
      }
    }, [
      // Header
      React.createElement('div', {
        key: 'header',
        style: { textAlign: 'center', marginBottom: '2rem' }
      }, [
        React.createElement('h1', {
          key: 'title',
          style: {
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'var(--text-primary)',
            marginBottom: '0.5rem'
          }
        }, 'Welcome to Al Khair'),
        React.createElement('p', {
          key: 'subtitle',
          style: {
            color: 'var(--text-secondary)',
            fontSize: '0.9rem'
          }
        }, step === 'email' ? 'Enter your email to get started' : 'Enter the code sent to your email')
      ]),
      
      // Email Step
      step === 'email' && React.createElement('div', {
        key: 'email-step'
      }, [
        React.createElement('div', {
          key: 'input-group',
          style: { marginBottom: '1.5rem' }
        }, [
          React.createElement('label', {
            key: 'label',
            style: {
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: 'var(--text-primary)'
            }
          }, 'Email Address'),
          React.createElement('input', {
            key: 'input',
            type: 'email',
            value: email,
            onChange: (e) => setEmail(e.target.value),
            placeholder: 'your@email.com',
            style: {
              width: '100%',
              padding: '0.75rem',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              fontSize: '1rem',
              outline: 'none',
              boxSizing: 'border-box'
            },
            onKeyPress: (e) => e.key === 'Enter' && handleSendToken()
          })
        ]),
        
        error && React.createElement('div', {
          key: 'error',
          style: {
            color: 'var(--error-color)',
            fontSize: '0.85rem',
            marginBottom: '1rem',
            textAlign: 'center'
          }
        }, error),
        
        React.createElement('button', {
          key: 'send-btn',
          onClick: handleSendToken,
          disabled: loading,
          style: {
            width: '100%',
            padding: '0.75rem',
            background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }
        }, loading ? 'Sending...' : 'Send Login Code')
      ]),
      
      // Token Step
      step === 'token' && React.createElement('div', {
        key: 'token-step'
      }, [
        React.createElement('div', {
          key: 'email-display',
          style: {
            background: 'var(--border-color)',
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }
        }, [
          React.createElement('div', {
            key: 'label',
            style: {
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              marginBottom: '0.25rem'
            }
          }, 'Code sent to:'),
          React.createElement('div', {
            key: 'email',
            style: {
              fontSize: '0.9rem',
              fontWeight: '600',
              color: 'var(--text-primary)'
            }
          }, email)
        ]),
        
        React.createElement('div', {
          key: 'input-group',
          style: { marginBottom: '1.5rem' }
        }, [
          React.createElement('label', {
            key: 'label',
            style: {
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: 'var(--text-primary)'
            }
          }, 'Login Code'),
          React.createElement('input', {
            key: 'input',
            type: 'text',
            value: token,
            onChange: (e) => setToken(e.target.value.toUpperCase()),
            placeholder: '1699127856.A7K92X5P',
            style: {
              width: '100%',
              padding: '0.75rem',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              fontSize: '1rem',
              outline: 'none',
              boxSizing: 'border-box',
              fontFamily: 'monospace'
            },
            onKeyPress: (e) => e.key === 'Enter' && handleVerifyToken()
          })
        ]),
        
        error && React.createElement('div', {
          key: 'error',
          style: {
            color: 'var(--error-color)',
            fontSize: '0.85rem',
            marginBottom: '1rem',
            textAlign: 'center'
          }
        }, error),
        
        React.createElement('div', {
          key: 'buttons',
          style: { display: 'flex', gap: '1rem' }
        }, [
          React.createElement('button', {
            key: 'back-btn',
            onClick: handleBack,
            style: {
              flex: 1,
              padding: '0.75rem',
              background: 'var(--border-color)',
              color: 'var(--text-primary)',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }
          }, 'Back'),
          
          React.createElement('button', {
            key: 'verify-btn',
            onClick: handleVerifyToken,
            disabled: loading,
            style: {
              flex: 2,
              padding: '0.75rem',
              background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }
          }, loading ? 'Verifying...' : 'Verify Code')
        ])
      ])
    ])
  );
};
