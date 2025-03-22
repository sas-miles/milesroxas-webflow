import { ATTRIBUTE } from '../../../lib/dataAttributes';
import { getAttributes } from '../../../utils/attributes';

/**
 * Tracks which section is most visible in the viewport and
 * updates corresponding context items with an active class
 */
export function initContextScroll(): void {
  const sections = getAttributes(ATTRIBUTE.smartSection);
  let lastVisibleSectionIndex: number | null = null;
  let ticking = false; // flag to use with requestAnimationFrame

  // Skip if no sections found
  if (sections.length === 0) return;

  // Cache values that are unchanged during scroll events
  const sectionDataValues = Array.from(sections).map((section) => section.dataset.smartSection);
  const contextItemsMap = new Map();

  // Precompute and store contextItems in a Map for O(1) access
  getAttributes(ATTRIBUTE.contextItem).forEach((item) => {
    const dataValue = item.dataset.contextItem;
    if (dataValue) {
      contextItemsMap.set(dataValue, item);
    }
  });

  // Skip if no matching context items found
  if (contextItemsMap.size === 0) return;

  /**
   * Calculate what percentage of an element is visible in the viewport
   */
  function getVisibilityPercentage(element: HTMLElement): number {
    const rect = element.getBoundingClientRect();
    const totalHeight = window.innerHeight || document.documentElement.clientHeight;
    const visibleArea = Math.min(rect.bottom, totalHeight) - Math.max(rect.top, 0);
    const elementHeight = rect.bottom - rect.top;
    return Math.max(0, Math.min(visibleArea / elementHeight, 1));
  }

  /**
   * Update the active context item based on section visibility
   */
  function updateActiveItem(): void {
    let mostVisibleSectionIndex: number | null = null;
    let highestVisibility = 0;

    // Determine the most visible section
    sections.forEach((section, index) => {
      const visibility = getVisibilityPercentage(section);
      if (visibility > highestVisibility && visibility > 0.2) {
        highestVisibility = visibility;
        mostVisibleSectionIndex = index;
      }
    });

    // Only update if the most visible section has changed
    if (mostVisibleSectionIndex !== lastVisibleSectionIndex) {
      // Remove active class from previous item
      if (lastVisibleSectionIndex !== null) {
        const lastDataValue = sectionDataValues[lastVisibleSectionIndex];
        const lastItem = contextItemsMap.get(lastDataValue);
        if (lastItem) {
          lastItem.classList.remove('is-active');
        }
      }

      // Update last visible section reference
      lastVisibleSectionIndex = mostVisibleSectionIndex;

      // Add active class to new item
      if (mostVisibleSectionIndex !== null) {
        const newDataValue = sectionDataValues[mostVisibleSectionIndex];
        const newItem = contextItemsMap.get(newDataValue);
        if (newItem) {
          newItem.classList.add('is-active');
        }
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

  // Setup scroll event listener
  window.addEventListener('scroll', throttledUpdateActiveItem);

  // Initialize on page load
  updateActiveItem();
}
