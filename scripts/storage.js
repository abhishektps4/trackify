// Save transaction to localStorage
function saveTransaction(transaction) {
  const transactions = loadTransactions();
  transactions.push(transaction);
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Load all transactions
function loadTransactions() {
  return JSON.parse(localStorage.getItem('transactions')) || [];
}
