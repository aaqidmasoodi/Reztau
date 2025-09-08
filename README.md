# Reztau - Restaurant PWA

A white-label Progressive Web App for restaurants to showcase their menu and accept orders.

## Features

- 📱 Native-like mobile experience
- 🌙 Dark/Light mode support
- 🛒 Shopping cart with persistence
- 💳 Stripe payment integration
- 📴 Offline menu browsing
- 🎨 Fully customizable branding
- 📋 Order management via Stripe Dashboard

## Quick Start

1. **Clone/Download** this repository
2. **Configure** your restaurant settings in the `config/` files
3. **Add your assets** (logo, menu images) to the `assets/` folder
4. **Deploy** to any static hosting service

## Configuration

### Restaurant Settings (`config/restaurant-config.json`)
```json
{
  "name": "Your Restaurant Name",
  "description": "Your restaurant description",
  "logo": "assets/your-logo.png",
  "contact": {
    "phone": "+1 (555) 123-4567",
    "email": "orders@yourrestaurant.com",
    "address": "123 Main Street, City, State 12345"
  }
}
```

### Theme Customization (`config/theme-config.json`)
- Customize colors for light and dark modes
- Set primary, secondary, and accent colors
- Configure text and background colors

### Menu Data (`config/menu-data.json`)
- Add your menu categories and items
- Set prices, descriptions, and images
- Mark items as available/unavailable

### App Settings (`config/app-config.json`)
- Add your Stripe publishable key
- Configure tax rates and currency
- Set up OneSignal for notifications

## Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Get your publishable key from the Stripe Dashboard
3. Add the key to `config/app-config.json`
4. Orders will appear in your Stripe Dashboard with full customer and order details

## Deployment

### Static Hosting (Recommended)
- **Netlify**: Drag and drop the folder
- **Vercel**: Connect your Git repository
- **GitHub Pages**: Push to a repository and enable Pages
- **AWS S3**: Upload files and enable static website hosting

### Custom Domain
1. Point your domain to your hosting service
2. Update the `start_url` in `manifest.json` if needed
3. Test the PWA installation on mobile devices

## Customization for Each Restaurant

1. **Copy** the entire project folder
2. **Update** all config files with restaurant-specific data
3. **Replace** logo and menu images in the `assets/` folder
4. **Deploy** to a separate domain/subdomain for each restaurant

## File Structure

```
reztau/
├── index.html              # Main HTML file
├── manifest.json           # PWA manifest
├── sw.js                  # Service worker
├── styles/
│   └── main.css           # Main stylesheet
├── components/            # React components
├── utils/                 # Utility functions
├── config/               # Configuration files
└── assets/               # Images and static assets
```

## Browser Support

- Chrome/Edge 88+
- Safari 14+
- Firefox 85+
- Mobile browsers with PWA support

## Development

This app uses vanilla React with Babel for in-browser compilation. No build process required!

To modify:
1. Edit the React components in the `components/` folder
2. Update styles in `styles/main.css`
3. Modify configuration files as needed
4. Test in a local server (e.g., `python -m http.server`)

## Support

For technical support or customization requests, please contact the development team.

## License

This project is licensed for commercial use by restaurants and food service businesses.
