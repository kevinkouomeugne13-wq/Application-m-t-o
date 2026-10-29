// 1. Structure de l'état de la calculatrice
const calculator = {
  displayValue: '0',
  firstOperand: null,
  waitingForSecondOperand: false,
  operator: null,
};

// 2. Mise à jour de l'écran
function updateDisplay() {
  const screen = document.getElementById('screen');
  screen.textContent = calculator.displayValue;
}

// 3. Gestion de la saisie des chiffres
function inputDigit(digit) {
  const { displayValue, waitingForSecondOperand } = calculator;

  if (waitingForSecondOperand) {
    calculator.displayValue = digit;
    calculator.waitingForSecondOperand = false;
  } else {
    // Évite les zéros multiples au début
    calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
  }
}

// 4. Gestion de la virgule (point décimal)
function inputDecimal(dot) {
  if (calculator.waitingForSecondOperand) {
    calculator.displayValue = '0.';
    calculator.waitingForSecondOperand = false;
    return;
  }

  if (!calculator.displayValue.includes(dot)) {
    calculator.displayValue += dot;
  }
}

// 5. Gestion des opérateurs
function handleOperator(nextOperator) {
  const { firstOperand, displayValue, operator } = calculator;
  const inputValue = parseFloat(displayValue);

  // Si deux opérateurs sont cliqués d'affilée, on remplace le dernier
  if (operator && calculator.waitingForSecondOperand) {
    calculator.operator = nextOperator;
    return;
  }

  if (firstOperand === null && !isNaN(inputValue)) {
    calculator.firstOperand = inputValue;
  } else if (operator) {
    const result = calculate(firstOperand, inputValue, operator);

    // Arrondi à max 6 décimales pour éviter les problèmes d'imprécision float (ex: 0.1+0.2)
    calculator.displayValue = `${parseFloat(result.toFixed(6))}`;
    calculator.firstOperand = result;
  }

  calculator.waitingForSecondOperand = true;
  calculator.operator = nextOperator;
}

// 6. Fonction de calcul principale
function calculate(firstOperand, secondOperand, operator) {
  if (operator === '+') return firstOperand + secondOperand;
  if (operator === '-') return firstOperand - secondOperand;
  if (operator === '*') return firstOperand * secondOperand;
  if (operator === '/') {
    if (secondOperand === 0) {
      alert("Erreur : Division par zéro impossible !");
      return 0;
    }
    return firstOperand / secondOperand;
  }
  return secondOperand;
}

// 7. Réinitialisation (Bouton C)
function resetCalculator() {
  calculator.displayValue = '0';
  calculator.firstOperand = null;
  calculator.waitingForSecondOperand = false;
  calculator.operator = null;
}

// 8. Écouteur d'événements pour la grille de boutons
const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', (event) => {
  const { target } = event;
  if (!target.matches('button')) return;

  const action = target.dataset.action;
  const value = target.value;

  switch (action) {
    case 'operator':
      handleOperator(value);
      break;
    case 'decimal':
      inputDecimal(value);
      break;
    case 'clear':
      resetCalculator();
      break;
    case 'calculate':
      handleOperator(value);
      calculator.operator = null; // Réinitialise l'opérateur après égal
      break;
    default:
      if (Number.isInteger(parseFloat(value))) {
        inputDigit(value);
      }
  }

  updateDisplay();
});

// 9. Support des touches du clavier
document.addEventListener('keydown', (event) => {
  const key = event.key;

  if (!isNaN(key)) inputDigit(key);
  if (key === '.') inputDecimal('.');
  if (key === '+' || key === '-' || key === '*' || key === '/') handleOperator(key);
  if (key === 'Enter' || key === '=') handleOperator('=');
  if (key === 'Escape' || key.toLowerCase() === 'c') resetCalculator();

  updateDisplay();
});

// Initialisation
updateDisplay();