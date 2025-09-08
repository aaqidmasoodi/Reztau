const AuthManager = {
  SECRET_KEY: 'alkhair-restaurant-secret-2024',
  
  generateToken(email) {
    const expiry = Date.now() + (5 * 60 * 1000); // 5 minutes
    const data = `${email}:${expiry}`;
    
    // Simple hash function (replace with crypto library later)
    let hash = 0;
    const fullString = data + this.SECRET_KEY;
    for (let i = 0; i < fullString.length; i++) {
      const char = fullString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    const signature = Math.abs(hash).toString(36).substring(0, 8).toUpperCase();
    return `${expiry}.${signature}`;
  },
  
  verifyToken(email, token) {
    try {
      const [expiry, signature] = token.split('.');
      
      // Check expiry
      if (Date.now() > parseInt(expiry)) {
        return { valid: false, reason: 'Token expired' };
      }
      
      // Verify signature
      const data = `${email}:${expiry}`;
      let hash = 0;
      const fullString = data + this.SECRET_KEY;
      for (let i = 0; i < fullString.length; i++) {
        const char = fullString.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      
      const expectedSignature = Math.abs(hash).toString(36).substring(0, 8).toUpperCase();
      
      if (signature === expectedSignature) {
        return { valid: true, email };
      } else {
        return { valid: false, reason: 'Invalid token' };
      }
    } catch (error) {
      return { valid: false, reason: 'Malformed token' };
    }
  },
  
  isAuthenticated() {
    const user = localStorage.getItem('reztau-user');
    return !!user;
  },
  
  getCurrentUser() {
    const user = localStorage.getItem('reztau-user');
    return user ? JSON.parse(user) : null;
  },
  
  login(email) {
    const user = { email, loginTime: Date.now() };
    localStorage.setItem('reztau-user', JSON.stringify(user));
  },
  
  logout() {
    localStorage.removeItem('reztau-user');
  }
};
