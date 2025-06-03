import { validateForm } from './validation.js';
import { setupFormListeners, resetForm } from './formHandlers.js';

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  setupFormListeners();
});