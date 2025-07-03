const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let currentInput = '';

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.dataset.value;

    if (button.id === 'clear') {
      currentInput = '';
      display.value = '';
    } else if (button.id === 'equals') {
      try {
        currentInput = eval(currentInput).toString();
        display.value = currentInput;
      } catch {
        display.value = 'Error';
      }
    } else {
      currentInput += value;
      display.value = currentInput;
    }
  });
});

document.addEventListener('keydown', e => {
  if (/[0-9\.\+\-\*/]/.test(e.key)) {
    currentInput += e.key;
    display.value = currentInput;
  } else if (e.key === 'Enter') {
    try {
      currentInput = eval(currentInput).toString();
      display.value = currentInput;
    } catch {
      display.value = 'Error';
    }
  } else if (e.key === 'Backspace') {
    currentInput = currentInput.slice(0, -1);
    display.value = currentInput;
  } else if (e.key.toLowerCase() === 'c') {
    currentInput = '';
    display.value = '';
  }
});
