import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import { ATTRIBUTE } from '../../lib/dataAttributes';
import { getAttributes } from '../../utils/attributes';
import { animateWords } from './animations/wordAnimation';
import { destroyLenis, initSmoothScroll, resetLenis } from './smooth/lenisScroll';

// Register GSAP plugins to ensure they're available
gsap.registerPlugin(ScrollTrigger);

// Store lenis instance and cleanup functions
let lenisInstance: any = null;
let contextCleanup: (() => void) | null = null;
let wordAnimations: { timeline?: gsap.core.Timeline; scrollTrigger?: ScrollTrigger }[] = [];

/**
 * Kill ScrollTrigger instances related to word animations
 */
function cleanupWordAnimations() {
  // Kill all ScrollTrigger instances that might be related to word animations
  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger.vars.id?.includes('word-animation')) {
      trigger.kill();
    }
  });

  // Clear animations array
  wordAnimations = [];
}

/**
 * Initialize word animations for elements with the word-animation attribute
 */
function initWordAnimations() {
  // Find and animate text elements
  const textElements = getAttributes(ATTRIBUTE.wordAnimation);

  if (textElements.length > 0) {
    // First cleanup any existing animations
    cleanupWordAnimations();

    // Set up animations for text elements
    textElements.forEach((el) => {
      const animation = animateWords(el as HTMLElement);
      wordAnimations.push(animation);
    });

    // Force a refresh of ScrollTrigger after all animations are set up
    requestAnimationFrame(() => {
      ScrollTrigger.refresh(true);
    });
  }
}

/**
 * Initialize all scroll features
 * @returns The Lenis instance for smooth scrolling
 */
export function initScroll() {
  // Initialize smooth scrolling
  lenisInstance = initSmoothScroll();

  // Initialize word animations
  initWordAnimations();

  // Set up transition event listeners
  window.addEventListener('swup:transitionStart', () => {
    cleanupScroll(true); // Skip word animations as they'll be cleaned up by the animation itself
  });

  window.addEventListener('swup:transitionEnd', () => {
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      initScroll();
      ScrollTrigger.refresh(true);
    }, 100);
  });

  return lenisInstance;
}

/**
 * Cleanup all scroll features to prevent memory leaks
 * @param skipWordAnimations Skip word animation cleanup (useful if already done separately)
 */
export function cleanupScroll(skipWordAnimations = false) {
  // Clean up word animations first (unless skipped)
  if (!skipWordAnimations) {
    cleanupWordAnimations();
  }

  // Kill any remaining ScrollTrigger instances
  ScrollTrigger.getAll().forEach((trigger) => {
    trigger.kill();
  });
  ScrollTrigger.clearMatchMedia();

  if (contextCleanup) {
    contextCleanup();
    contextCleanup = null;
  }

  if (lenisInstance) {
    destroyLenis(lenisInstance);
    lenisInstance = null;
  }
}

// Export individual features for direct use
export {
  animateWords,
  cleanupWordAnimations,
  destroyLenis,
  initSmoothScroll,
  initWordAnimations,
  resetLenis,
};
