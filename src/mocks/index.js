/**
 * Mock API handlers index
 * 
 * This file serves as the entry point for all mock API handlers.
 * It should only be imported in development mode.
 */

import { setupMockPromptServer } from './promptHandler';

// Initialize all mock servers if in development mode
export function setupMockServers() {
  // Check if we're in development mode
  if (import.meta.env.DEV) {
    console.log('Setting up mock API servers for development...');
    setupMockPromptServer();
  }
}
