// Import only the necessary Swiper styles
import 'swiper/css'; // Core Swiper CSS
import 'swiper/css/navigation'; // Navigation module CSS
import 'swiper/css/pagination'; // Pagination module CSS
import 'swiper/css/effect-fade'; // Fade effect CSS

import Swiper from 'swiper';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import type { SwiperOptions } from 'swiper/types';

import { ATTRIBUTE } from '../../lib/dataAttributes';
import { getAttributes } from '../../utils/attributes';

// Define type for swiper configurations
interface SwiperTypeConfig extends SwiperOptions {
  slidesPerView: number | 'auto';
  spaceBetween: number;
  loop: boolean;
  autoplay: boolean;
  speed: number;
  effect: 'slide' | 'fade';
  centeredSlides?: boolean;
  grabCursor?: boolean;
}

// Define swiper type configurations
const SWIPER_CONFIGS: Record<string, SwiperTypeConfig> = {
  default: {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: false,
    speed: 500,
    effect: 'slide',
    grabCursor: true,
    breakpoints: {
      // when window width is >= 768px (tablet/desktop)
      768: {
        slidesPerView: 1,
        spaceBetween: 30,
      },
    },
  },
  youtube: {
    slidesPerView: 1, // Default for mobile
    spaceBetween: 20, // Smaller space for mobile
    loop: true,
    autoplay: false,
    speed: 150,
    effect: 'slide',
    grabCursor: true,
    centeredSlides: true,
    breakpoints: {
      // when window width is >= 768px (tablet/desktop)
      768: {
        slidesPerView: 2, // 2 slides for desktop
        spaceBetween: 60,
      },
    },
  },
  testimonial: {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    autoplay: true,
    speed: 800,
    effect: 'fade',
    grabCursor: true,
  },
  product: {
    slidesPerView: 1.2, // Show a bit of the next slide on mobile
    spaceBetween: 16, // Less space on mobile
    loop: true,
    autoplay: false,
    speed: 500,
    effect: 'slide',
    centeredSlides: true,
    grabCursor: true,
    breakpoints: {
      // when window width is >= 768px (tablet/desktop)
      768: {
        slidesPerView: 'auto',
        spaceBetween: 24,
      },
    },
  },
  gallery: {
    slidesPerView: 1,
    spaceBetween: 20, // Less space for mobile
    loop: true,
    autoplay: false,
    speed: 500,
    effect: 'slide', // Simplify to just slide effect for better performance
    centeredSlides: true,
    grabCursor: true,
    breakpoints: {
      // when window width is >= 768px (tablet/desktop)
      768: {
        spaceBetween: 40,
        slidesPerView: 1,
      },
    },
  },
};

/**
 * Initialize a swiper with type-specific configuration
 * @param {HTMLElement} element - The container element for the slider
 * @returns {Swiper} The initialized Swiper instance
 */
