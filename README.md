# Webflow 3D - Development Documentation

A modern Webflow integration for 3D animations, smooth scrolling, and interactive components.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Documentation](#documentation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## Features

Webflow 3D provides a comprehensive set of features to enhance your Webflow projects:

- **Smooth Scrolling** - Powered by Lenis for butter-smooth scrolling experiences
- **Page Transitions** - Seamless transitions between pages using Swup.js
- **Word Animations** - Scroll-triggered 3D text animations
- **Swiper Sliders** - Flexible, configurable sliders for all content types
- **Component Architecture** - Modular component system for easy maintenance
- **GSAP Animations** - Integration with GSAP for advanced animations

## Getting Started

### Prerequisites

This project requires the use of [pnpm](https://pnpm.js.org/en/). You can [install pnpm](https://pnpm.io/installation) with:

```bash
npm i -g pnpm
```

### Installation

1. Clone this repository
2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm dev
```

4. Build for production:

```bash
pnpm build
```

### Basic Usage

Include the built script in your Webflow project:

```html
<script defer src="https://cdn.example.com/webflow-3d.js"></script>
```

For local development:

```html
<script defer src="http://localhost:3000/index.js"></script>
```

## Documentation

Comprehensive documentation for each feature:

- [Component Architecture](docs/component-architecture.md) - Learn about the modular component system
- [Swiper Implementation](swiper-implementation-guide.md) - Guide for implementing sliders
- [Word Animations](docs/word-animations-guide.md) - Documentation for text animations
- [View Transitions](docs/viewTransitions-guide.md) - Page transition implementation

## Project Structure

```
webflow-3d/
├── src/
│   ├── components/        # UI components
│   │   ├── animations/    # Animation modules
│   │   ├── scroll/        # Scroll-based features
│   │   ├── sliders/       # Slider implementations
│   │   └── transitions/   # Page transitions
│   ├── lib/               # Utilities and constants
│   ├── styles/            # CSS styles
│   └── index.ts           # Main entry point
├── docs/                  # Documentation
└── dist/                  # Production build output
```

## Key Features Implementation

### Word Animations

Add scroll-triggered 3D text animations with a simple attribute:

```html
<h1 data-word-animation>Animate This Heading</h1>
```

### Swiper Sliders

Create responsive, touch-enabled sliders:

```html
<div data-swiper data-swiper-type="gallery" class="swiper">
  <div class="swiper-wrapper">
    <div class="swiper-slide">Slide 1</div>
    <div class="swiper-slide">Slide 2</div>
  </div>
  <div data-swiper-pagination></div>
  <div data-swiper-prev></div>
  <div data-swiper-next></div>
</div>
```

### Page Transitions

Enable smooth page transitions by wrapping your content:

```html
<main id="swup">
  <!-- Your page content here -->
</main>
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

### Development Workflow

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test
```
