<script>
// New state variable
let realValue = 0; 

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

const categories = [
{
  title: 'Salary',
  type: 'income',
  img: 'https://uploads-ssl.webflow.com/650a539027eca5cedf6a5fdf/650b052b266ea7d824da666b_salary.svg'
},
{
  title: 'Other',
  type: 'income',
  img: 'https://uploads-ssl.webflow.com/650a539027eca5cedf6a5fdf/650b052bfb5f81156e12963b_other-income.svg'
},
{
  title: 'Credit card',
  type: 'expense',
  img: 'https://uploads-ssl.webflow.com/650a539027eca5cedf6a5fdf/650b076fa766915afe16cb17_credit-card.svg'
},
{
  title: 'Other',
  type: 'expense',
  img: 'https://uploads-ssl.webflow.com/650a539027eca5cedf6a5fdf/650b0770ca15b8daeb99940d_other-expenses.svg'
},
{
  title: 'Household',
  type: 'expense',
  img: 'https://uploads-ssl.webflow.com/650a539027eca5cedf6a5fdf/650b0974b5e889e34bca2619_housing.svg'
},
{
  title: 'Utilities',
  type: 'expense',
  img: 'https://uploads-ssl.webflow.com/650a539027eca5cedf6a5fdf/650b076fa21218e62f0ce089_utilities.svg'
},
{
  title: 'Insurance',
  type: 'expense',
  img: 'https://uploads-ssl.webflow.com/650a539027eca5cedf6a5fdf/650b09748ffdda916f92829d_insurance.svg'
},
{
  title: 'Shopping',
  type: 'expense',
  img: 'https://uploads-ssl.webflow.com/650a539027eca5cedf6a5fdf/650b09745fc10f833cbb018b_shopping.svg'
},
{
  title: 'Entertainment',
  type: 'expense',
  img: 'https://uploads-ssl.webflow.com/650a539027eca5cedf6a5fdf/650b0974d095abf5ac68beb0_entertainment.svg'
},
{
  title: 'Food',
  type: 'expense',
  img: 'https://uploads-ssl.webflow.com/650a539027eca5cedf6a5fdf/650b0974039db90e30f0d51d_food.svg'
},
{
  title: 'Groceries',
  type: 'expense',
  img: 'https://uploads-ssl.webflow.com/650a539027eca5cedf6a5fdf/650b0974d534e202174e3b72_groceries.svg'
},
{
  title: 'Transportation',
  type: 'expense',
  img: 'https://uploads-ssl.webflow.com/650a539027eca5cedf6a5fdf/650b0974cabd799283b8860a_transportation.svg'
},
{
  title: 'Travel',
  type: 'expense',
  img: 'https://uploads-ssl.webflow.com/650a539027eca5cedf6a5fdf/650b0974293d05b09848c35d_travel.svg'
}, ];

function populateCategoryOptions(type = 'expense') {
  const categorySelect = document.getElementById('category');
  categorySelect.innerHTML = ''; // clear the options

  const filteredCategories = categories.filter(category => category.type === type);
  filteredCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.title;
    option.textContent = category.title;
    categorySelect.appendChild(option);
  });
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
}

