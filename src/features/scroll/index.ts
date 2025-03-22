import { ATTRIBUTE } from '../../lib/dataAttributes';
import { getAttributes } from '../../utils/attributes';
import { animateWords } from './animations/wordAnimation';
import { initContextScroll } from './context/contextScroll';
import { initSmoothScroll } from './smooth/lenisScroll';

/**
 * Initialize all scroll-based features
 * @returns The Lenis instance for smooth scrolling
 */
export function initScrollFeatures() {
  // Initialize smooth scrolling
  const lenis = initSmoothScroll();

  // Find and animate text elements
  const textElements = getAttributes(ATTRIBUTE.wordAnimation);
  textElements.forEach((el) => {
    animateWords(el);
  });

  // Initialize context scroll for smart sections
  initContextScroll();

  return lenis;
}

// Export individual features for direct use
export { animateWords, initContextScroll, initSmoothScroll };
