const FavoritesManager = {
  items: [],
  
  init() {
    const saved = localStorage.getItem('reztau-favorites');
    if (saved) {
      this.items = JSON.parse(saved);
    }
  },
  
  save() {
    localStorage.setItem('reztau-favorites', JSON.stringify(this.items));
  },
  
  addItem(item) {
    if (!this.isFavorite(item.id)) {
      this.items.push(item);
      this.save();
    }
  },
  
  removeItem(itemId) {
    this.items = this.items.filter(item => item.id !== itemId);
    this.save();
  },
  
  toggleItem(item) {
    if (this.isFavorite(item.id)) {
      this.removeItem(item.id);
    } else {
      this.addItem(item);
    }
  },
  
  isFavorite(itemId) {
    return this.items.some(item => item.id === itemId);
  },
  
  getFavorites() {
    return [...this.items];
  }
};
