const DeveloperInfo = ({ onBack }) => {
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
      paddingBottom: '100px'
    }
  }, [
    // Header
    React.createElement('div', {
      key: 'header',
      style: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '70px',
        background: 'hsl(var(--background))',
        borderBottom: '1px solid hsl(var(--border))',
        display: 'flex',
        alignItems: 'center',
        padding: '0 1rem',
        zIndex: 1001,
        paddingTop: 'env(safe-area-inset-top)'
      }
    }, [
      React.createElement('button', {
        key: 'back',
        onClick: onBack,
        style: {
          background: 'none',
          border: 'none',
          fontSize: '1.25rem',
          cursor: 'pointer',
          color: 'hsl(var(--primary))',
          padding: '0.5rem',
          marginRight: '1rem',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }, React.createElement('i', { className: 'fas fa-arrow-left' })),
      React.createElement('h1', {
        key: 'title',
        style: {
          fontSize: '1.25rem',
          fontWeight: '600',
          color: 'hsl(var(--foreground))',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }
      }, [
        React.createElement('i', {
          key: 'icon',
          className: 'fas fa-code',
          style: { color: 'hsl(var(--primary))' }
        }),
        'Developer Info'
      ])
    ]),
    
    // Content
    React.createElement('div', {
      key: 'content',
      style: {
        padding: '1.5rem',
        maxWidth: '600px',
        margin: '0 auto'
      }
    }, [
      // Profile Section
      React.createElement('div', {
        key: 'profile',
        style: {
          textAlign: 'center',
          marginBottom: '2rem'
        }
      }, [
        React.createElement('img', {
          key: 'avatar',
          src: 'Aaqid.jpeg',
          alt: 'Aaqid Masoodi',
          style: {
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            objectFit: 'cover',
            margin: '0 auto 1rem',
            border: '3px solid hsl(var(--primary))'
          }
        }),
        React.createElement('h2', {
          key: 'name',
          style: {
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'hsl(var(--foreground))',
            margin: '0 0 0.25rem 0'
          }
        }, 'Aaqid Masoodi'),
        React.createElement('p', {
          key: 'title',
          style: {
            fontSize: '1rem',
            color: 'hsl(var(--primary))',
            fontWeight: '500',
            margin: 0
          }
        }, 'Full-Stack AI & Product Engineer')
      ]),
      
      // About Section
      React.createElement('div', {
        key: 'about',
        style: { marginBottom: '1.5rem' }
      }, [
        React.createElement('h3', {
          key: 'about-title',
          style: {
            fontSize: '1rem',
            fontWeight: '600',
            color: 'hsl(var(--foreground))',
            margin: '0 0 0.75rem 0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }
        }, [
          React.createElement('i', {
            key: 'icon',
            className: 'fas fa-user',
            style: { color: 'hsl(var(--primary))', fontSize: '0.875rem' }
          }),
          'About'
        ]),
        React.createElement('p', {
          key: 'about-text',
          style: {
            fontSize: '0.875rem',
            lineHeight: '1.6',
            color: 'hsl(var(--muted-foreground))',
            margin: 0
          }
        }, 'Passionate developer with 6+ years in AI, web development, and product engineering. Specializing in scalable applications, AI-powered tools, and intuitive interfaces that combine creativity with cutting-edge technology.')
      ]),
      
      // Skills Section
      React.createElement('div', {
        key: 'skills',
        style: { marginBottom: '1.5rem' }
      }, [
        React.createElement('h3', {
          key: 'skills-title',
          style: {
            fontSize: '1rem',
            fontWeight: '600',
            color: 'hsl(var(--foreground))',
            margin: '0 0 0.75rem 0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }
        }, [
          React.createElement('i', {
            key: 'icon',
            className: 'fas fa-cogs',
            style: { color: 'hsl(var(--primary))', fontSize: '0.875rem' }
          }),
          'Technical Skills'
        ]),
        React.createElement('div', {
          key: 'skills-grid',
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '0.75rem'
          }
        }, [
          ['Languages', 'Python, JavaScript, React, Node.js'],
          ['AI/ML', 'LLMs, NLP, PyTorch, Hugging Face'],
          ['Web/App', 'React, Next.js, React Native, Flask'],
          ['Cloud/DB', 'PostgreSQL, Supabase, AWS, Vercel'],
          ['Tools', 'Git, Docker, VS Code, CI/CD'],
          ['Design', 'Figma, Adobe Suite, Web Animations']
        ].map(([category, skills], index) =>
          React.createElement('div', {
            key: index,
            style: {
              padding: '0.75rem',
              backgroundColor: 'hsl(var(--muted))',
              borderRadius: '8px',
              border: '1px solid hsl(var(--border))'
            }
          }, [
            React.createElement('div', {
              key: 'category',
              style: {
                fontSize: '0.75rem',
                fontWeight: '600',
                color: 'hsl(var(--primary))',
                marginBottom: '0.25rem'
              }
            }, category),
            React.createElement('div', {
              key: 'skills',
              style: {
                fontSize: '0.75rem',
                color: 'hsl(var(--muted-foreground))',
                lineHeight: '1.4'
              }
            }, skills)
          ])
        ))
      ]),
      
      // Projects Section
      React.createElement('div', {
        key: 'projects',
        style: { marginBottom: '1.5rem' }
      }, [
        React.createElement('h3', {
          key: 'projects-title',
          style: {
            fontSize: '1rem',
            fontWeight: '600',
            color: 'hsl(var(--foreground))',
            margin: '0 0 0.75rem 0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }
        }, [
          React.createElement('i', {
            key: 'icon',
            className: 'fas fa-rocket',
            style: { color: 'hsl(var(--primary))', fontSize: '0.875rem' }
          }),
          'Notable Projects'
        ]),
        React.createElement('div', {
          key: 'projects-list',
          style: { display: 'flex', flexDirection: 'column', gap: '0.5rem' }
        }, [
          'BridgeChat – Real-time multi-language chat with AI translation',
          'AI Vlog Editor – Automated video editing with AI subtitles',
          'Analytics Visualizer – Interactive business intelligence dashboards'
        ].map((project, index) =>
          React.createElement('div', {
            key: index,
            style: {
              fontSize: '0.875rem',
              color: 'hsl(var(--muted-foreground))',
              padding: '0.5rem 0',
              borderLeft: '3px solid hsl(var(--primary))',
              paddingLeft: '0.75rem'
            }
          }, project)
        ))
      ]),
      
      // Contact Section
      React.createElement('div', {
        key: 'contact',
        style: {
          padding: '1rem',
          backgroundColor: 'hsl(var(--muted))',
          borderRadius: '8px',
          border: '1px solid hsl(var(--border))'
        }
      }, [
        React.createElement('h3', {
          key: 'contact-title',
          style: {
            fontSize: '1rem',
            fontWeight: '600',
            color: 'hsl(var(--foreground))',
            margin: '0 0 0.75rem 0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }
        }, [
          React.createElement('i', {
            key: 'icon',
            className: 'fas fa-envelope',
            style: { color: 'hsl(var(--primary))', fontSize: '0.875rem' }
          }),
          'Get in Touch'
        ]),
        React.createElement('div', {
          key: 'contact-links',
          style: { display: 'flex', flexDirection: 'column', gap: '0.5rem' }
        }, [
          React.createElement('a', {
            key: 'email',
            href: 'mailto:contact@aaqidmasoodi.com',
            style: {
              color: 'hsl(var(--primary))',
              textDecoration: 'none',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }
          }, [
            React.createElement('i', {
              key: 'icon',
              className: 'fas fa-envelope',
              style: { fontSize: '0.75rem' }
            }),
            'contact@aaqidmasoodi.com'
          ]),
          React.createElement('a', {
            key: 'linkedin',
            href: 'https://www.linkedin.com/in/aaqidmasoodi/',
            target: '_blank',
            rel: 'noopener noreferrer',
            style: {
              color: 'hsl(var(--primary))',
              textDecoration: 'none',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }
          }, [
            React.createElement('i', {
              key: 'icon',
              className: 'fab fa-linkedin',
              style: { fontSize: '0.75rem' }
            }),
            'LinkedIn Profile'
          ]),
          React.createElement('a', {
            key: 'github',
            href: 'https://github.com/aaqidmasoodi',
            target: '_blank',
            rel: 'noopener noreferrer',
            style: {
              color: 'hsl(var(--primary))',
              textDecoration: 'none',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }
          }, [
            React.createElement('i', {
              key: 'icon',
              className: 'fab fa-github',
              style: { fontSize: '0.75rem' }
            }),
            'GitHub Profile'
          ])
        ])
      ])
    ])
  ]);
};
