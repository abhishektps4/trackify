let myChart;

function renderChart() {
  const transactions = loadTransactions();
  const monthlyData = {};

  // Group by month
  transactions.forEach(t => {
    if (t.type !== 'expense') return;
    
    const date = new Date(t.date);
    const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
    
    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = 0;
    }
    monthlyData[monthYear] += t.amount;
  });

  const ctx = document.getElementById('chart').getContext('2d');
  const labels = Object.keys(monthlyData).sort();
  const data = labels.map(label => monthlyData[label]);

  if (myChart) myChart.destroy();

  myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Monthly Expenses',
        data: data,
        backgroundColor: '#f72585',
        borderColor: '#f72585',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}
