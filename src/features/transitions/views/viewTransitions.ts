import SwupJsPlugin from '@swup/js-plugin';
import gsap from 'gsap';
import Swup from 'swup';

// Default transition animation config
const defaultTransition = {
  duration: 0.8,
  ease: 'power2.inOut',
  overwrite: true,
};

// Create a single Swup instance
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
              scale: 0.98,
              ...defaultTransition,
            });
            done();
          },
          in: async (done) => {
            await gsap.fromTo(
              '#swup',
              { opacity: 0, scale: 0.9 },
              {
                opacity: 1,
                scale: 1,
                ...defaultTransition,
                onComplete: () => {
                  // Force re-evaluation of lazy loading
                  document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
                    const dataSrc = img.getAttribute('data-src');
                    if (dataSrc) img.setAttribute('src', dataSrc);
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
  cache: true,
  animateHistoryBrowsing: true,
  animationSelector: '[id="swup"]',
});

// Set up transition event hooks
swup.hooks.on('visit:start', () => {
  gsap.killTweensOf('#swup');
  window.dispatchEvent(new CustomEvent('swup:transitionStart'));
});

swup.hooks.on('visit:end', () => {
  window.dispatchEvent(new CustomEvent('swup:transitionEnd'));
});

export default {
  instance: swup,
  init: () => swup,
};
