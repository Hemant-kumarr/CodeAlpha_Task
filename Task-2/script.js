const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
const themeToggle = document.getElementById('theme-toggle');
const backspaceBtn = document.getElementById('backspace');

let currentInput = '';
let shouldResetDisplay = false;

// Theme toggle functionality
themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
  
  // Save theme preference
  localStorage.setItem('theme', newTheme);
});

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

// Calculator functionality
buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.dataset.value;

    if (button.id === 'clear') {
      currentInput = '';
      display.value = '';
      shouldResetDisplay = false;
    } else if (button.id === 'backspace') {
      if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
      } else {
        currentInput = currentInput.slice(0, -1);
      }
      display.value = currentInput || '0';
    } else if (button.id === 'equals') {
      try {
        // Replace display symbols with actual operators
        let expression = currentInput
          .replace(/×/g, '*')
          .replace(/÷/g, '/')
          .replace(/−/g, '-');
        
        const result = eval(expression);
        currentInput = result.toString();
        display.value = currentInput;
        shouldResetDisplay = true;
      } catch {
        display.value = 'Error';
        currentInput = '';
        shouldResetDisplay = true;
      }
    } else {
      if (shouldResetDisplay && !isOperator(value)) {
        currentInput = '';
        shouldResetDisplay = false;
      }
      
      currentInput += value;
      display.value = currentInput;
    }
  });
});

// Helper function to check if value is an operator
function isOperator(value) {
  return ['+', '-', '*', '/', '×', '÷', '−'].includes(value);
}

// Enhanced keyboard support
document.addEventListener('keydown', e => {
  e.preventDefault();
  
  if (/[0-9]/.test(e.key)) {
    if (shouldResetDisplay) {
      currentInput = '';
      shouldResetDisplay = false;
    }
    currentInput += e.key;
    display.value = currentInput;
  } else if (e.key === '.') {
    if (shouldResetDisplay) {
      currentInput = '';
      shouldResetDisplay = false;
    }
    if (!currentInput.includes('.')) {
      currentInput += e.key;
      display.value = currentInput;
    }
  } else if (['+', '-', '*', '/'].includes(e.key)) {
    let symbol = e.key;
    if (e.key === '*') symbol = '×';
    if (e.key === '/') symbol = '÷';
    if (e.key === '-') symbol = '−';
    
    currentInput += symbol;
    display.value = currentInput;
    shouldResetDisplay = false;
  } else if (e.key === 'Enter' || e.key === '=') {
    document.getElementById('equals').click();
  } else if (e.key === 'Backspace') {
    backspaceBtn.click();
  } else if (e.key.toLowerCase() === 'c' || e.key === 'Escape') {
    document.getElementById('clear').click();
  }
});

// Add button press animation
buttons.forEach(button => {
  button.addEventListener('mousedown', () => {
    button.style.transform = 'scale(0.95)';
  });
  
  button.addEventListener('mouseup', () => {
    button.style.transform = '';
  });
  
  button.addEventListener('mouseleave', () => {
    button.style.transform = '';
  });
});

// Initialize display
display.value = '0';