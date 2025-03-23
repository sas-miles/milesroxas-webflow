import { ATTRIBUTE } from '../../lib/dataAttributes';
import { getAttributes } from '../../utils/attributes';
import { animateWords } from './animations/wordAnimation';
import { initContextScroll } from './context/contextScroll';
import { initSmoothScroll } from './smooth/lenisScroll';

// Store cleanup functions
let contextScrollCleanup: (() => void) | null = null;

/**
 * Initialize all scroll features
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

  // DISABLED: Initialize context scroll for smart sections
  // Pass lenis instance to properly integrate smooth scrolling with context updates
  // console.log('[scroll] Initializing contextScroll with Lenis instance');
  // contextScrollCleanup = initContextScroll(lenis);
  // console.log('[scroll] contextScroll initialization complete');

  return lenis;
}

/**
 * Cleanup all scroll features to prevent memory leaks
 */
function cleanupScrollFeatures() {
  if (contextScrollCleanup) {
    contextScrollCleanup();
    contextScrollCleanup = null;
  }
}

// Export individual features for direct use
export { animateWords, cleanupScrollFeatures, initContextScroll, initSmoothScroll };
