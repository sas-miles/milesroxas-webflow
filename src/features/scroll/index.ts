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
  // Find all elements that have word animations
  const wordAnimElements = getAttributes(ATTRIBUTE.wordAnimation);

  // Kill all ScrollTrigger instances that might be related to word animations
  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger.vars.id?.includes('word-animation')) {
      trigger.kill();
    }
  });

  // Revert split text and cleanup each element
  wordAnimElements.forEach((el) => {
    try {
      // Revert existing split text
      import('split-type').then((SplitTypeModule) => {
        const SplitType = SplitTypeModule.default;
        new SplitType(el).revert();
      });

      // Reset element properties
      gsap.set(el, { clearProps: 'all' });
      el.style.opacity = '1';
      el.style.visibility = 'visible';
    } catch (error) {
      console.error(`Error cleaning up word animation: ${error}`);
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
    // Set up animations for text elements
    textElements.forEach((el) => {
      const animation = animateWords(el as HTMLElement);
      wordAnimations.push(animation);
    });

    // Refresh ScrollTrigger to ensure animations work
    ScrollTrigger.refresh();
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
