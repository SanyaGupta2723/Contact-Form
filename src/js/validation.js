/**
 * Validates a form input field
 * @param {HTMLElement} inputElement - The input element to validate
 * @param {Object} validators - Object containing validation functions
 * @returns {Object} Result containing isValid status and error message
 */
export function validateInput(inputElement, validators) {
  const value = inputElement.value.trim();
  const errorElement = document.getElementById(`${inputElement.id}Error`);
  
  // Apply each validator until one fails
  for (const [validatorName, validator] of Object.entries(validators)) {
    const validationResult = validator(value);
    
    if (!validationResult.isValid) {
      return {
        isValid: false,
        message: validationResult.message,
        errorElement
      };
    }
  }
  
  // All validations passed
  return {
    isValid: true,
    message: '',
    errorElement
  };
}

/**
 * Validates the entire form
 * @param {HTMLFormElement} form - The form to validate
 * @returns {boolean} Whether the form is valid
 */
export function validateForm(form) {
  const nameInput = form.elements.name;
  const emailInput = form.elements.email;
  const messageInput = form.elements.message;
  
  // Validate name field
  const nameValidation = validateInput(nameInput, {
    required: value => ({
      isValid: value.length > 0,
      message: 'Please enter your name'
    })
  });
  
  // Validate email field
  const emailValidation = validateInput(emailInput, {
    required: value => ({
      isValid: value.length > 0,
      message: 'Please enter your email address'
    }),
    format: value => ({
      isValid: value.length === 0 || isValidEmail(value),
      message: 'Please enter a valid email address'
    })
  });
  
  // Validate message field
  const messageValidation = validateInput(messageInput, {
    required: value => ({
      isValid: value.length > 0,
      message: 'Please enter your message'
    }),
    minLength: value => ({
      isValid: value.length === 0 || value.length >= 10,
      message: 'Message should be at least 10 characters long'
    })
  });
  
  // Display validation results
  displayValidationResult(nameInput, nameValidation);
  displayValidationResult(emailInput, emailValidation);
  displayValidationResult(messageInput, messageValidation);
  
  // Form is valid if all fields are valid
  return nameValidation.isValid && emailValidation.isValid && messageValidation.isValid;
}

/**
 * Displays validation result for an input
 * @param {HTMLElement} inputElement - The input element
 * @param {Object} validationResult - The validation result
 */
function displayValidationResult(inputElement, validationResult) {
  const { isValid, message, errorElement } = validationResult;
  
  if (!isValid) {
    inputElement.classList.add('error');
    errorElement.textContent = message;
    errorElement.classList.add('visible');
  } else {
    inputElement.classList.remove('error');
    errorElement.textContent = '';
    errorElement.classList.remove('visible');
  }
}

/**
 * Validates email format using regex
 * @param {string} email - The email to validate
 * @returns {boolean} Whether the email is valid
 */
export function isValidEmail(email) {
  // RFC 5322 compliant email regex
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
}