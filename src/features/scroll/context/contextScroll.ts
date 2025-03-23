import Lenis from 'lenis';

import { ATTRIBUTE } from '../../../lib/dataAttributes';
import { getAttributes } from '../../../utils/attributes';

/**
 * Tracks which section is most visible in the viewport and
 * updates corresponding context items with an active class
 * @param {Lenis} [lenisInstance] - Optional Lenis instance for smooth scrolling integration
 * @returns {() => void} Cleanup function to remove event listeners and observers
 */
export function initContextScroll(lenisInstance?: Lenis): () => void {
  console.log('[contextScroll] Initializing...');
  const sections = getAttributes(ATTRIBUTE.smartSection);
  console.log(`[contextScroll] Found ${sections.length} sections with [${ATTRIBUTE.smartSection}]`);

  // Skip if no sections found
  if (sections.length === 0) {
    console.warn('[contextScroll] No sections found, aborting initialization');
    return () => {};
  }

  // Log the sections found
  sections.forEach((section, index) => {
    console.log(
      `[contextScroll] Section ${index + 1}: data-smart-section="${section.dataset.smartSection}"`
    );
  });

  // Cache context items for better performance
  const contextItemsMap = new Map();
  const contextItems = getAttributes(ATTRIBUTE.contextItem);
  console.log(
    `[contextScroll] Found ${contextItems.length} context items with [${ATTRIBUTE.contextItem}]`
  );

  contextItems.forEach((item, index) => {
    const dataValue = item.dataset.contextItem;
    if (dataValue) {
      contextItemsMap.set(dataValue, item);
      console.log(`[contextScroll] Context item ${index + 1}: data-context-item="${dataValue}"`);
    }
  });

  // Skip if no matching context items found
  if (contextItemsMap.size === 0) {
    console.warn('[contextScroll] No valid context items found, aborting initialization');
    return () => {};
  }

  // Log the mapping between sections and context items
  console.log('[contextScroll] Checking for matches between sections and context items:');
  sections.forEach((section) => {
    const sectionId = section.dataset.smartSection;
    if (sectionId && contextItemsMap.has(sectionId)) {
      console.log(
        `[contextScroll] ✅ Match found: section "${sectionId}" has a corresponding context item`
      );
    } else if (sectionId) {
      console.warn(`[contextScroll] ❌ No matching context item found for section "${sectionId}"`);
    }
  });

  let currentActiveSection: string | null = null;
  const activeSections = new Set<string>();
  let ticking = false;

  // Options for the Intersection Observer
  const observerOptions = {
    root: null, // Use the viewport as the root
    rootMargin: '0px',
    threshold: [0, 0.25, 0.5, 0.75, 1.0], // Multiple thresholds for more granular updates
  };

  // Create a map to store section visibility percentages
  const sectionVisibility = new Map<string, number>();

  /**
   * Updates the active context item based on section visibility
   */
  function updateActiveItem(): void {
    // Sort sections by visibility and find the most visible one
    let highestVisibilitySection: string | null = null;
    let highestVisibility = 0;

    sectionVisibility.forEach((visibility, sectionId) => {
      if (visibility > highestVisibility) {
        highestVisibility = visibility;
        highestVisibilitySection = sectionId;
      }
    });

    console.log(
      `[contextScroll] Most visible section: "${highestVisibilitySection}" with visibility ${highestVisibility.toFixed(2)}`
    );

    // Only update if the most visible section has changed
    if (highestVisibilitySection !== currentActiveSection && highestVisibility > 0.25) {
      console.log(
        `[contextScroll] Changing active section from "${currentActiveSection}" to "${highestVisibilitySection}"`
      );
      // Remove active class from previous section's context item
      if (currentActiveSection && contextItemsMap.has(currentActiveSection)) {
        const prevItem = contextItemsMap.get(currentActiveSection);
        prevItem.classList.remove('is-active');
        console.log(
          `[contextScroll] Removed 'is-active' class from item for "${currentActiveSection}"`
        );
      }

      // Update current active section
      currentActiveSection = highestVisibilitySection;

      // Add active class to new section's context item
      if (currentActiveSection && contextItemsMap.has(currentActiveSection)) {
        const newItem = contextItemsMap.get(currentActiveSection);
        newItem.classList.add('is-active');
        console.log(
          `[contextScroll] Added 'is-active' class to item for "${currentActiveSection}"`
        );
      } else if (currentActiveSection) {
        console.warn(
          `[contextScroll] Could not find context item for section "${currentActiveSection}"`
        );
      }
    }
  }

  /**
   * Throttled update function using requestAnimationFrame
   */
  function throttledUpdateActiveItem(): void {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateActiveItem();
        ticking = false;
      });
      ticking = true;
    }
  }

  // Create Intersection Observer to track section visibility
  const observer =
    typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            const target = entry.target as HTMLElement;
            const sectionId = target.dataset.smartSection;

            if (!sectionId) return;

            // Calculate visibility ratio based on intersection ratio
            const visibilityRatio = entry.intersectionRatio;

            console.log(
              `[contextScroll] Section "${sectionId}" intersection: ${visibilityRatio.toFixed(2)}, isIntersecting: ${entry.isIntersecting}`
            );

            // Update the visibility map
            if (visibilityRatio > 0) {
              sectionVisibility.set(sectionId, visibilityRatio);
              activeSections.add(sectionId);
            } else {
              sectionVisibility.delete(sectionId);
              activeSections.delete(sectionId);
            }

            // Update active item
            throttledUpdateActiveItem();
          });
        }, observerOptions)
      : null;

  // Check if IntersectionObserver is available
  if (observer) {
    console.log('[contextScroll] Using IntersectionObserver for tracking');
  } else {
    console.warn(
      '[contextScroll] IntersectionObserver not available, falling back to scroll events'
    );
  }

  // Observe all sections
  if (observer) {
    sections.forEach((section) => {
      observer.observe(section);
      console.log(
        `[contextScroll] Now observing section with data-smart-section="${section.dataset.smartSection}"`
      );
    });

    // Force initial calculation after a short delay to ensure sections are properly registered
    setTimeout(() => {
      console.log('[contextScroll] Running initial visibility update');
      updateActiveItem();
    }, 100);
  } else {
    // Fallback to scroll events if IntersectionObserver is not available
    const handleScroll = () => {
      console.log('[contextScroll] Scroll event detected');
      sections.forEach((section) => {
        const sectionId = section.dataset.smartSection;
        if (!sectionId) return;

        const rect = section.getBoundingClientRect();
        const totalHeight = window.innerHeight || document.documentElement.clientHeight;
        const visibleArea = Math.min(rect.bottom, totalHeight) - Math.max(rect.top, 0);
        const elementHeight = rect.bottom - rect.top;
        const visibilityRatio = Math.max(0, Math.min(visibleArea / elementHeight, 1));

        console.log(
          `[contextScroll] Section "${sectionId}" visibility: ${visibilityRatio.toFixed(2)}`
        );

        if (visibilityRatio > 0) {
          sectionVisibility.set(sectionId, visibilityRatio);
          activeSections.add(sectionId);
        } else {
          sectionVisibility.delete(sectionId);
          activeSections.delete(sectionId);
        }
      });

      throttledUpdateActiveItem();
    };

    // Use Lenis scroll event if available, otherwise fallback to window scroll
    const lenis = lenisInstance || window.lenis;

    if (lenis) {
      console.log('[contextScroll] Using Lenis for scroll events');
      lenis.on('scroll', handleScroll);
    } else {
      console.log('[contextScroll] Using native scroll events (Lenis not found)');
      window.addEventListener('scroll', handleScroll);
    }
  }

  // Determine which Lenis instance to use for cleanup
  const lenis = lenisInstance || window.lenis;

  // Log if Lenis is being used
  if (lenis) {
    console.log('[contextScroll] Using Lenis instance for smooth scrolling');
  } else {
    console.warn('[contextScroll] No Lenis instance found, using native scroll');
  }

  // Initial update
  if (!observer) {
    // Manually trigger one calculation to set initial state
    console.log('[contextScroll] Running initial manual visibility calculation');
    sections.forEach((section) => {
      const sectionId = section.dataset.smartSection;
      if (!sectionId) return;

      const rect = section.getBoundingClientRect();
      const totalHeight = window.innerHeight || document.documentElement.clientHeight;
      const visibleArea = Math.min(rect.bottom, totalHeight) - Math.max(rect.top, 0);
      const elementHeight = rect.bottom - rect.top;
      const visibilityRatio = Math.max(0, Math.min(visibleArea / elementHeight, 1));

      console.log(
        `[contextScroll] Initial visibility for section "${sectionId}": ${visibilityRatio.toFixed(2)}`
      );

      if (visibilityRatio > 0) {
        sectionVisibility.set(sectionId, visibilityRatio);
        activeSections.add(sectionId);
      }
    });

    updateActiveItem();
  }

  console.log('[contextScroll] Initialization complete');

  // Return cleanup function to remove observers and event listeners
  return () => {
    console.log('[contextScroll] Cleaning up...');
    if (observer) {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
      observer.disconnect();
      console.log('[contextScroll] Intersection Observer disconnected');
    } else if (lenis) {
      lenis.off('scroll', throttledUpdateActiveItem);
      console.log('[contextScroll] Removed Lenis scroll listener');
    } else {
      window.removeEventListener('scroll', throttledUpdateActiveItem);
      console.log('[contextScroll] Removed window scroll listener');
    }
    console.log('[contextScroll] Cleanup complete');
  };
}
