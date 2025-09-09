const PrivacyPolicy = () => {
  const [policyData, setPolicyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPrivacyPolicy = async () => {
      try {
        const response = await fetch('config/privacy-policy.json');
        const data = await response.json();
        setPolicyData(data);
      } catch (error) {
        console.error('Failed to load privacy policy:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPrivacyPolicy();
  }, []);

  if (loading) {
    return React.createElement('div', {
      style: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'hsl(var(--background))',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 'calc(70px + env(safe-area-inset-top))',
        paddingBottom: '100px'
      }
    }, React.createElement('div', {
      style: {
        fontSize: '1rem',
        color: 'hsl(var(--muted-foreground))'
      }
    }, 'Loading...'));
  }

  if (!policyData) {
    return React.createElement('div', {
      style: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'hsl(var(--background))',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 'calc(70px + env(safe-area-inset-top))',
        paddingBottom: '100px'
      }
    }, React.createElement('div', {
      style: {
        fontSize: '1rem',
        color: 'hsl(var(--destructive))'
      }
    }, 'Failed to load privacy policy'));
  }

  return React.createElement('div', {
    style: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'hsl(var(--background))',
      zIndex: 1000,
      overflow: 'auto',
      paddingTop: 'calc(70px + env(safe-area-inset-top))',
      paddingBottom: '100px',
      transform: 'translateX(0)',
      transition: 'transform 0.3s ease-out',
      animation: 'slideInFromRight 0.3s ease-out'
    }
  }, [
    React.createElement('div', {
      key: 'content',
      style: {
        padding: '1.5rem',
        maxWidth: '600px',
        margin: '0 auto'
      }
    }, [
      React.createElement('div', {
        key: 'header',
        style: {
          textAlign: 'center',
          marginBottom: '2rem'
        }
      }, [
        React.createElement('h1', {
          key: 'title',
          style: {
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'hsl(var(--foreground))',
            margin: '0 0 0.5rem 0'
          }
        }, policyData.title),
        React.createElement('p', {
          key: 'restaurant',
          style: {
            fontSize: '1rem',
            color: 'hsl(var(--primary))',
            fontWeight: '500',
            margin: '0 0 0.25rem 0'
          }
        }, policyData.restaurant),
        React.createElement('p', {
          key: 'updated',
          style: {
            fontSize: '0.875rem',
            color: 'hsl(var(--muted-foreground))',
            margin: 0
          }
        }, `Last updated: ${policyData.lastUpdated}`)
      ]),
      
      ...policyData.sections.map((section, index) =>
        React.createElement('div', {
          key: `section-${index}`,
          style: {
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: 'hsl(var(--muted))',
            borderRadius: '8px',
            border: '1px solid hsl(var(--border))'
          }
        }, [
          React.createElement('h3', {
            key: 'title',
            style: {
              fontSize: '1rem',
              fontWeight: '600',
              color: 'hsl(var(--foreground))',
              margin: '0 0 0.75rem 0'
            }
          }, section.title),
          React.createElement('p', {
            key: 'content',
            style: {
              fontSize: '0.875rem',
              lineHeight: '1.6',
              color: 'hsl(var(--muted-foreground))',
              margin: 0
            }
          }, section.content)
        ])
      )
    ])
  ]);
};
