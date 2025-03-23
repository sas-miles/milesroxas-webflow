import { initAllSwipers, initBasicSwiper } from './basicSwiper';
import { initAllTypedSwipers, initTypedSwiper } from './multipleSwiper';

/**
 * Initialize all sliders on the page
 */
export function initSliders(): void {
  // Initialize all Swiper sliders with type-specific configurations
  initAllTypedSwipers();
}

// Export individual features for direct use
export { initAllSwipers, initAllTypedSwipers, initBasicSwiper, initTypedSwiper };