export const initTypedSwiper = (element: HTMLElement): Swiper => {
  // Find navigation and pagination elements within the slider container
  const prevButton = element.querySelector(`[${ATTRIBUTE.swiperNavPrev}]`) as HTMLElement | null;
  const nextButton = element.querySelector(`[${ATTRIBUTE.swiperNavNext}]`) as HTMLElement | null;
  const paginationEl = element.querySelector(
    `[${ATTRIBUTE.swiperPagination}]`
  ) as HTMLElement | null;

  // Get slider type and configuration
  const swiperType = element.dataset.swiperType || 'default';
  const defaultConfig =
    SWIPER_CONFIGS[swiperType as keyof typeof SWIPER_CONFIGS] || SWIPER_CONFIGS.default;

  // Get custom configuration from data attributes (overrides default config)
  const {
    slidesPerView = String(defaultConfig.slidesPerView),
    spaceBetween = String(defaultConfig.spaceBetween),
    loop = String(defaultConfig.loop),
    autoplay = String(defaultConfig.autoplay),
    speed = String(defaultConfig.speed),
    effect = defaultConfig.effect,
    centeredSlides = defaultConfig.centeredSlides ? 'true' : 'false',
    // Add mobile-specific data attributes with fallbacks to desktop values
    mobileSlidesPer = slidesPerView,
    mobileSpaceBetween = spaceBetween,
  } = element.dataset;

  // Only load required modules for better performance
  const moduleList = [Navigation, Pagination];

  if (autoplay === 'true') {
    moduleList.push(Autoplay);
  }

  // Only add EffectFade if we actually need it
  if (effect === 'fade') {
    moduleList.push(EffectFade);
  }

  // Parse mobile values
  const parsedMobileSlidesPer = mobileSlidesPer === 'auto' ? 'auto' : parseFloat(mobileSlidesPer);
  const parsedMobileSpaceBetween = parseInt(mobileSpaceBetween, 10);

  // Parse desktop values
  const parsedDesktopSlidesPer = slidesPerView === 'auto' ? 'auto' : parseFloat(slidesPerView);
  const parsedDesktopSpaceBetween = parseInt(spaceBetween, 10);

  // Base configuration with performance optimizations
  const config: SwiperOptions & {
    preloadImages?: boolean;
    updateOnImagesReady?: boolean;
    resizeObserver?: boolean;
  } = {
    modules: moduleList,
    slidesPerView: parsedMobileSlidesPer, // Default to mobile view
    spaceBetween: parsedMobileSpaceBetween, // Default to mobile spacing
    loop: loop === 'true',
    // Add additional loop options to address translation issues
    ...(loop === 'true' && {
      loopAdditionalSlides: 1,
      loopedSlides: parsedMobileSlidesPer === 'auto' ? 1 : Number(parsedMobileSlidesPer),
      loopPreventsSlide: true,
    }),
    effect: effect as 'slide' | 'fade',
    speed: parseInt(speed, 10),
    autoplay:
      autoplay === 'true'
        ? {
            delay: 3000,
            disableOnInteraction: false,
          }
        : false,
    grabCursor: true,
    centeredSlides: centeredSlides === 'true',
    threshold: 10, // Increase to make drag less sensitive

    // Performance optimizations
    updateOnWindowResize: true, // Only update on window resize
    observer: true, // Enable observer for better reactivity to DOM changes
    observeParents: true,
    preloadImages: false, // Improve performance by not preloading all images
    updateOnImagesReady: false, // Don't update layout when images load
    resizeObserver: false, // Disable resize observer for performance

    // Ensure swiper doesn't interfere with scroll events
    preventInteractionOnTransition: true,
    mousewheel: false,
    nested: true, // Tell Swiper it's nested inside scrollable content
    simulateTouch: true,
    touchReleaseOnEdges: true, // Allow scrolling when reaching edges

    // Setup navigation if buttons exist
    navigation:
      prevButton && nextButton
        ? {
            prevEl: prevButton,
            nextEl: nextButton,
          }
        : false,

    // Setup pagination if element exists
    pagination: paginationEl
      ? {
          el: paginationEl,
          clickable: true,
        }
      : false,
  };

  // Special handling for YouTube type to force correct breakpoints
  if (swiperType === 'youtube') {
    config.breakpoints = {
      768: {
        slidesPerView: 2, // Force 2 slides for desktop
        spaceBetween: 60,
      },
    };
  } else {
    // For other types, use standard breakpoints configuration
    config.breakpoints = {
      768: {
        slidesPerView: parsedDesktopSlidesPer,
        spaceBetween: parsedDesktopSpaceBetween,
        effect: effect as 'slide' | 'fade',
      },
    };
  }

  // Merge with predefined breakpoints from SWIPER_CONFIGS if they exist
  if (defaultConfig.breakpoints && config.breakpoints && swiperType !== 'youtube') {
    // Deep merge the breakpoints
    Object.keys(defaultConfig.breakpoints).forEach((breakpoint) => {
      const bpNumber = parseInt(breakpoint, 10);
      if (!config.breakpoints![bpNumber]) {
        config.breakpoints![bpNumber] = {};
      }
      config.breakpoints![bpNumber] = {
        ...defaultConfig.breakpoints![bpNumber],
        ...config.breakpoints![bpNumber],
      };
    });
  }

  // Initialize Swiper with options
  const swiperInstance = new Swiper(element, config);

  // Minimize the number of event listeners for better performance
  window.removeEventListener('resize', () => {}); // Remove any existing handlers

  // Add resize event listener with debounce for better performance
  let resizeTimeout: ReturnType<typeof setTimeout>;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Only update when resize is complete
      swiperInstance.update();
    }, 250); // 250ms debounce
  });

  return swiperInstance;
};

/**
 * Initialize all typed Swiper sliders on the page
 * @returns {Swiper[]} Array of initialized Swiper instances
 */
export const initAllTypedSwipers = (): Swiper[] => {
  const swipers: Swiper[] = [];
  const swiperElements = getAttributes(ATTRIBUTE.swiper);

  swiperElements.forEach((swiperEl) => {
    const swiper = initTypedSwiper(swiperEl);
    swipers.push(swiper);
  });

  return swipers;
};