function formatTime(date) {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

window.onload = function() {
  renderTransactions();
  const transactionsDiv = document.getElementById('transactions');
  transactionsDiv.innerHTML = '';

  const grouped = transactions.reduce((groups, item) => {
    const date = new Date(item.date).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

  sortedDates.forEach(date => {
    const ul = document.createElement('ul');

    const h3Date = document.createElement('h3');
    h3Date.innerText = new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    transactionsDiv.appendChild(h3Date);

    grouped[date].sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(transaction => {
      const divWrapper = document.createElement('div');
      divWrapper.className = 'transaction-wrapper';
      ul.appendChild(divWrapper);

      const categoryDiv = document.createElement('div');
      categoryDiv.className = 'category-icon';
      const category = categories.find(cat => cat.title === transaction.category);
      const imgElement = document.createElement('img');
      imgElement.src = category.img;
      imgElement.alt = category.title;
      categoryDiv.appendChild(imgElement);
      divWrapper.appendChild(categoryDiv);

      const divTransactionDetails = document.createElement('div');
      divTransactionDetails.className = 'transaction-details';
      divWrapper.appendChild(divTransactionDetails);

      const divTransactionCategory = document.createElement('div');
      divTransactionCategory.className = 'transaction-category';
      divTransactionDetails.appendChild(divTransactionCategory);

      const liCategory = document.createElement('li');
      liCategory.className = 'transaction-category-name';
      liCategory.innerText = transaction.category;
      divTransactionCategory.appendChild(liCategory);

      const liTime = document.createElement('li');
      liTime.className = 'transaction-time';
      liTime.innerText = formatTime(new Date(transaction.date));
      divTransactionCategory.appendChild(liTime);

      const liName = document.createElement('li');
      liName.className = 'transaction-name';
      liName.innerText = transaction.name;
      divTransactionDetails.appendChild(liName);

      const liAmount = document.createElement('li');
      liAmount.className = 'transaction-amount';
      liAmount.innerText = formatCurrency(transaction.amount);
      divWrapper.appendChild(liAmount);

      const btnDelete = document.createElement('button');
      btnDelete.className = 'delete-btn';
      btnDelete.innerText = 'Delete';
      btnDelete.onclick = () => deleteTransaction(transaction.id);
      divWrapper.appendChild(btnDelete);

      divTransactionDetails.addEventListener('click', function (event) {
        event.stopPropagation();

        // Check if the delete button for this transaction is visible
        const isDeleteVisible = btnDelete.style.display === 'block';

        hideAllDeleteButtons(); // First, hide all delete buttons

        if (isDeleteVisible) {
          // If the delete button for this transaction was visible, hide it
          btnDelete.style.display = 'none';
          divWrapper.classList.remove('shifted');
        } else {
          // Otherwise, show the delete button for this transaction
          btnDelete.style.display = 'block';
          divWrapper.classList.add('shifted');
        }
      });
    });

    transactionsDiv.appendChild(ul);
  });

  // Handling the visibility of .empty-state based on transactions
  const emptyState = document.querySelector('.empty-state');

  if (transactions.length === 0) {
    emptyState.style.display = 'flex'; // Show empty state
  } else {
    emptyState.style.display = 'none'; // Hide empty state
  }

  updateBalance();
}

function hideAllDeleteButtons() {
  const allDeleteButtons = document.querySelectorAll('.delete-btn');
  allDeleteButtons.forEach(btn => {
    btn.style.display = 'none';
  });

  // Remove the shifted class from all wrappers
  const allWrappers = document.querySelectorAll('.transaction-wrapper');
  allWrappers.forEach(wrapper => {
    wrapper.classList.remove('shifted');
  });
}

function updateBalance() {
  const balanceElement = document.getElementById('balance');
  let total = transactions.reduce((sum, trans) => sum + trans.amount, 0);
  balanceElement.textContent = formatCurrency(total);
}

function addTransaction() {
  const nameInput = document.getElementById('name');
  const amountInput = document.getElementById('amount');
  const transactionType = document.getElementById('transactionType').value;
  const selectedCategory = document.getElementById('category').value;

  if (!nameInput.value || !amountInput.value) return;

  // Use the real value here
  let amount = realValue / 100.0;

  if (transactionType === 'expense') {
    amount = -Math.abs(amount);
  }

  const newTransaction = {
    id: new Date().getTime().toString(),
    name: nameInput.value,
    amount: amount,
    date: new Date().toISOString(),
    category: selectedCategory
  };
  transactions.push(newTransaction);

  localStorage.setItem('transactions', JSON.stringify(transactions));

  nameInput.value = '';
  amountInput.value = '';

  document.querySelector('.transaction-form').style.display = 'none';

  renderTransactions();
}

function deleteTransaction(id) {
  transactions = transactions.filter(trans => trans.id !== id);
  localStorage.setItem('transactions', JSON.stringify(transactions));
  renderTransactions();
}

document.getElementById('amount').addEventListener('input', function(e) {
  let value = e.target.value.replace(/\D/g, '');  // Remove all non-digit characters
  realValue = parseInt(value, 10); // Store the value in cents
  let numberValue = realValue / 100;  // Convert to a number and divide by 100 for display
  e.target.value = formatCurrency(numberValue);  // Set the formatted value back to the input field
});

document.addEventListener('click', function (event) {
  if (!event.target.classList.contains('delete-btn') && !event.target.closest(
      '.transaction-data')) {
    hideAllDeleteButtons();
  }
});

document.getElementById('add-transaction').addEventListener('click', function () {
  document.querySelector('.transaction-form').style.display = 'block';
  document.getElementById('amount').focus();
});

document.getElementById('cancel-transaction').addEventListener('click', function () {
  document.querySelector('.transaction-form').style.display = 'none';

  // Clearing any data that was inputted
  document.querySelectorAll('.transaction-form input').forEach(input => {
    input.value = '';
  });
});
</script>
