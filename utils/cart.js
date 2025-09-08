const CartManager = {
  items: [],
  
  init() {
    const saved = localStorage.getItem('reztau-cart');
    if (saved) {
      this.items = JSON.parse(saved);
    }
  },
  
  save() {
    localStorage.setItem('reztau-cart', JSON.stringify(this.items));
  },
  
  addItem(item) {
    const existing = this.items.find(i => i.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.items.push({ ...item, quantity: 1 });
    }
    this.save();
  },
  
  removeItem(itemId) {
    this.items = this.items.filter(item => item.id !== itemId);
    this.save();
  },
  
  updateQuantity(itemId, quantity) {
    if (quantity <= 0) {
      this.removeItem(itemId);
      return;
    }
    
    const item = this.items.find(i => i.id === itemId);
    if (item) {
      item.quantity = quantity;
      this.save();
    }
  },
  
  getTotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  },
  
  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  },
  
  clear() {
    this.items = [];
    this.save();
  }
};
