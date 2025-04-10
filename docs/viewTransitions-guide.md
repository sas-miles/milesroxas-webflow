# Webflow 3D - View Transitions Guide

## Overview

The View Transitions system in Webflow 3D provides smooth page transitions using Swup.js. This guide explains how to implement and customize page transitions in your Webflow projects.

## Table of Contents

- [Implementation](#implementation)
- [How It Works](#how-it-works)
- [Configuration Options](#configuration-options)
- [Event Hooks](#event-hooks)
- [Integration with Animations](#integration-with-animations)
- [Customizing Transitions](#customizing-transitions)
- [Troubleshooting](#troubleshooting)

## Implementation

The View Transitions system is already set up in the Webflow 3D codebase. To use it:

1. Ensure your main content is wrapped in an element with the ID `swup`:

```html
<main id="swup">
  <!-- Your page content goes here -->
</main>
```

2. Make sure all your internal links use the proper Webflow navigation:

```html
<a href="/your-page">Link Text</a>
```

3. The transitions will automatically work without any additional configuration.

## How It Works

The View Transitions system uses Swup.js with a custom animation plugin to create smooth transitions between pages. When a user clicks a link:

1. The current page content fades out with a scale animation
2. The request for the new page is made in the background
3. Once loaded, the new page content fades in with a scale animation
4. All components and animations are reinitialized

## Configuration Options

The View Transitions system uses a minimalist configuration focused on performance and compatibility:

```javascript
const swup = new Swup({
  plugins: [
    new SwupJsPlugin({
      animations: [
        {
          from: '(.*)',
          to: '(.*)',
          out: async (done) => {
            // Transition out animation
            await gsap.to('#swup', {
              opacity: 0,
              duration: 0.8,
              scale: 0.98,
              ease: 'power2.inOut',
              overwrite: true,
            });
            done();
          },
          in: async (done) => {
            // Transition in animation
            await gsap.fromTo(
              '#swup',
              { opacity: 0, scale: 0.9 },
              {
                opacity: 1,
                duration: 0.8,
                scale: 1,
                ease: 'power2.inOut',
                overwrite: true,
                onComplete: () => {
                  // Handle lazy loading images
                  done();
                },
              }
            );
          },
        },
      ],
    }),
  ],
  cache: true,
  animateHistoryBrowsing: true,
  animationSelector: '[id="swup"]',
});
```

## Event Hooks

The system exposes the following custom events you can use to hook into the transition lifecycle:

1. `swup:transitionStart` - Fired when a transition starts
2. `swup:transitionEnd` - Fired when a transition completes

Usage example:

```javascript
window.addEventListener('swup:transitionStart', () => {
  // Do something at the start of transition
  console.log('Transition started');
});

window.addEventListener('swup:transitionEnd', () => {
  // Do something when transition ends
  console.log('Transition completed');
});
```

## Integration with Animations

The View Transitions system is designed to work seamlessly with other animations in the Webflow 3D project:

1. When a transition starts, all existing animations are cleaned up
2. When a transition ends, all components and animations are reinitialized
3. Scroll-based animations are properly reset

This ensures a clean slate for each page without animation conflicts or memory leaks.

## Customizing Transitions

To customize the default transition effects:

1. Open `src/features/transitions/views/viewTransitions.ts`
2. Modify the GSAP animations in the `out` and `in` functions:

```javascript
// Example: Change to a different transition effect
out: async (done) => {
  await gsap.to('#swup', {
    opacity: 0,
    y: -50, // Move up instead of scale
    duration: 0.5, // Faster transition
    ease: 'power1.out', // Different easing
    overwrite: true,
  });
  done();
},
in: async (done) => {
  await gsap.fromTo(
    '#swup',
    { opacity: 0, y: 50 }, // Start from below
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power1.out',
      overwrite: true,
      onComplete: () => {
        done();
      },
    }
  );
},
```

## Troubleshooting

### Common Issues

1. **Transitions Not Working**

   - Ensure your main content is wrapped in an element with ID `swup`
   - Check that internal links don't have `target="_blank"` attribute
   - Verify that GSAP is properly loaded

2. **Flickering During Transitions**

   - Try setting `will-change: transform, opacity;` on the `#swup` element
   - Ensure there are no competing animations

3. **Components Not Working After Transition**

   - Make sure all components are initialized in the `swup:transitionEnd` handler
   - Check the browser console for errors

4. **Scroll Position Issues**
   - The system automatically scrolls to top on transition
   - For custom scroll behavior, modify the handlers in `src/index.ts`

### Debug Mode

To enable detailed logging for troubleshooting:

```javascript
// Add this to activate debug mode
if (typeof window !== 'undefined') {
  window.SWUP_DEBUG = true;
}
```

## Advanced Usage

### Custom Transitions by Route

You can create different transitions for specific routes by adding more animation rules:

```javascript
animations: [
  // Home to About transition
  {
    from: '/home',
    to: '/about',
    out: async (done) => {
      // Special transition for this route
    },
    in: async (done) => {
      // Special incoming animation
    },
  },
  // Default transition for all other routes
  {
    from: '(.*)',
    to: '(.*)',
    out: async (done) => {
      // Default transition
    },
    in: async (done) => {
      // Default incoming animation
    },
  },
],
```

The routes use regex matching, so you can create sophisticated patterns as needed.
