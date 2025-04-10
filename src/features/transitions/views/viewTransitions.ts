import SwupJsPlugin from '@swup/js-plugin';
import gsap from 'gsap';
import Swup from 'swup';

// Export a function to initialize Swup
export function initViewTransitions() {
  // Create a new Swup instance with JS Plugin
  const swup = new Swup({
    plugins: [
      new SwupJsPlugin({
        animations: [
          {
            from: '(.*)',
            to: '(.*)',
            out: async (done) => {
              await gsap.to('#swup', {
                opacity: 0,
                duration: 0.8,
                scale: 0.98,
                ease: 'power2.inOut',
                overwrite: true, // Prevents multiple animations from stacking
              });
              done();
            },
            in: async (done) => {
              await gsap.fromTo(
                '#swup',
                { opacity: 0, scale: 0.9 },
                {
                  opacity: 1,
                  duration: 0.8,
                  scale: 1,
                  ease: 'power2.inOut',
                  overwrite: true, // Prevents multiple animations from stacking
                  onComplete: () => {
                    // Lazy load any images that need loading
                    document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
                      // Force re-evaluation of lazy loading
                      if (img.getAttribute('data-src')) {
                        img.setAttribute('src', img.getAttribute('data-src') || '');
                      }
                    });

                    done();
                  },
                }
              );
            },
          },
        ],
      }),
    ],
    cache: true, // Enable caching for better performance
    animateHistoryBrowsing: true, // Animate when using browser back/forward
    animationSelector: '[id="swup"]', // Only animate the swup container
  });

  // Set up transition event hooks
  swup.hooks.on('visit:start', () => {
    // Kill any existing animations
    gsap.killTweensOf('#swup');
    // Dispatch custom event for transition start
    window.dispatchEvent(new CustomEvent('swup:transitionStart'));
  });

  swup.hooks.on('visit:end', () => {
    // Dispatch custom event for transition end
    window.dispatchEvent(new CustomEvent('swup:transitionEnd'));
  });

  return swup;
}

// Create a single Swup instance
const swup = initViewTransitions();

// Export both the instance and initialization function
export default {
  instance: swup,
  init: () => swup,
};
