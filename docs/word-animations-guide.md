# Webflow 3D - Word Animations Guide

## Overview

The Word Animations feature provides scroll-triggered text animations that create an engaging 3D effect. This guide explains how to implement and customize these animations in your Webflow projects.

## Table of Contents

- [Basic Implementation](#basic-implementation)
- [How It Works](#how-it-works)
- [Animation Options](#animation-options)
- [Performance Considerations](#performance-considerations)
- [Troubleshooting](#troubleshooting)
- [Advanced Usage](#advanced-usage)

## Basic Implementation

To add word animations to your Webflow site:

1. Add the `data-word-animation` attribute to any text element you want to animate:

```html
<h1 data-word-animation>Animate This Heading</h1>
<p data-word-animation>This paragraph will be animated word by word as the user scrolls.</p>
```

2. No additional configuration is needed - the animations will automatically be applied when the user scrolls.

## How It Works

The word animation system uses the following technologies:

- **GSAP** for smooth animations
- **ScrollTrigger** for scroll-based triggering
- **SplitType** for splitting text into words

When a user scrolls to a text element with the `data-word-animation` attribute:

1. The text is split into individual words
2. A scroll-linked timeline is created for the element
3. As the user scrolls, words animate outward in a 3D effect (flying away and fading out)
4. The element is pinned during the animation to ensure it remains in view

## Animation Options

You can customize the animation behavior with additional attribute values:

```html
<!-- Basic animation -->
<h1 data-word-animation="true">Default Animation</h1>

<!-- Custom ID for the animation (good for debugging) -->
<h1 data-word-animation="my-custom-title">Custom ID</h1>
```

## Technical Implementation

The word animations are implemented in a clean, modular way that efficiently handles lifecycle management:

```typescript
export const animateWords = (
  el: HTMLElement
): { timeline: gsap.core.Timeline; scrollTrigger: ScrollTrigger } => {
  // Create a stable ID for the element
  const elementId = el.id || `word-anim-${Date.now()}`;
  if (!el.id) el.id = elementId;

  // Clean up any existing animation on this element
  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger.vars.trigger === el) trigger.kill();
  });

  // Split the text
  const split = new SplitType(el, {
    types: 'lines,words',
    tagName: 'span',
  });

  const lines = split.lines || [];

  // Create the animation timeline
  const tl = gsap.timeline({
    paused: true,
  });

  // Set perspective for 3D animation
  tl.set(el, { perspective: 1000 });

  // Animate each line of words
  for (const [linepos, line] of lines.entries()) {
    const words = line.querySelectorAll('.word');
    if (words.length === 0) continue;

    // Set up 3D properties
    gsap.set(line, {
      transformStyle: 'preserve-3d',
      position: 'relative',
      display: 'block',
    });

    // Animate words
    tl.to(
      words,
      {
        opacity: 0,
        xPercent: (pos, _, arr) => {
          const center = arr.length / 2;
          return pos < center
            ? -40 - Math.abs(pos - center) * 10
            : 40 + Math.abs(pos - center) * 10;
        },
        yPercent: -100,
        rotationY: (pos, _, arr) => {
          const center = arr.length / 2;
          return pos < center ? -15 : 15;
        },
        z: 20,
        stagger: {
          each: 0.05,
          from: 'center',
        },
      },
      linepos * 0.1
    );
  }

  // Create the ScrollTrigger
  const st = ScrollTrigger.create({
    id: `word-animation-${elementId}`,
    trigger: el,
    start: 'top center',
    end: 'bottom top',
    scrub: 1,
    pin: true,
    animation: tl,
  });

  // Return both timeline and ScrollTrigger for cleanup
  return { timeline: tl, scrollTrigger: st };
};
```

## Performance Considerations

The word animations use advanced GSAP features and DOM manipulation, so keep these performance considerations in mind:

1. **Limit the number of animated elements** on a single page (5-7 max is recommended)
2. **Avoid animating extremely long paragraphs** (performance degrades with many words)
3. **Test on mobile devices** to ensure smooth performance
4. **Consider disabling on low-powered devices** with a feature detection strategy

## Troubleshooting

### Common Issues

1. **Animation Not Appearing**

   - Ensure the element has the `data-word-animation` attribute
   - Check that the element contains text content
   - Verify that ScrollTrigger is properly initialized

2. **Animation Looks Choppy**

   - Try reducing the number of animated elements on the page
   - Simplify the text content (fewer words)
   - Check for other heavy animations or scripts running simultaneously

3. **Text Flickers During Animation**

   - This can happen due to font loading issues
   - Ensure fonts are properly loaded before animations start
   - Try adding a small delay before initializing animations

4. **Text Appears Unstyled Briefly**
   - This can happen when SplitType reflows the text
   - Consider adding a fade-in transition to the element

## Advanced Usage

### Customizing Animation Parameters

For advanced customization, you can modify the animation parameters in the source code:

1. Open `src/features/scroll/animations/wordAnimation.ts`
2. Modify the animation properties to achieve different effects:

```typescript
// Example: Change the animation to move words upward instead of outward
tl.to(
  words,
  {
    opacity: 0,
    y: -100, // Move up instead of outward
    ease: 'power3.in',
    stagger: {
      each: 0.03,
      from: 'start', // Animate from first word to last
    },
  },
  linepos * 0.1
);
```

### Integration with Page Transitions

The word animations are designed to work seamlessly with page transitions:

1. When a page transition starts, animations are automatically cleaned up
2. When the new page loads, animations are reinitialized
3. This ensures a clean state for each page without memory leaks

### Customizing ScrollTrigger Behavior

You can adjust when and how the animations trigger by modifying the ScrollTrigger parameters:

```typescript
const st = ScrollTrigger.create({
  id: `word-animation-${elementId}`,
  trigger: el,
  start: 'top 80%', // Start animation when element is 80% into view
  end: '+=400', // End animation 400px after the start point
  scrub: 0.5, // Smoother scrubbing (lower value = smoother)
  pin: false, // Disable pinning if desired
  animation: tl,
});
```

### Progressive Enhancement

For a more accessible approach, consider implementing progressive enhancement:

```typescript
// Check if user prefers reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Apply simpler animation or none at all
if (prefersReducedMotion) {
  // Simple fade instead of 3D animation
  tl.to(words, {
    opacity: 0,
    stagger: 0.02,
  });
}
```
