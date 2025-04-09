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

The system supports multiple pre-configured slider types:

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

   - Mobile: 2 slides visible with 30px spacing
   - Tablet/Desktop: 3 slides visible with 24px spacing
   - Centered slides for focus

5. **gallery** - Image gallery slider
   ```html
   <div data-swiper data-swiper-type="gallery" class="swiper">
     <!-- Gallery image slides -->
   </div>
   ```
   - Mobile: 1.5 slides visible (peek effect) with 20px spacing
   - Tablet/Desktop: 1 slide visible with 40px spacing
   - Centered slides for focus

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

## Key Styles

The Swiper implementation requires some basic CSS styles to function properly. The core styles are imported directly in the implementation:

```typescript
import 'swiper/css'; // Core Swiper styles
import 'swiper/css/navigation'; // Navigation module styles
import 'swiper/css/pagination'; // Pagination module styles
import 'swiper/css/effect-fade'; // Fade effect styles
```

### Essential CSS Classes

For proper functioning, these classes should be present:

```css
/* Container */
.swiper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

/* Wrapper for slides */
.swiper-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
  transition-property: transform;
  box-sizing: content-box;
}

/* Individual slide */
.swiper-slide {
  flex-shrink: 0;
  width: 100%;
  height: 100%;
  position: relative;
  transition-property: transform;
}

/* Navigation arrows */
.swiper-button-prev,
.swiper-button-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  cursor: pointer;
}

.swiper-button-prev {
  left: 10px;
}

.swiper-button-next {
  right: 10px;
}

/* Pagination bullets */
.swiper-pagination {
  position: absolute;
  text-align: center;
  bottom: 10px;
  width: 100%;
  z-index: 10;
}

.swiper-pagination-bullet {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #000;
  opacity: 0.2;
  margin: 0 4px;
  cursor: pointer;
}

.swiper-pagination-bullet-active {
  opacity: 1;
  background: #007aff;
}
```

### Responsive Considerations

For mobile-friendly sliders:

```css
@media (max-width: 768px) {
  .swiper-button-prev,
  .swiper-button-next {
    width: 30px;
    height: 30px;
  }

  .swiper-pagination-bullet {
    width: 6px;
    height: 6px;
  }
}
```

### Custom Style Examples

#### Testimonial Slider Style

```css
.testimonial-swiper .swiper-slide {
  opacity: 0;
  transition: opacity 0.8s ease;
}

.testimonial-swiper .swiper-slide-active {
  opacity: 1;
}

.testimonial-swiper .swiper-pagination {
  bottom: -30px;
}

.testimonial-swiper .swiper-pagination-bullet {
  background: #ddd;
}

.testimonial-swiper .swiper-pagination-bullet-active {
  background: #333;
}
```

#### Gallery Slider Style

```css
.gallery-swiper .swiper-slide {
  transition: transform 0.3s ease;
  transform: scale(0.8);
}

.gallery-swiper .swiper-slide-active {
  transform: scale(1);
}

.gallery-swiper .swiper-button-prev,
.gallery-swiper .swiper-button-next {
  color: white;
  background: rgba(0, 0, 0, 0.5);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

## Default Swiper Type Review

The default swiper type is the base configuration for all sliders. When you use `data-swiper-type="default"` or don't specify a type, this configuration is applied.

### Default Configuration

```typescript
// Basic configuration with defaults
const config: SwiperOptions = {
  modules: [Navigation, Pagination],
  slidesPerView: 1,
  spaceBetween: 30,
  loop: true,
  speed: 500,

  // Lenis compatibility
  nested: true,
  mousewheel: false,
  touchReleaseOnEdges: true,

  // Navigation
  navigation:
    prevButton && nextButton
      ? {
          prevEl: prevButton,
          nextEl: nextButton,
        }
      : false,

  // Pagination
  pagination: paginationEl
    ? {
        el: paginationEl,
        clickable: true,
      }
    : false,
};
```

### Key Features of Default Type

1. **Single Slide View**: `slidesPerView: 1` shows one slide at a time
2. **Moderate Spacing**: `spaceBetween: 30` provides 30px gap between slides
3. **Continuous Loop**: `loop: true` enables infinite sliding
4. **Medium Transition Speed**: `speed: 500` creates a balanced transition (500ms)
5. **Optional Navigation**: Adds prev/next buttons if elements with appropriate data attributes exist
6. **Optional Pagination**: Adds pagination dots if an element with the pagination data attribute exists
7. **No Autoplay**: Default type doesn't automatically advance slides
8. **Lenis Compatibility**: Special settings to work with Lenis smooth scrolling

### Best Practices for Default Type

1. **Use for General Content**: The default type works well for general content sliders where you want to show one item at a time.

2. **Consider Container Width**: Since `slidesPerView: 1`, the slider will take the full width of its container.

3. **Navigation Placement**: For best UX, place navigation buttons (`data-swiper-prev` and `data-swiper-next`) outside the slide content but within the swiper container.

4. **Add Custom Classes**: If you need to target this slider specifically with CSS, add custom classes alongside the required ones:

   ```html
   <div data-swiper data-swiper-type="default" class="swiper my-custom-slider"></div>
   ```

5. **Responsive Adjustments**: The default type doesn't have built-in responsive breakpoints. Add them as needed:
   ```html
   <div
     data-swiper
     data-swiper-type="default"
     class="swiper"
     data-breakpoints='{"768":{"spaceBetween":15},"1200":{"spaceBetween":40}}'
   ></div>
   ```

### Common Modifications

If you need to adjust the default type slightly, use data attributes:

```html
<div
  data-swiper
  data-swiper-type="default"
  data-loop="false"
  data-speed="300"
  data-space-between="10"
  class="swiper"
