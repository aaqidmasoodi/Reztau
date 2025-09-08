const TopPicks = ({ picks, onItemClick }) => {
  if (!picks || picks.length === 0) return null;
  
  return React.createElement('section', {
    className: 'top-picks'
  }, [
    React.createElement('h2', {
      key: 'title'
    }, 'Today\'s Top Picks'),
    
    React.createElement('div', {
      key: 'carousel-container',
      className: 'carousel-container'
    }, 
      React.createElement('div', {
        className: 'carousel'
      }, picks.map(item =>
        React.createElement('div', {
          key: item.id,
          className: 'pick-card',
          onClick: () => onItemClick(item)
        }, [
          React.createElement('img', {
            key: 'image',
            src: item.image,
            alt: item.name,
            className: 'pick-image',
            onError: (e) => {
              e.target.src = 'https://via.placeholder.com/280x150/ff6b35/ffffff?text=No+Image';
            }
          }),
          React.createElement('h3', {
            key: 'name',
            className: 'pick-name'
          }, item.name),
          React.createElement('div', {
            key: 'price',
            className: 'pick-price'
          }, `$${item.price.toFixed(2)}`)
        ])
      ))
    )
  ]);
};
