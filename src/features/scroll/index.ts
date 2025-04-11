import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import { ATTRIBUTE } from '../../lib/dataAttributes';
import { getAttributes } from '../../utils/attributes';
import { animateWords } from './animations/wordAnimation';
import { destroyLenis, initSmoothScroll, resetLenis } from './smooth/lenisScroll';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Store instances
let lenisInstance: any = null;
let wordAnimations: { timeline?: gsap.core.Timeline; scrollTrigger?: ScrollTrigger }[] = [];

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

    // Refresh ScrollTrigger
    ScrollTrigger.refresh(true);
  }
}

/**
 * Kill ScrollTrigger instances related to word animations
 */
function cleanupWordAnimations() {
  ScrollTrigger.getAll()
    .filter((trigger) => trigger.vars.id?.includes('word-animation'))
    .forEach((trigger) => trigger.kill());

  wordAnimations = [];
}

/**
 * Initialize all scroll features
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
    requestAnimationFrame(() => {
      initScroll();
      ScrollTrigger.refresh(true);
    });
  });

  return lenisInstance;
}

/**
 * Cleanup all scroll features
 */
export function cleanupScroll(skipWordAnimations = false) {
  if (!skipWordAnimations) {
    cleanupWordAnimations();
  }

  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  ScrollTrigger.clearMatchMedia();

  if (lenisInstance) {
    destroyLenis(lenisInstance);
    lenisInstance = null;
  }
}

export {
  animateWords,
  cleanupWordAnimations,
  destroyLenis,
  initSmoothScroll,
  initWordAnimations,
  resetLenis,
};
