const display = document.querySelector("#display");
const buttons = document.querySelector(".buttons");

let currentValue = "0";
let storedValue = null;
let pendingOperator = null;
let replaceCurrent = false;
let lastOperator = null;
let lastOperand = null;

function render() {
	display.textContent = currentValue;
}

function clear() {
	currentValue = "0";
	storedValue = null;
	pendingOperator = null;
	replaceCurrent = false;
	lastOperator = null;
	lastOperand = null;
	render();
}

function enterDigit(digit) {
	if (currentValue === "Error" || replaceCurrent) {
		currentValue = digit === "." ? "0." : digit;
		replaceCurrent = false;
	} else if (digit === ".") {
		if (!currentValue.includes(".")) currentValue += ".";
	} else {
		currentValue = currentValue === "0" ? digit : currentValue + digit;
	}
	render();
}

function calculate(left, right, operator) {
	switch (operator) {
		case "add": return left + right;
		case "subtract": return left - right;
		case "multiply": return left * right;
		case "divide": return right === 0 ? null : left / right;
		default: return right;
	}
}

function formatResult(result) {
	return String(Number(result.toPrecision(12)));
}

function chooseOperator(operator) {
	if (currentValue === "Error") return;

	const inputValue = Number(currentValue);
	if (pendingOperator && !replaceCurrent) {
		const result = calculate(storedValue, inputValue, pendingOperator);
		if (result === null) {
			currentValue = "Error";
			storedValue = null;
			pendingOperator = null;
			replaceCurrent = true;
			render();
			return;
		}
		currentValue = formatResult(result);
		storedValue = result;
	} else {
		storedValue = inputValue;
	}

	pendingOperator = operator;
	replaceCurrent = true;
	lastOperator = null;
	lastOperand = null;
	render();
}

function equals() {
	if (currentValue === "Error") return;

	if (pendingOperator) {
		const operand = Number(currentValue);
		const result = calculate(storedValue, operand, pendingOperator);
		if (result === null) {
			currentValue = "Error";
		} else {
			currentValue = formatResult(result);
			lastOperator = pendingOperator;
			lastOperand = operand;
		}
		pendingOperator = null;
		storedValue = null;
		replaceCurrent = true;
	} else if (lastOperator && lastOperand !== null && replaceCurrent) {
		const result = calculate(Number(currentValue), lastOperand, lastOperator);
		currentValue = result === null ? "Error" : formatResult(result);
	}

	render();
}

function handleAction(action) {
	if (action === "clear") clear();
	else if (action === "equals") equals();
	else chooseOperator(action);
}

buttons.addEventListener("click", (event) => {
	const button = event.target.closest("button");
	if (!button) return;

	if (button.dataset.value !== undefined) enterDigit(button.dataset.value);
	else if (button.dataset.action) handleAction(button.dataset.action);
});

document.addEventListener("keydown", (event) => {
	if (/^[0-9.]$/.test(event.key)) enterDigit(event.key);
	else if (event.key === "+") chooseOperator("add");
	else if (event.key === "-") chooseOperator("subtract");
	else if (event.key === "*") chooseOperator("multiply");
	else if (event.key === "/") {
		event.preventDefault();
		chooseOperator("divide");
	} else if (event.key === "Enter" || event.key === "=") equals();
	else if (event.key === "Escape") clear();
	else if (event.key === "Backspace" && currentValue !== "Error" && !replaceCurrent) {
		currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : "0";
		if (currentValue === "-" || currentValue === "") currentValue = "0";
		render();
	}
});
