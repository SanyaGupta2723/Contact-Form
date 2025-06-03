import { validateForm, validateInput, isValidEmail } from './validation.js';

/**
 * Sets up all event listeners for the contact form
 */
export function setupFormListeners() {
  const form = document.getElementById('contactForm');
  const resetButton = document.getElementById('resetForm');
  
  if (!form) return;
  
  // Input validation on blur (when user leaves an input field)
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', handleInputBlur);
    input.addEventListener('input', handleInputChange);
  });
  
  // Form submission
  form.addEventListener('submit', handleFormSubmit);
  
  // Reset form button
  if (resetButton) {
    resetButton.addEventListener('click', () => resetForm(form));
  }
}

/**
 * Handles input blur events (when user leaves input field)
 * @param {Event} event - The blur event
 */
function handleInputBlur(event) {
  const input = event.target;
  
  // Validate based on input type
  switch (input.id) {
    case 'name':
      validateInput(input, {
        required: value => ({
          isValid: value.length > 0,
          message: 'Please enter your name'
        })
      });
      break;
      
    case 'email':
      validateInput(input, {
        required: value => ({
          isValid: value.length > 0,
          message: 'Please enter your email address'
        }),
        format: value => ({
          isValid: value.length === 0 || isValidEmail(value),
          message: 'Please enter a valid email address'
        })
      });
      break;
      
    case 'message':
      validateInput(input, {
        required: value => ({
          isValid: value.length > 0,
          message: 'Please enter your message'
        }),
        minLength: value => ({
          isValid: value.length === 0 || value.length >= 10,
          message: 'Message should be at least 10 characters long'
        })
      });
      break;
  }
}

/**
 * Handles input change events (real-time validation feedback)
 * @param {Event} event - The input event
 */
function handleInputChange(event) {
  const input = event.target;
  
  // Clear error styling if field was previously marked as error
  if (input.classList.contains('error')) {
    const errorElement = document.getElementById(`${input.id}Error`);
    
    // For email, validate in real-time if there's content
    if (input.id === 'email' && input.value.trim().length > 0) {
      const isValid = isValidEmail(input.value.trim());
      
      if (isValid) {
        input.classList.remove('error');
        errorElement.textContent = '';
        errorElement.classList.remove('visible');
      } else {
        input.classList.add('error');
        errorElement.textContent = 'Please enter a valid email address';
        errorElement.classList.add('visible');
      }
    } else {
      // For other fields, just clear error until blur
      input.classList.remove('error');
      errorElement.textContent = '';
      errorElement.classList.remove('visible');
    }
  }
}

/**
 * Handles form submission events
 * @param {Event} event - The submit event
 */
function handleFormSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const isValid = validateForm(form);
  
  if (isValid) {
    showSuccessMessage();
  } else {
    // Focus the first invalid field
    const firstInvalidInput = form.querySelector('.error');
    if (firstInvalidInput) {
      firstInvalidInput.focus();
    }
  }
}

/**
 * Shows the success message and hides the form
 */
function showSuccessMessage() {
  const form = document.getElementById('contactForm');
  const successMessage = document.getElementById('successMessage');
  
  if (form && successMessage) {
    // Hide form with animation
    form.style.opacity = '0';
    form.style.transform = 'translateY(-20px)';
    
    // After form fades out, show success message
    setTimeout(() => {
      form.style.display = 'none';
      successMessage.classList.remove('hidden');
      
      // Trigger animation after a slight delay
      setTimeout(() => {
        successMessage.classList.add('visible');
      }, 50);
    }, 300);
  }
}

/**
 * Resets the form and hides success message
 * @param {HTMLFormElement} form - The form to reset
 */
export function resetForm(form) {
  const successMessage = document.getElementById('successMessage');
  
  if (form && successMessage) {
    // Reset form fields
    form.reset();
    
    // Clear any validation styling
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.classList.remove('error');
      const errorElement = document.getElementById(`${input.id}Error`);
      if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('visible');
      }
    });
    
    // Hide success message with animation
    successMessage.classList.remove('visible');
    
    // After success message fades out, show form
    setTimeout(() => {
      successMessage.classList.add('hidden');
      form.style.display = 'block';
      
      // Trigger animation after a slight delay
      setTimeout(() => {
        form.style.opacity = '1';
        form.style.transform = 'translateY(0)';
      }, 50);
    }, 300);
  }
}