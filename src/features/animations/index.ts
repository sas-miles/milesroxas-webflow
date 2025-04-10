import { animateWords } from '../scroll/animations/wordAnimation';

/**
 * Initialize all text animations on the page
 * This function should be called after the DOM is loaded
 */
export const setupAnimations = (): void => {
  // Word animations
  const wordAnimationElements = document.querySelectorAll('[data-word-animation]');
  wordAnimationElements.forEach((el) => {
    animateWords(el as HTMLElement);
  });

  // Add more animation types here as needed
};

// Export all animations for individual use
export { animateWords };
