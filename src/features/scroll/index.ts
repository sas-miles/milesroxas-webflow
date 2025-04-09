import { ATTRIBUTE } from '../../lib/dataAttributes';
import { getAttributes, getAttributesWithValue } from '../../utils/attributes';
import { animateWords } from './animations/wordAnimation';
import { initContextScroll } from './context/contextScroll';
import { destroyLenis, initSmoothScroll } from './smooth/lenisScroll';

// Store cleanup functions
let contextScrollCleanup: (() => void) | null = null;

/**
 * Initialize all scroll features
 * @returns The Lenis instance for smooth scrolling
 */
export function initScrollFeatures() {
  console.log('[scroll] Initializing scroll features');

  // Initialize smooth scrolling
  const lenis = initSmoothScroll();

  // Find and animate text elements
  const textElements = getAttributes(ATTRIBUTE.wordAnimation);
  textElements.forEach((el) => {
    animateWords(el);
  });

  // Setup scroll features for non-scroll-area elements
  // This is useful when our content area is the one with smooth scrolling
  setupScrollFeatures(lenis);

  console.log('[scroll] Scroll features initialized');

  return lenis;
}

/**
 * Setup scroll-related features and integrations
 * @param lenis The Lenis instance for smooth scrolling
 */
function setupScrollFeatures(lenis: any) {
  // Connect with any swiper sliders (swiper sliders inside scroll areas)
  // This helps with nested scrollable elements
  const swiperElements = getAttributes(ATTRIBUTE.swiper);
  if (swiperElements.length > 0) {
    console.log(
      `[scroll] Found ${swiperElements.length} swiper elements, configuring for scroll compatibility`
    );

    // Add specific Lenis-compatible configuration to swipers
    swiperElements.forEach((element, index) => {
      // Add a class to help with CSS targeting
      element.classList.add('lenis-scroll-compatible');

      console.log(`[scroll] Configured swiper ${index + 1} for Lenis compatibility`);
    });
  }

  // Check for other scroll-related elements that might need setup
  initScrollAreas(lenis);
}

/**
 * Initialize specific scroll areas that have the lenis-scroll attribute
 * @param lenis The Lenis instance for smooth scrolling
 */
function initScrollAreas(lenis: any) {
  // Get all elements with lenis-scroll="scroll-area"
  const scrollAreas = getAttributesWithValue(ATTRIBUTE.lenisScroll, 'scroll-area');

  console.log(
    `[scroll] Found ${scrollAreas.length} elements with ${ATTRIBUTE.lenisScroll}="scroll-area"`
  );

  // Process each scroll area as needed
  scrollAreas.forEach((element, index) => {
    console.log(`[scroll] Processing scroll area ${index + 1}`);

    // Add any specific handling for scroll areas here
    // For example, you might want to apply special styling or behaviors
    element.classList.add('lenis-scroll-enabled');

    // Set up scroll indicators if needed (similar to the reference)
    setupScrollIndicator(element, lenis);
  });
}

/**
 * Setup a scroll indicator for a scroll area (similar to the reference layout)
 * @param scrollArea The scroll area element
 * @param lenis The Lenis instance
 */
function setupScrollIndicator(scrollArea: HTMLElement, lenis: any) {
  // Check if an indicator already exists
  let indicator = document.querySelector('.smooth-scroll-indicator');

  // Create one if it doesn't exist
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.className = 'smooth-scroll-indicator';
    indicator.textContent = 'Smooth Scrolling Active';
    document.body.appendChild(indicator);

    console.log('[scroll] Created scroll indicator');
  }

  // Show indicator briefly on initialization
  indicator.classList.add('active');
  setTimeout(() => {
    indicator.classList.remove('active');
  }, 3000);

  // Store timeout ID
  let scrollTimeout: number;

  // Show indicator during scrolling
  lenis.on('scroll', ({ scroll }: { scroll: number }) => {
    // When scrolling, briefly show the indicator
    indicator.classList.add('active');
    (indicator as HTMLElement).textContent = `Smooth Scrolling: ${Math.round(scroll)}px`;

    // Hide the indicator after scrolling stops
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      indicator.classList.remove('active');
    }, 1000) as unknown as number;
  });

  console.log('[scroll] Scroll indicator configured');
}

/**
 * Cleanup all scroll features to prevent memory leaks
 */
function cleanupScrollFeatures() {
  if (contextScrollCleanup) {
    contextScrollCleanup();
    contextScrollCleanup = null;
  }
}

// Export individual features for direct use
export { animateWords, cleanupScrollFeatures, destroyLenis, initContextScroll, initSmoothScroll };
