const BottomNav = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'menu', label: 'Menu', icon: 'fas fa-utensils' },
    { id: 'about', label: 'About', icon: 'fas fa-info-circle' }
  ];
  
  return React.createElement('nav', {
    className: 'bottom-nav'
  }, navItems.map(item => 
    React.createElement('a', {
      key: item.id,
      href: '#',
      className: `nav-item ${activeTab === item.id ? 'active' : ''}`,
      onClick: (e) => {
        e.preventDefault();
        onTabChange(item.id);
      }
    }, [
      React.createElement('i', {
        key: 'icon',
        className: `nav-icon ${item.icon}`
      }),
      React.createElement('span', {
        key: 'label'
      }, item.label)
    ])
  ));
};
