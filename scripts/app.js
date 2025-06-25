document.addEventListener('DOMContentLoaded', () => {
  loadTransactions();
  renderChart();
});

// Form submission
document.getElementById('transaction-form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const transaction = {
    id: Date.now(),
    amount: parseFloat(document.getElementById('amount').value),
    type: document.getElementById('type').value,
    category: document.getElementById('category').value,
    date: new Date().toISOString()
  };

  saveTransaction(transaction);
  updateUI();
  e.target.reset();
});

// Update UI (transactions list + summary)
function updateUI() {
  const transactions = loadTransactions();
  renderTransactions(transactions);
  updateSummary(transactions);
  renderChart();
}

// Render transactions list
function renderTransactions(transactions) {
  const container = document.getElementById('transactions-list');
  container.innerHTML = '';

  transactions.forEach(transaction => {
    const transactionEl = document.createElement('div');
    transactionEl.className = 'transaction';
    transactionEl.innerHTML = `
      <div>
        <small>${new Date(transaction.date).toLocaleDateString()}</small>
        <p>${transaction.category}</p>
      </div>
      <div class="amount ${transaction.type}">
        ${transaction.type === 'income' ? '+' : '-'}$${Math.abs(transaction.amount).toFixed(2)}
      </div>
      <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">×</button>
    `;
    container.appendChild(transactionEl);
  });
}

// Update summary cards
function updateSummary(transactions) {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  document.getElementById('total-income').textContent = `$${income.toFixed(2)}`;
  document.getElementById('total-expense').textContent = `$${expense.toFixed(2)}`;
  document.getElementById('balance').textContent = `$${(income - expense).toFixed(2)}`;
}

// Filter transactions by month/category
function filterTransactions() {
  const monthFilter = document.getElementById('month-filter').value;
  const categoryFilter = document.getElementById('category-filter').value;
  
  let transactions = loadTransactions();

  if (monthFilter) {
    const [year, month] = monthFilter.split('-');
    transactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getFullYear() === parseInt(year) && 
             date.getMonth() + 1 === parseInt(month);
    });
  }

  if (categoryFilter !== 'all') {
    transactions = transactions.filter(t => t.category === categoryFilter);
  }

  renderTransactions(transactions);
}

// Export as CSV
document.getElementById('export-csv').addEventListener('click', () => {
  const transactions = loadTransactions();
  let csv = 'Date,Amount,Type,Category\n';
  
  transactions.forEach(t => {
    csv += `${new Date(t.date).toLocaleDateString()},${t.amount},${t.type},${t.category}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'trackify-export.csv';
  a.click();
});

// Delete transaction (global function)
window.deleteTransaction = (id) => {
  let transactions = loadTransactions().filter(t => t.id !== id);
  localStorage.setItem('transactions', JSON.stringify(transactions));
  updateUI();
};
