// import React from 'react';

// import * as ReactDOM from 'react-dom/client';
// import App from './App';
import { initScrollFeatures } from './features/scroll';
import { initSliders } from './features/sliders';

// Initialize Webflow
window.Webflow ||= [];
window.Webflow.push(() => {
  // Initialize all scroll features (smooth scrolling and animations)
  const lenis = initScrollFeatures();

  // Store lenis instance on window to prevent garbage collection
  window.lenis = lenis;

  // Initialize sliders
  initSliders();

  // const rootElement = document.getElementById('root');

  // // Make sure we have a root element
  // if (rootElement) {
  //   const root = ReactDOM.createRoot(rootElement);
  //   root.render(React.createElement(App));
  // } else {
  //   console.error('No root element found! Add a div with id="root" to your Webflow page');
  // }
});
