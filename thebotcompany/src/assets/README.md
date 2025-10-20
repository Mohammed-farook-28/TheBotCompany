# Assets Directory

This directory contains all static assets for the TheBotCompany project.

## Structure

```
assets/
├── images/          # Image files (PNG, JPG, SVG, etc.)
├── icons/           # Icon files (SVG, ICO, etc.)
├── fonts/           # Font files (TTF, WOFF, WOFF2, etc.)
└── README.md        # This file
```

## Usage

Import assets in your components:

```tsx
// Images
import logo from '../assets/images/bot.png'
import heroImage from '../assets/images/hero-bg.jpg'

// Icons
import { ReactComponent as MenuIcon } from '../assets/icons/menu.svg'

// Fonts
import '../assets/fonts/custom-font.css'
```

## Guidelines

- Use descriptive filenames
- Optimize images for web (compress, resize)
- Use SVG for icons when possible
- Keep file sizes reasonable for web performance
