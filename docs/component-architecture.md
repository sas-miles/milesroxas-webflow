# Component Architecture Documentation

## Overview

This document describes the component architecture pattern used in the Webflow-3D project. This pattern organizes components in a scalable, maintainable way that works seamlessly with page transitions.

## Directory Structure

```
src/
├── components/
│   ├── index.ts          # Barrel file for all component exports and initialization
│   ├── ComponentName.ts  # Individual component files
│   └── ...
├── features/             # Feature modules (scroll, sliders, transitions, etc.)
└── index.ts              # Main application entry point
```

## Components Organization

### 1. Component Files

Each component is defined in its own file with a clear responsibility:

```typescript
// src/components/ComponentName.ts
import gsap from 'gsap';

/**
 * Description of what this component does
 */
export const initComponentName = (): void => {
  // Component initialization logic
  // DOM selection, event listeners, animations, etc.
};

export default initComponentName;
```

### 2. Components Barrel File (index.ts)

The components directory includes an `index.ts` file that:

- Imports all component initializers
- Re-exports them for individual use
- Provides a centralized `initComponents()` function

```typescript
// src/components/index.ts

// Import components
import { initComponentA } from './ComponentA';
import { initComponentB } from './ComponentB';
// ... other imports

// Export individual components for direct use if needed
export { initComponentA, initComponentB };

/**
 * Initialize all components
 * This centralizes component initialization in one place
 */
export const initComponents = (): void => {
  // Initialize all components
  initComponentA();
  initComponentB();
  // ... initialize other components
};
```

### 3. Main Application Integration

The main `index.ts` file imports only the `initComponents` function:

```typescript
// src/index.ts
import { initComponents } from './components';
// ... other imports

window.Webflow ||= [];
window.Webflow.push(() => {
  // Initial component initialization
  initComponents();

  // Re-initialize after page transitions
  const handleTransitionEnd = () => {
    // ... transition handling code
    initComponents();
    // ... other re-initialization
  };

  // Add event listeners
  window.addEventListener('swup:transitionEnd', handleTransitionEnd);
});
```

## Adding New Components

Follow these steps to add a new component:

1. **Create the component file**

   ```typescript
   // src/components/NewComponent.ts
   export const initNewComponent = (): void => {
     // Component initialization code
   };

   export default initNewComponent;
   ```

2. **Update the components index.ts file**

   ```typescript
   // src/components/index.ts

   // Add import
   import { initNewComponent } from './NewComponent';

   // Add export
   export { initNewComponent };

   // Add to initialization function
   export const initComponents = (): void => {
     // Existing initializations
     initFooterToggle();

     // Add new component initialization
     initNewComponent();
   };
   ```

3. **That's it!** No changes are needed in the main index.ts file.

## Best Practices

### Component Scope

- Each component should have a single responsibility
- Components should be independent of each other when possible
- Use selectors that are specific to your component (classes, IDs)

### DOM Queries

- Always check if elements exist before working with them
- Use consistent selector patterns (classes for styling, IDs for JS hooks)

```typescript
export const initComponent = (): void => {
  const element = document.querySelector('.my-element');
  if (!element) return; // Exit early if element doesn't exist

  // Rest of component logic
};
```

### Animations

- Clean up animations when appropriate
- Use consistent animation patterns

### Page Transitions

Components are automatically re-initialized after page transitions because:

1. The main `index.ts` file calls `initComponents()` on initial load
2. The transition end handler also calls `initComponents()`

### Cleanup

For components that need cleanup (event listeners, animations):

```typescript
export const initComponent = (): void => {
  // Setup code

  // Store cleanup functions on window for later use
  window.cleanupFunctions = window.cleanupFunctions || {};
  window.cleanupFunctions.componentName = () => {
    // Cleanup code (remove event listeners, kill animations)
  };
};
```

Then in main `index.ts` beforeunload handler:

```typescript
window.addEventListener('beforeunload', () => {
  // Run any registered cleanup functions
  if (window.cleanupFunctions) {
    Object.values(window.cleanupFunctions).forEach((cleanup) => cleanup());
  }

  // Other cleanup
});
```

## Example: Complete Component Flow

1. **Create src/components/Accordion.ts**

   ```typescript
   import gsap from 'gsap';

   export const initAccordion = (): void => {
     const accordions = document.querySelectorAll('.accordion');

     if (!accordions.length) return;

     accordions.forEach((accordion) => {
       const toggle = accordion.querySelector('.accordion-toggle');
       const content = accordion.querySelector('.accordion-content');

       if (!toggle || !content) return;

       // Set initial state
       gsap.set(content, { height: 0 });

       toggle.addEventListener('click', () => {
         const isOpen = accordion.classList.contains('open');

         if (isOpen) {
           // Close accordion
           gsap.to(content, { height: 0, duration: 0.3 });
           accordion.classList.remove('open');
         } else {
           // Open accordion
           gsap.to(content, { height: 'auto', duration: 0.3 });
           accordion.classList.add('open');
         }
       });
     });
   };

   export default initAccordion;
   ```

2. **Update src/components/index.ts**

   ```typescript
   import { initAccordion } from './Accordion';
   import { initFooterToggle } from './FooterToggle';

   export { initAccordion, initFooterToggle };

   export const initComponents = (): void => {
     initFooterToggle();
     initAccordion();
   };
   ```

3. **Done!** The component will now be initialized on page load and after transitions.

## Troubleshooting

- **Component not working after page transition:**

  - Make sure it's properly added to `initComponents()`
  - Check for errors in the console
  - Verify that DOM elements exist in the new page

- **Animations not working:**
  - Check that GSAP is properly imported
  - Verify that DOM elements exist
  - Ensure ScrollTrigger is refreshed after transitions
