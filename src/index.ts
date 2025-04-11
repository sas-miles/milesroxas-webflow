// import React from 'react';

// import * as ReactDOM from 'react-dom/client';
// import App from './App';
import './styles';

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import { initComponents } from './components';
import { cleanupScroll, initScroll, initWordAnimations } from './features/scroll';
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

  // Unified cleanup function to ensure consistent cleanup between transitions and page unload
  const cleanupPage = () => {
    // First kill all GSAP animations and ScrollTrigger instances
    gsap.killTweensOf('*');
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    // Then clean up scroll features (includes word animations)
    cleanupScroll();

    // Finally reset scroll position
    window.scrollTo(0, 0);
  };

  // Unified initialization function to ensure consistent setup
  const initializePage = () => {
    // First initialize Lenis for smooth scrolling
    if (window.lenis) {
      window.lenis = resetLenis(window.lenis);
    } else {
      window.lenis = initScroll();
    }

    // Then initialize components and sliders
    initComponents();
    initSliders();

    // Finally initialize animations after DOM is ready
    requestAnimationFrame(() => {
      // Reset scroll position before initializing animations
      if (window.lenis) {
        window.lenis.scrollTo(0, { immediate: true });
      }

      // Initialize word animations and refresh ScrollTrigger once
      initWordAnimations();
    });
  };

  // Function to handle transition start
  const handleTransitionStart = () => {
    cleanupPage();
  };

  // Function to handle transition end
  const handleTransitionEnd = () => {
    initializePage();
  };

  // Register event handlers
  window.addEventListener('swup:transitionStart', handleTransitionStart);
  window.addEventListener('swup:transitionEnd', handleTransitionEnd);

  // Wait for everything to load before first initialization
  window.addEventListener('load', () => {
    initializePage();
  });

  // Clean up when Webflow editor reloads the page
  window.addEventListener('beforeunload', () => {
    // Remove event listeners
    window.removeEventListener('swup:transitionStart', handleTransitionStart);
    window.removeEventListener('swup:transitionEnd', handleTransitionEnd);

    // Run any registered component cleanup functions
    if (window.cleanupFunctions) {
      Object.values(window.cleanupFunctions).forEach((cleanup) => cleanup());
    }

    cleanupPage();
  });
});
