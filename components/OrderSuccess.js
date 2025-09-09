const OrderSuccess = ({ orderId, total, onClose, onShowOrderHistory }) => {
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
      background: `linear-gradient(135deg, var(--primary-color), var(--accent-color))`,
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
    // Compact success icon
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
      className: 'fas fa-check',
      style: {
        fontSize: '2rem',
        animation: showAnimation ? 'checkmark 0.6s ease-out 0.2s both' : 'none'
      }
    })),
    
    // Compact success message
    React.createElement('h1', {
      key: 'title',
      style: {
        fontSize: '1.8rem',
        fontWeight: '800',
        marginBottom: '0.5rem',
        animation: showAnimation ? 'fadeInUp 0.5s ease-out 0.3s both' : 'none',
        opacity: 0
      }
    }, 'Order Placed!'),
    
    React.createElement('p', {
      key: 'subtitle',
      style: {
        fontSize: '1rem',
        marginBottom: '1rem',
        opacity: 0.9,
        animation: showAnimation ? 'fadeInUp 0.5s ease-out 0.4s both' : 'none'
      }
    }, 'Your order is being prepared'),
    
    // Compact order details
    React.createElement('div', {
      key: 'details',
      style: {
        background: 'rgba(255, 255, 255, 0.15)',
        borderRadius: '12px',
        padding: '1rem',
        marginBottom: '1.5rem',
        animation: showAnimation ? 'fadeInUp 0.5s ease-out 0.5s both' : 'none',
        opacity: 0,
        backdropFilter: 'blur(10px)'
      }
    }, [
      React.createElement('div', {
        key: 'order-id',
        style: {
          fontSize: '0.8rem',
          marginBottom: '0.25rem',
          opacity: 0.8,
          fontFamily: 'monospace'
        }
      }, `#${orderId.slice(-8)}`),
      React.createElement('div', {
        key: 'total',
        style: {
          fontSize: '1.3rem',
          fontWeight: '700'
        }
      }, `€${total.toFixed(2)}`)
    ]),
    
    // Compact action button
    React.createElement('button', {
      key: 'continue',
      onClick: () => {
        onClose();
        if (onShowOrderHistory) {
          onShowOrderHistory();
        }
      },
      style: {
        padding: '0.75rem 2rem',
        background: 'rgba(255, 255, 255, 0.9)',
        color: 'var(--primary-color)',
        border: 'none',
        borderRadius: '25px',
        fontSize: '0.9rem',
        fontWeight: '700',
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        animation: showAnimation ? 'fadeInUp 0.5s ease-out 0.6s both' : 'none',
        opacity: 0,
        backdropFilter: 'blur(10px)'
      }
    }, 'Track Order'),
    
    // Compact auto close indicator
    React.createElement('div', {
      key: 'auto-close',
      style: {
        position: 'absolute',
        bottom: '1.5rem',
        fontSize: '0.75rem',
        opacity: 0.6,
        animation: showAnimation ? 'fadeIn 0.5s ease-out 0.8s both' : 'none'
      }
    }, 'Auto-closing...')
  ]);
};

// Compact CSS animations
if (!document.getElementById('order-success-styles')) {
  const style = document.createElement('style');
  style.id = 'order-success-styles';
  style.textContent = `
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% { transform: translate3d(0,0,0) scale(1); }
      40% { transform: translate3d(0,-15px,0) scale(1.1); }
      60% { transform: translate3d(0,-7px,0) scale(1.05); }
    }
    
    @keyframes checkmark {
      0% { transform: scale(0); opacity: 0; }
      50% { transform: scale(1.2); opacity: 1; }
      100% { transform: scale(1); opacity: 1; }
    }
    
    @keyframes fadeInUp {
      0% { transform: translateY(20px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes fadeIn {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
  `;
  document.head.appendChild(style);
}
