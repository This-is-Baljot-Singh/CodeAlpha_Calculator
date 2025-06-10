let state = {
    display: '0',
    previousValue: null,
    operation: null,
    waitingForOperand: false
};

function formatDisplay(val) {
    return val.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function updateDisplay() {
    document.getElementById('display').textContent = formatDisplay(state.display);
    document.getElementById('prev').textContent =
        state.previousValue !== null && state.operation
            ? `${formatDisplay(String(state.previousValue))} ${state.operation}`
            : '';
}

function clearAll() {
    state.display = '0';
    state.previousValue = null;
    state.operation = null;
    state.waitingForOperand = false;
    updateDisplay();
}

function deleteLast() {
    if (state.display.length > 1) {
        state.display = state.display.slice(0, -1);
    } else {
        state.display = '0';
    }
    updateDisplay();
}

function inputNumber(num) {
    if (state.waitingForOperand) {
        state.display = num;
        state.waitingForOperand = false;
    } else {
        state.display = state.display === '0' ? num : state.display + num;
    }
    updateDisplay();
}

function inputDecimal() {
    if (!state.display.includes('.')) {
        state.display += '.';
        updateDisplay();
    }
}

function inputOperation(op) {
    if (state.operation && !state.waitingForOperand) {
        performCalculation();
    }
    state.previousValue = parseFloat(state.display);
    state.operation = op;
    state.waitingForOperand = true;
    updateDisplay();
}

function performCalculation() {
    if (state.operation && state.previousValue !== null) {
        let current = parseFloat(state.display);
        let result = 0;
        switch (state.operation) {
            case '+':
                result = state.previousValue + current;
                break;
            case '-':
                result = state.previousValue - current;
                break;
            case '×':
                result = state.previousValue * current;
                break;
            case '÷':
                result = current !== 0 ? state.previousValue / current : 'Error';
                break;
        }
        state.display = String(result).slice(0, 12);
        state.previousValue = null;
        state.operation = null;
        state.waitingForOperand = false;
        updateDisplay();
    }
}

// Button event listeners
document.querySelectorAll('[data-num]').forEach(btn =>
    btn.addEventListener('click', e => inputNumber(e.target.textContent.trim()))
);
document.querySelectorAll('[data-op]').forEach(btn =>
    btn.addEventListener('click', e => inputOperation(e.target.textContent.trim()))
);
document.getElementById('decimal').addEventListener('click', inputDecimal);
document.getElementById('clear').addEventListener('click', clearAll);
document.getElementById('delete').addEventListener('click', deleteLast);
document.getElementById('equals').addEventListener('click', performCalculation);

// Keyboard support
document.addEventListener('keydown', e => {
    if (e.key >= '0' && e.key <= '9') inputNumber(e.key);
    if (e.key === '.') inputDecimal();
    if (e.key === '+' || e.key === '-') inputOperation(e.key);
    if (e.key === '*' || e.key === 'x') inputOperation('×');
    if (e.key === '/') inputOperation('÷');
    if (e.key === 'Enter' || e.key === '=') performCalculation();
    if (e.key === 'Backspace') deleteLast();
    if (e.key === 'Escape') clearAll();
});

updateDisplay();