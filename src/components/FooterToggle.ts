import gsap from 'gsap';

// Extend Window interface to include cleanupFunctions
declare global {
  interface Window {
    cleanupFunctions?: {
      [key: string]: () => void;
    };
  }
}

/**
 * Adds animation to the framed-footer element when footer-toggle element is present
 * Animation only applies on mobile (767px and down)
 */
export const initFooterToggle = (): void => {
  // Check if the footer-toggle element exists in the DOM
  const footerToggle = document.getElementById('footer-toggle');

  if (!footerToggle) return;

  // Find all elements with the framed-footer class
  const framedFooter = document.querySelector('.framed-footer');

  if (!framedFooter) return;

  // Animation function
  const animateFooter = (): void => {
    const isMobile = window.innerWidth <= 767;

    if (isMobile) {
      // Only animate on mobile viewport widths (767px and down)
      gsap.to(framedFooter, {
        y: -40,
        duration: 0.5,
        ease: 'power2.out',
      });
    } else {
      // Reset position on desktop
      gsap.to(framedFooter, {
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
      });
    }
  };

  // Run animation initially
  animateFooter();

  // Set up resize listener
  const handleResize = (): void => {
    animateFooter();
  };

  // Add resize event listener
  window.addEventListener('resize', handleResize);

  // Store cleanup function
  window.cleanupFunctions = window.cleanupFunctions || {};
  window.cleanupFunctions.footerToggle = () => {
    window.removeEventListener('resize', handleResize);
    gsap.killTweensOf(framedFooter);
  };
};

// Initialize the footer toggle animation
document.addEventListener('DOMContentLoaded', initFooterToggle);

export default initFooterToggle;
