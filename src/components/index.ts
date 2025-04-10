/**
 * Components index file
 *
 * This is a barrel file that re-exports all components from the components directory.
 * It allows for cleaner imports in other files by providing a single import point.
 */

// Import components
import { initFooterToggle } from './FooterToggle';

// Export all components
export { initFooterToggle };

// Add future component exports here
// export { ComponentName } from './ComponentName';

/**
 * Initialize all components
 * This centralizes component initialization in one place
 */
export const initComponents = (): void => {
  // Initialize footer toggle
  initFooterToggle();

  // Initialize future components here
  // initComponent();
};
