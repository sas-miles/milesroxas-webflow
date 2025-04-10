// import React from 'react';

// import * as ReactDOM from 'react-dom/client';
// import App from './App';
import './styles';

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import { initComponents } from './components';
import {
  cleanupScroll,
  cleanupWordAnimations,
  initScroll,
  initWordAnimations,
} from './features/scroll';
import { resetLenis } from './features/scroll/smooth/lenisScroll';
import { initSliders } from './features/sliders';
import { viewTransitions } from './features/transitions';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Initialize Webflow
window.Webflow ||= [];
window.Webflow.push(() => {
  // Initialize core features
  initSliders();
  viewTransitions.init();
  initComponents();

  // Function to handle transition start
  const handleTransitionStart = () => {
    // Scroll to top at the start of transition
    window.scrollTo(0, 0);

    // First cleanup word animations
    cleanupWordAnimations();

    // Then clean up remaining scroll features but skip word animations
    // since we've already cleaned them up
    cleanupScroll(true);

    // Kill any remaining animations
    gsap.killTweensOf('*');
  };

  // Function to handle transition end
  const handleTransitionEnd = () => {
    // Reinitialize components and sliders
    initSliders();
    initComponents();

    // Reinitialize Lenis
    if (window.lenis) {
      window.lenis = resetLenis(window.lenis);
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      window.lenis = initScroll();
    }

    // Initialize word animations with delay
    setTimeout(() => {
      // Force a scroll position first
      if (window.lenis) {
        window.lenis.scrollTo(0, { immediate: true });
      }

      // Initialize word animations
      initWordAnimations();

      // Refresh ScrollTrigger
      ScrollTrigger.refresh();

      // Final refresh with a delay
      setTimeout(() => {
        ScrollTrigger.refresh(true);
      }, 300);
    }, 150);
  };

  // Register event handlers
  window.addEventListener('swup:transitionStart', handleTransitionStart);
  window.addEventListener('swup:transitionEnd', handleTransitionEnd);

  // Wait for everything to load before initializing Lenis
  window.addEventListener('load', () => {
    // Initialize all scroll features (smooth scrolling and animations)
    const lenis = initScroll();

    // Store lenis instance on window
    window.lenis = lenis;
  });

  // Clean up event listeners when Webflow editor reloads the page
  window.addEventListener('beforeunload', () => {
    window.removeEventListener('swup:transitionStart', handleTransitionStart);
    window.removeEventListener('swup:transitionEnd', handleTransitionEnd);

    // Run any registered component cleanup functions
    if (window.cleanupFunctions) {
      Object.values(window.cleanupFunctions).forEach((cleanup) => cleanup());
    }

    // Clean up scroll features
    cleanupScroll();

    // Kill all GSAP animations
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    gsap.killTweensOf('*');
  });
});
