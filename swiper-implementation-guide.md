# Webflow 3D - Swiper Implementation Guide

This guide provides a comprehensive overview of the Swiper slider implementation in the Webflow 3D project. The system utilizes Swiper.js, a modern touch slider, with a custom configuration system based on data attributes.

## Table of Contents

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Slider Types](#slider-types)
- [Configuration Options](#configuration-options)
- [Customization](#customization)
- [Lenis Integration](#lenis-integration)
- [Advanced Features](#advanced-features)
- [Troubleshooting](#troubleshooting)

## Installation

The project uses Swiper.js version 11.2.6. It's already included in the project dependencies.

```bash
# If you need to install it manually:
pnpm add swiper@11.2.6
```

## Basic Usage

The slider system is designed to work with minimal HTML markup using data attributes. Here's a basic example:

```html
<div data-swiper data-swiper-type="default" class="swiper">
  <div class="swiper-wrapper">
    <div data-swiper-slide class="swiper-slide">Slide 1</div>
    <div data-swiper-slide class="swiper-slide">Slide 2</div>
    <div data-swiper-slide class="swiper-slide">Slide 3</div>
  </div>

  <!-- Navigation arrows -->
  <div data-swiper-prev class="swiper-button-prev"></div>
  <div data-swiper-next class="swiper-button-next"></div>

  <!-- Pagination dots -->
  <div data-swiper-pagination class="swiper-pagination"></div>
</div>
```

### Key Data Attributes

- `data-swiper` - Identifies the container element as a Swiper slider
- `data-swiper-slide` - Identifies each slide
- `data-swiper-prev` - Previous navigation button
- `data-swiper-next` - Next navigation button
- `data-swiper-pagination` - Pagination container
- `data-swiper-type` - Determines the slider configuration preset (default, youtube, testimonial, etc.)

## Slider Types

The system supports multiple pre-configured slider types using a configuration pattern:

1. **default** - Standard single-slide slider

   ```html
   <div data-swiper data-swiper-type="default" class="swiper">
     <!-- Slider content -->
   </div>
   ```

2. **youtube** - Optimized for video content with responsive layout

   ```html
   <div data-swiper data-swiper-type="youtube" class="swiper">
     <!-- Video slides -->
   </div>
   ```

   - Mobile: 1 slide with 20px spacing
   - Tablet/Desktop: 2 slides with no spacing
   - Centered slides for focus

3. **testimonial** - Fade effect slider with autoplay

   ```html
   <div data-swiper data-swiper-type="testimonial" class="swiper">
     <!-- Testimonial slides -->
   </div>
   ```

   - Fade transition effect
   - 3-second autoplay interval
   - 800ms transition speed

4. **work** - Portfolio/Work showcase slider

   ```html
   <div data-swiper data-swiper-type="work" class="swiper">
     <!-- Work/portfolio slides -->
   </div>
   ```

   - Adaptive slide sizing with auto width
   - Dynamic spacing based on breakpoints
   - Centered slides on larger screens

5. **gallery** - Image gallery slider
   ```html
   <div data-swiper data-swiper-type="gallery" class="swiper">
     <!-- Gallery image slides -->
   </div>
   ```
   - Mobile: 1.5 slides visible (peek effect) with 20px spacing
   - Tablet/Desktop: 1 slide visible with 40px spacing
   - Centered slides for focus

## Implementation Architecture

The Swiper implementation uses a configuration pattern for better maintainability:

```typescript
// Slider type configurations
const sliderConfigs: Record<string, (config: SwiperOptions) => SwiperOptions> = {
  default: (config) => config,

  youtube: (config) => ({
    ...config,
    slidesPerView: 1,
    spaceBetween: 20,
    centeredSlides: true,
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 0,
      },
    },
  }),

  // Other configurations...
};
```

This approach makes it easy to add new slider types and customize existing ones.

## Configuration Options

Each slider type comes with default settings, but you can override them with specific data attributes if needed:

```html
<div
  data-swiper
  data-swiper-type="youtube"
  data-slides-per-view="2"
  data-space-between="10"
  data-loop="false"
  data-autoplay="true"
  data-speed="800"
  data-effect="slide"
>
  <!-- Slides here -->
</div>
```

### Common Configuration Options

| Option                 | Default   | Description                                 |
| ---------------------- | --------- | ------------------------------------------- |
| `data-swiper-type`     | "default" | Predefined slider configuration             |
| `data-slides-per-view` | 1         | Number of slides visible at once            |
| `data-space-between`   | 30        | Space between slides (px)                   |
| `data-loop`            | true      | Enables continuous loop mode                |
| `data-speed`           | 500       | Transition speed in milliseconds            |
| `data-effect`          | "slide"   | Transition effect (slide, fade, cube, etc.) |
| `data-autoplay`        | false     | Enables autoplay (true/false)               |
| `data-autoplay-delay`  | 3000      | Autoplay delay between slides (ms)          |
| `data-centered-slides` | false     | Centers active slide                        |

## Lenis Integration

The Swiper implementation includes built-in compatibility with Lenis smooth scrolling:

```typescript
// Lenis compatibility
nested: true,
mousewheel: false,
touchReleaseOnEdges: true,
```

These settings ensure that:

- Sliders work properly inside scrollable content
- Mouse wheel events don't conflict with Lenis scrolling
- Touch gestures allow scrolling when reaching the edges of a slider

## Adding New Slider Types

To add a new slider type:

1. Open `src/features/sliders/multipleSwiper.ts`
2. Add your new configuration to the `sliderConfigs` object:

```typescript
const sliderConfigs = {
  // Existing configs...

  'my-new-type': (config) => ({
    ...config,
    slidesPerView: 2,
    spaceBetween: 20,
    // Add other configuration options
    breakpoints: {
      768: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
    },
  }),
};
```

3. If needed, import additional Swiper modules at the top of the file:

```typescript
import { Autoplay, EffectFade, Navigation, Pagination, EffectCube } from 'swiper/modules';
```

4. Use in HTML with `data-swiper-type="my-new-type"`

## Advanced Features

### Lazy Loading Images

For better performance with image-heavy sliders:

```html
<div data-swiper data-swiper-type="gallery" class="swiper">
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      <img src="placeholder.jpg" data-src="actual-image.jpg" class="swiper-lazy" />
      <div class="swiper-lazy-preloader"></div>
    </div>
    <!-- More slides -->
  </div>
</div>
```

### Custom Navigation

You can style the navigation elements any way you want:

```html
<div data-swiper data-swiper-type="default" class="swiper">
  <div class="swiper-wrapper">
    <!-- Slides -->
  </div>

  <!-- Custom navigation -->
  <button data-swiper-prev class="my-custom-prev-button">
    <svg><!-- SVG icon --></svg>
  </button>
  <button data-swiper-next class="my-custom-next-button">
    <svg><!-- SVG icon --></svg>
  </button>
</div>
```

### Multiple Sliders

The system automatically initializes all sliders with the `data-swiper` attribute on the page:

```javascript
const swipers = initAllSwipers();
```

This returns an array of all initialized Swiper instances that you can reference later if needed.

## Troubleshooting

### Common Issues

1. **Slider Not Initializing**

   - Check that you've added the `data-swiper` attribute
   - Verify that the HTML structure follows Swiper requirements
   - Check browser console for errors

2. **Navigation/Pagination Not Working**

   - Ensure you've added the correct data attributes for navigation/pagination
   - Check that the elements exist in the DOM
   - Verify that the required Swiper modules are imported

3. **Responsive Issues**

   - Check the breakpoints configuration
   - Test with browser dev tools in responsive mode

4. **Conflicts with Lenis**

   - Ensure the Lenis compatibility settings are applied
   - Try setting `nested: true` explicitly

5. **Performance Issues**
   - Use lazy loading for image-heavy sliders
   - Consider reducing the number of slides or complexity of slide content
   - Enable hardware acceleration with CSS: `transform: translateZ(0);`

---

This guide covers the essential aspects of the Swiper implementation in the Webflow 3D project. For more advanced usage, refer to the [official Swiper documentation](https://swiperjs.com/swiper-api).
