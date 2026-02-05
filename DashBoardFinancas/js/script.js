const transactionList = document.getElementById('transactionList');
const balanceDisplay = document.getElementById('balanceDisplay');
const incomeDisplay = document.getElementById('incomeDisplay');
const expenseDisplay = document.getElementById('expenseDisplay');
const form = document.getElementById('form');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

//function to calculate and update the balance, income and expense values
const updateValues = () => {
    const amounts = transactions.map(transaction => transaction.amount);

    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => acc + item, 0)
        .toFixed(2);
        
    const expense = Math.abs(
        amounts
            .filter(item => item < 0)
            .reduce((acc, item) => acc + item, 0)
    ).toFixed(2);

    const total = (income - expense).toFixed(2);

    balanceDisplay.innerText = `R$ ${total}`;
    incomeDisplay.innerText = `R$ ${income}`;
    expenseDisplay.innerText = `R$ ${expense}`;

    updateChart(income, expense);
}

const addTransactionIntoDOM = ({id, name, amount}) => {
    const operator = amount < 0 ? '-' : '+';
    const CSSClass = amount < 0 ? 'minus' : 'plus';
    const amountWithoutOperator = Math.abs(amount);
    const li = document.createElement('li');

    li.classList.add(CSSClass);
    li.innerHTML = `
        ${name} <span>${operator} R$ ${amountWithoutOperator}</span>
        <button class="delete-btn" onclick="removeTransaction(${id})">x</button>
    `;

    transactionList.append(li);
}

let myChart;

const updateChart = (income, expense) => {
    const canvas = document.getElementById('myChart')
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (myChart) {
        myChart.destroy();
    }

    if (income == 0 && expense == 0) return;

    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Entradas', 'Saídas'],
            datasets: [{
                data: [income, expense],
                backgroundColor: ['#2ecc71', '#e74c3c'],
                borderWidth: 1
            }]
        },
        options: {responsive: true}
    });
}

const removeTransaction = id => {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    init();
}

const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

const init = () => {
    transactionList.innerHTML = '';
    transactions.forEach(addTransactionIntoDOM);
    updateValues();
}

form.addEventListener('submit', event => {
    event.preventDefault();

    const transactionName = textInput.value.trim();
    const transactionAmount = amountInput.value.trim();

    if (transactionName === '' || transactionAmount === '') {
        alert('Por favor, preencha ambos os campos.');
        return;
    }

    const transaction = {
        id: Math.floor(Math.random() * 10000),
        name: transactionName,
        amount: Number(transactionAmount)
    };

    transactions.push(transaction);
    init();
    updateLocalStorage();

    textInput.value = '';
    amountInput.value = '';
});
init();