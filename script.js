const balanceElement = document.getElementById('balance');
const incomeElement = document.getElementById('income');
const expenseElement = document.getElementById('expense');
const transactionList = document.getElementById('history-list');
const form = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

form.addEventListener('submit', addTransaction);

function addTransaction(e) {
    e.preventDefault(); // Sayfanın yenilenmesini önler
    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value.trim());

    transactions.push({
        id:Date.now(),
        description,
        amount
    })

    localStorage.setItem('transactions', JSON.stringify(transactions));
    updateTransactionList();
    updateSummary();
    
    transactionFormEl.reset();
}

function updateTransactionList() {
    transactionList.innerHTML = '';

    const sortedTransactions = [...transactions].reverse();

    sortedTransactions.forEach(transaction => {
        const transactionEl = createTransactionElement(transaction);
        transactionList.appendChild(transactionEl);
    });
}

function createTransactionElement(transaction) {
    const li = document.createElement('li');
    li.classList.add(transaction.amount < 0 ? 'expense' : 'income');
    li.innerHTML = `
        <span>${transaction.description} </span>
        <span>${formatCurrency(transaction.amount)} $
        <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">x</button></span>
    `;
    return li;
}

function updateSummary() {
    const balance = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
    const incomes = transactions.filter(transaction => transaction.amount > 0).reduce((acc, transaction) => acc + transaction.amount, 0);
    const expenses = transactions.filter(transaction => transaction.amount < 0).reduce((acc, transaction) => acc + transaction.amount, 0);
    balanceElement.innerText = formatCurrency(balance);
    incomeElement.innerText = formatCurrency(incomes);
    expenseElement.innerText = formatCurrency(Math.abs(expenses));
}

function formatCurrency(number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(number);
}

function deleteTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    updateTransactionList();
    updateSummary();
}

updateSummary();
updateTransactionList();