>
  <!-- Slides here -->
</div>
```

### Potential Issues

1. **Height Calculation**: By default, swiper calculates height based on the tallest slide. If slides have different heights, consider:

   - Setting a fixed height on the swiper container
   - Using `data-auto-height="true"` for dynamic height (may cause jumpy transitions)

2. **Touch Interaction**: If the slider seems to capture all touch events and prevents scrolling, check:

   - `touchReleaseOnEdges` setting (default is true for compatibility)
   - Consider `data-allow-touch-move="false"` if it's an issue on mobile

3. **Overflow Behavior**: If the entire slider moves when trying to slide, check for:
   - Proper CSS structure ensuring `.swiper` has `overflow: hidden`
   - No conflicting CSS overriding swiper's default behavior

### When to Choose a Different Type

Consider using a specialized type instead of default when:

1. **Showcasing Multiple Items**: Use `work` or `youtube` types for showing multiple items
2. **Fade Transitions**: Use `testimonial` type for fade effects
3. **Gallery with Peek**: Use `gallery` type for creating peek effects (seeing part of next/prev slide)

## Customization

### Adding a New Slider Type

To add a custom slider type, modify the `multipleSwiper.ts` file:

1. Open `src/features/sliders/multipleSwiper.ts`
2. Add your new configuration in the type-specific settings section:

```typescript
// Apply type-specific settings
if (swiperType === 'your-new-type') {
  config.slidesPerView = 2;
  config.spaceBetween = 20;
  config.centeredSlides = true;

  // Add any modules you need
  config.modules?.push(EffectCoverflow, Autoplay);

  // Add breakpoints for responsive design
  config.breakpoints = {
    768: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
    1200: {
      slidesPerView: 4,
      spaceBetween: 40,
    },
  };
}
```

3. Import any additional Swiper modules at the top of the file
4. Use in HTML with `data-swiper-type="your-new-type"`

### Custom Event Handlers

For advanced usage, you can extend the slider initialization:

```typescript
// In a custom script
import { initSwiper } from './features/sliders/multipleSwiper';

// Get your slider element
const mySlider = document.querySelector('[data-my-custom-slider]');

// Initialize with the system
if (mySlider) {
  const swiperInstance = initSwiper(mySlider as HTMLElement);

  // Add custom events
  swiperInstance.on('slideChange', () => {
    console.log('Slide changed to', swiperInstance.activeIndex);
    // Your custom logic here
  });
}
```

## Lenis Integration

The slider system is designed to work seamlessly with Lenis smooth scrolling. Key integration features:

```typescript
// Lenis compatibility settings in the slider config
{
  nested: true, // Tells Swiper it's inside scrollable content
  mousewheel: false, // Disable mousewheel to prevent conflicts with Lenis
  touchReleaseOnEdges: true, // Allow scrolling when reaching slider edges
}
```

This ensures that:

- Sliders function properly inside Lenis smooth-scrolled content
- Touch and mouse interactions work correctly without blocking page scrolling
- The overall experience remains smooth when combining sliders and page scrolling

## Advanced Features

### Accessing Swiper Instances

You can access all initialized Swiper instances:

```typescript
import { initAllSwipers } from './features/sliders';

// Initialize and get all sliders
const allSwipers = initAllSwipers();

// Access a specific slider
const firstSlider = allSwipers[0];
```

### Lazy Loading

For better performance with image-heavy sliders, enable lazy loading:

```html
<div data-swiper>
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      <img data-src="image1.jpg" class="swiper-lazy" />
      <div class="swiper-lazy-preloader"></div>
    </div>
    <!-- More slides -->
  </div>
</div>
```

## Troubleshooting

### Common Issues

1. **Slider not initializing**

   - Ensure proper HTML structure with `data-swiper` attribute
   - Check console for errors
   - Verify that initialization code runs after the DOM is ready

2. **Navigation buttons not working**

   - Ensure elements have proper data attributes: `data-swiper-prev` and `data-swiper-next`
   - Check that buttons are inside the slider container or properly referenced

3. **Responsive settings not applying**

   - Verify breakpoint values in the configuration
   - Test with browser dev tools in responsive mode

4. **Conflicts with Lenis scroll**
   - Ensure Lenis is properly initialized after sliders
   - Verify `nested: true` and other Lenis compatibility settings

### Performance Optimization

For optimal performance:

1. Use lazy loading for image-heavy sliders
2. Consider reduced motion for users with that preference
3. Use appropriate image sizes and optimize them for web

---

This guide covers the essential aspects of the Swiper implementation in the Webflow 3D project. For more advanced usage, refer to the [official Swiper documentation](https://swiperjs.com/swiper-api).
