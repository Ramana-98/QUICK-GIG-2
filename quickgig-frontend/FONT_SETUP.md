# QuickGig Font Setup Guide

## Overview
This document outlines the complete font configuration for the QuickGig project, using **Inter** as the primary font and **Poppins** as the secondary font.

## Font Configuration

### 1. Google Fonts Import
Added to `index.html`:
```html
<!-- Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```

### 2. Tailwind Configuration
Updated `tailwind.config.js`:
```javascript
fontFamily: {
  sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
  poppins: ['Poppins', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
},
```

### 3. CSS Base Styles
Added to `src/index.css`:
```css
body {
  @apply bg-background text-foreground font-sans;
  font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
  font-variation-settings: normal;
}

/* Typography hierarchy */
h1, h2, h3, h4, h5, h6 {
  @apply font-poppins font-semibold;
}

/* Card titles and section headers */
.card-title, .section-title {
  @apply font-poppins font-semibold;
}

/* Balance amounts and important numbers */
.balance-amount, .price-display {
  @apply font-poppins font-bold;
}
```

## Font Usage Patterns

### Inter (Primary Font - `font-sans`)
Use for all body text, navigation, forms, and UI elements:
- **Body text and paragraphs**
- **Form inputs and labels**
- **Navigation menus**
- **Button text**
- **Descriptions and metadata**
- **List items**
- **Modal content**

### Poppins (Secondary Font - `font-poppins`)
Use for headings, titles, and branding sections:
- **Page headings (h1, h2, h3)**
- **Card titles**
- **Section headers**
- **Balance amounts and prices**
- **Important numbers**
- **Brand elements**

## Example Usage

### Dashboard Text (Inter)
```jsx
<p className="font-sans text-muted-foreground">
  Find your next gig opportunity
</p>
```

### Section Heading (Poppins)
```jsx
<h2 className="text-3xl font-poppins font-semibold text-gray-800">
  Payments & Wallet
</h2>
```

### Wallet Balance Amount (Poppins Bold)
```jsx
<div className="text-3xl font-poppins font-bold text-green-600">
  ₹1,247.50
</div>
```

### Recent Activity List (Inter)
```jsx
<p className="font-sans font-medium text-gray-900">
  Payment received from Dog Walking
</p>
```

### Form Elements (Inter)
```jsx
<input 
  type="text" 
  className="font-sans text-gray-900 placeholder-gray-500"
  placeholder="Enter your full name"
/>
```

## Responsive Typography

The font setup includes responsive typography with proper scaling:

```css
h1 { @apply text-4xl md:text-5xl lg:text-6xl; }
h2 { @apply text-3xl md:text-4xl lg:text-5xl; }
h3 { @apply text-2xl md:text-3xl lg:text-4xl; }
h4 { @apply text-xl md:text-2xl lg:text-3xl; }
h5 { @apply text-lg md:text-xl lg:text-2xl; }
h6 { @apply text-base md:text-lg lg:text-xl; }
```

## Font Weights Available

### Inter
- 300 (Light)
- 400 (Regular)
- 500 (Medium)
- 600 (Semi-bold)
- 700 (Bold)

### Poppins
- 300 (Light)
- 400 (Regular)
- 500 (Medium)
- 600 (Semi-bold)
- 700 (Bold)
- 800 (Extra-bold)

## Best Practices

1. **Consistency**: Always use `font-sans` for body text and `font-poppins` for headings
2. **Hierarchy**: Use font weights to create visual hierarchy (regular for body, semibold for headings, bold for emphasis)
3. **Readability**: Ensure sufficient contrast and appropriate font sizes for mobile devices
4. **Performance**: Fonts are preloaded for optimal performance
5. **Fallbacks**: Comprehensive fallback stack ensures fonts display correctly across all devices

## Testing

To test the font setup:
1. Run the development server
2. Navigate to different pages
3. Check font rendering on desktop and mobile
4. Verify that headings use Poppins and body text uses Inter
5. Test with different font weights

## Example Component

See `src/components/FontExample.tsx` for a complete example demonstrating proper font usage across different UI elements.
