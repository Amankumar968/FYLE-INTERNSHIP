document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('taxForm');
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modalContent');
  const ageDropdown = document.getElementById('age');
  const dropdownContainer = document.querySelector('.dropdown-container');
  const closeButton = modalContent.querySelector('.close-button'); // Select the close button

  if (performance.navigation.type === 1) {
    // Page is refreshed, do not show modal
    modal.style.display = 'none';
  }

  // Function to display error icon and tooltip for invalid input
  function displayErrorIcon(input) {
    const errorIcon = input.nextElementSibling;
    errorIcon.style.display = 'inline-block';
  }

  function hideErrorIcon(input) {
    const errorIcon = input.nextElementSibling;
    errorIcon.style.display = 'none';
  }

  function showTooltip(input, message) {
    const tooltip = input.nextElementSibling.nextElementSibling;
    tooltip.textContent = message;
    tooltip.style.display = 'block';
  }

  function hideTooltip(input) {
    const tooltip = input.nextElementSibling.nextElementSibling;
    tooltip.style.display = 'none';
  }

  // Toggle dropdown when "Age" field is clicked
  ageDropdown.addEventListener('click', function () {
    dropdownContainer.classList.toggle('open');
  });

  // Close dropdown when user selects an option
  ageDropdown.addEventListener('change', function () {
    dropdownContainer.classList.remove('open');
  });

  // Validation for number fields
  const numberInputs = document.querySelectorAll('input[type="text"]');
  numberInputs.forEach(input => {
    input.addEventListener('input', function () {
      const inputValue = this.value.trim();
      if (!/^\d*\.?\d*$/.test(inputValue) && inputValue !== '') {
        displayErrorIcon(this);
        showTooltip(this, 'Invalid input. Only numeric values are allowed.');
      } else {
        hideErrorIcon(this);
        hideTooltip(this);
      }
    });
  });

  // Validation for age field
  ageDropdown.addEventListener('change', function () {
    if (!this.value) {
      displayErrorIcon(ageDropdown);
      showTooltip(ageDropdown, 'Age group selection is mandatory.');
    } else {
      hideErrorIcon(ageDropdown);
      hideTooltip(ageDropdown);
    }
  });

  // Submit form handling
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const income = parseFloat(form.elements['income'].value);
    const extraIncome = parseFloat(form.elements['extraIncome'].value) || 0;
    const deductions = parseFloat(form.elements['deductions'].value) || 0;
    const age = form.elements['age'].value;

    let isValid = true;
    numberInputs.forEach(input => {
      const inputValue = input.value.trim();
      if (!/^\d*\.?\d*$/.test(inputValue) && inputValue !== '') {
        displayErrorIcon(input);
        showTooltip(input, 'Invalid input. Only numeric values are allowed.');
        isValid = false;
      }
    });

    if (!age) {
      displayErrorIcon(ageDropdown);
      showTooltip(ageDropdown, 'Age group selection is mandatory.');
      isValid = false;
    }

    if (isValid) {
      const taxAmount = calculateTax(income, extraIncome, deductions, age);
      showModal(taxAmount);
    }
  });

  // Calculate tax based on inputs
  function calculateTax(income, extraIncome, deductions, age) {
    const totalIncome = income + extraIncome - deductions;
    let taxAmount = 0;

    if (totalIncome > 800000) {
      switch (age) {
        case '<40':
          taxAmount = 0.3 * (totalIncome - 800000);
          break;
        case '40-60':
          taxAmount = 0.4 * (totalIncome - 800000);
          break;
        case '≥60':
          taxAmount = 0.1 * (totalIncome - 800000);
          break;
        default:
          break;
      }
    }

    return taxAmount;
  }

  // Show modal with tax calculation result
  function showModal(taxAmount) {
    const afterTaxIncomeSpan = document.getElementById('afterTaxIncome');

    afterTaxIncomeSpan.textContent = (calculateOverallIncome() - taxAmount).toFixed(2) ;

    modal.style.display = 'block';
  }

  // Function to calculate overall income
  function calculateOverallIncome() {
    const income = parseFloat(form.elements['income'].value);
    const extraIncome = parseFloat(form.elements['extraIncome'].value) || 0;
    const deductions = parseFloat(form.elements['deductions'].value) || 0;
    return income + extraIncome - deductions;
  }

  // Close modal when user clicks on the close button
  closeButton.addEventListener('click', function () {
    modal.style.display = 'none';
  });
  
  // Hide error icon initially until user enters any alphabet
  const alphabetRegex = /[a-zA-Z]/;
  numberInputs.forEach(input => {
    input.addEventListener('input', function () {
      if (alphabetRegex.test(this.value)) {
        hideErrorIcon(this);
      }
    });
  });
});
