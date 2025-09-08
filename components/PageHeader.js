const PageHeader = ({ title, onBack, rightButton }) => {
  return React.createElement('div', {
    style: {
      position: 'sticky',
      top: 0,
      background: 'var(--surface-color)',
      borderBottom: '1px solid var(--border-color)',
      padding: '1rem 1.5rem',
      paddingTop: 'calc(1rem + env(safe-area-inset-top))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 100,
      boxShadow: 'var(--shadow)'
    }
  }, [
    React.createElement('div', {
      key: 'left',
      style: { display: 'flex', alignItems: 'center', gap: '1rem' }
    }, [
      React.createElement('button', {
        key: 'back',
        onClick: onBack,
        style: {
          background: 'none',
          border: 'none',
          color: 'var(--primary-color)',
          fontSize: '1.25rem',
          cursor: 'pointer',
          padding: '0.5rem',
          borderRadius: '50%',
          transition: 'background-color 0.2s'
        }
      }, React.createElement('i', { className: 'fas fa-arrow-left' })),
      
      React.createElement('h1', {
        key: 'title',
        style: {
          fontSize: '1.25rem',
          fontWeight: '700',
          color: 'var(--text-primary)',
          margin: 0
        }
      }, title)
    ]),
    
    rightButton && React.createElement('div', {
      key: 'right'
    }, rightButton)
  ]);
};
