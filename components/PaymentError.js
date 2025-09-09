const PaymentError = ({ errorMessage, onRetry, onClose }) => {
  const [showAnimation, setShowAnimation] = useState(true);
  
  useEffect(() => {
    // Auto close after 10 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 10000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return React.createElement('div', {
    style: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `linear-gradient(135deg, #ff4757, #ff3742)`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999999,
      color: 'white',
      textAlign: 'center',
      padding: '1.5rem'
    }
  }, [
    // Error icon
    React.createElement('div', {
      key: 'animation',
      style: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.5rem',
        animation: showAnimation ? 'bounce 0.5s ease-out' : 'none',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }
    }, React.createElement('i', {
      className: 'fas fa-times',
      style: {
        fontSize: '2rem',
        animation: showAnimation ? 'checkmark 0.6s ease-out 0.2s both' : 'none'
      }
    })),
    
    // Title
    React.createElement('h1', {
      key: 'title',
      style: {
        fontSize: '2rem',
        fontWeight: '700',
        marginBottom: '0.5rem',
        animation: showAnimation ? 'fadeInUp 0.6s ease-out 0.4s both' : 'none'
      }
    }, 'Payment Failed'),
    
    // Error message
    React.createElement('p', {
      key: 'message',
      style: {
        fontSize: '1.1rem',
        opacity: 0.9,
        marginBottom: '2rem',
        animation: showAnimation ? 'fadeInUp 0.6s ease-out 0.6s both' : 'none'
      }
    }, errorMessage || 'Your payment could not be processed'),
    
    // Action buttons
    React.createElement('div', {
      key: 'buttons',
      style: {
        display: 'flex',
        gap: '1rem',
        animation: showAnimation ? 'fadeInUp 0.6s ease-out 0.8s both' : 'none'
      }
    }, [
      React.createElement('button', {
        key: 'retry',
        onClick: onRetry,
        style: {
          background: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '25px',
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(10px)'
        }
      }, 'Try Again'),
      
      React.createElement('button', {
        key: 'close',
        onClick: onClose,
        style: {
          background: 'rgba(255, 255, 255, 0.1)',
          color: 'white',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '25px',
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(10px)'
        }
      }, 'Cancel')
    ])
  ]);
};
