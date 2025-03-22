import { initAllSwipers, initBasicSwiper } from './basicSwiper';

/**
 * Initialize all sliders on the page
 */
export function initSliders(): void {
  // Initialize all Swiper sliders
  initAllSwipers();
}

// Export individual features for direct use
export { initAllSwipers, initBasicSwiper };
