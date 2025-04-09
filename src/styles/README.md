# Styles System

This directory contains the CSS styling for the webflow-3d project.

## Structure

- `main.css`: The main CSS file that defines global styles, variables, and can import component-specific styles
- `index.ts`: Import file that bundles all CSS for inclusion in the main application

## Usage

### Adding New Styles

1. Create your CSS file in the appropriate directory (e.g., `src/styles/components/button.css`)
2. Import it in `index.ts`:
   ```ts
   import './main.css';
   import './components/button.css';
   ```

### Building Styles

#### Option 1: Build with the main application

```bash
pnpm build
```

This will build both the JavaScript and CSS files together.

#### Option 2: Build only styles

```bash
pnpm build:styles
```

This will build only the CSS files, which is faster when you're only making style changes.

### Development

During development, run:

```bash
pnpm dev
```

This will start a development server with live reload. You can include your CSS files in your Webflow project:

```html
<link href="http://localhost:3000/main.css" rel="stylesheet" type="text/css" />
```

## CSS Variables

Global CSS variables are defined in `main.css`. Use these variables throughout your components for consistent styling:

```css
/* Example usage */
.my-component {
  color: var(--primary-color);
  background-color: var(--background-color);
}
```
