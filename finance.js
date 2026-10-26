/* ============================================================
   PERSONAL FINANCE DASHBOARD
   Handles adding, editing, deleting and saving transactions.
   ============================================================ */

// Wrap the code in a function to prevent variable conflicts
// with your other JavaScript file, portfolio.js.
(() => {
  "use strict"; // Helps JavaScript detect common coding mistakes.

  /* STEP 1: Find the HTML elements used by this page. */

  const form = document.querySelector("#transaction-form");
  // Finds the form used to add or edit a transaction.

  const transactionRows = document.querySelector("#transactionRows");
  // Finds the table body where transaction rows will appear.

  const descriptionInput = document.querySelector("#description");
  // Finds the field where the transaction description is entered.

  const amountInput = document.querySelector("#amount");
  // Finds the field where the transaction amount is entered.

  const typeInput = document.querySelector("#type");
  // Finds the dropdown for choosing income or expense.

  const categoryInput = document.querySelector("#category");
  // Finds the dropdown for choosing a transaction category.

  const dateInput = document.querySelector("#date");
  // Finds the field for the transaction date.

  const submitButton = document.querySelector("#submit-button");
  // Finds the main Add transaction / Save changes button.

  const cancelButton = document.querySelector("#cancel-edit");
  // Finds the button used to cancel editing.

  const editorTitle = document.querySelector("#editor-title");
  // Finds the heading above the transaction form.

  const editorSection = document.querySelector("#transaction-editor");
  // Finds the section containing the transaction form.


  /* STEP 2: Check that the required HTML elements exist. */

  if (
    !form ||
    !transactionRows ||
    !descriptionInput ||
    !amountInput ||
    !typeInput ||
    !categoryInput ||
    !dateInput ||
    !submitButton ||
    !cancelButton ||
    !editorTitle ||
    !editorSection
  ) {
    // Show an error in the browser console if an HTML ID is missing.
    console.error(
      "Dashboard setup failed. Check the HTML element IDs."
    );

    return; // Stop running this code to avoid further errors.
  }


  /* STEP 3: Set up browser storage and sample transactions. */

  const storageKey = "finance-transactions";
  // This is the name used to save transactions in localStorage.

  const starterTransactions = [
    {
      id: "sample-1",
      description: "Monthly salary",
      category: "Salary",
      type: "income",
      amount: 5800,
      date: "2026-10-25"
    },
    {
      id: "sample-2",
      description: "Weekly groceries",
      category: "Food",
      type: "expense",
      amount: 126.40,
      date: "2026-10-24"
    },
    {
      id: "sample-3",
      description: "Rent payment",
      category: "Housing",
      type: "expense",
      amount: 1150,
      date: "2026-10-22"
    },
    {
      id: "sample-4",
      description: "Savings interest",
      category: "Interest",
      type: "income",
      amount: 18.42,
      date: "2026-10-20"
    },
    {
      id: "sample-5",
      description: "Monthly transport pass",
      category: "Transport",
      type: "expense",
      amount: 112,
      date: "2026-10-18"
    }
  ];
  // These example transactions appear when there is no saved data.

  let transactions = loadTransactions();
  // Load saved transactions or use the sample transactions.

  let editingId = null;
  // Stores the ID of the transaction currently being edited.
  // A value of null means the form is in Add mode.


  /* STEP 4: Format numbers as Australian dollars. */

  function formatMoney(amount) {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD"
    }).format(amount);
    // Converts a number into a currency string, such as $100.00.
  }


  /* STEP 5: Load saved transactions from the browser. */

  function loadTransactions() {
    try {
      // Read the saved transaction data from localStorage.
      const saved = localStorage.getItem(storageKey);

      // Check whether saved data exists.
      if (saved !== null) {
        // Convert the saved JSON text back into JavaScript data.
        const parsed = JSON.parse(saved);

        // Make sure the saved data is an array.
        if (Array.isArray(parsed)) {
          // Keep only transactions containing valid information.
          return parsed.filter(isValidTransaction);
        }
      }
    } catch (error) {
      // Show an error if the data cannot be read or parsed.
      console.error("Could not load transactions:", error);
    }

    // If nothing was saved, return a fresh copy of the examples.
    return starterTransactions.map(transaction => ({
      ...transaction
    }));
  }


  /* STEP 6: Check that a transaction contains valid data. */

  function isValidTransaction(item) {
    return Boolean(
      item &&
      typeof item.id === "string" &&
      typeof item.description === "string" &&
      typeof item.category === "string" &&
      (item.type === "income" || item.type === "expense") &&
      Number.isFinite(Number(item.amount)) &&
      Number(item.amount) > 0 &&
      typeof item.date === "string"
    );
    // Invalid or incomplete saved records are not displayed.
  }


  /* STEP 7: Save transactions to browser storage. */

  function saveTransactions() {
    try {
      // Convert the transaction array into JSON and save it.
      localStorage.setItem(
        storageKey,
        JSON.stringify(transactions)
      );

      return true; // Tell the calling function saving succeeded.

    } catch (error) {
      // Report the problem if browser storage is unavailable.
      console.error("Could not save transactions:", error);

      alert(
        "Your browser could not save the transaction. " +
        "Try opening this page in a normal browser tab."
      );

      return false; // Tell the calling function saving failed.
    }
  }


  /* STEP 8: Display transactions in the HTML table. */

  function renderDashboard() {
    // Remove the old rows before displaying the latest data.
    transactionRows.replaceChildren();

    // Make a copy of the list and sort newest dates first.
    const sortedTransactions = [...transactions].sort(
      (first, second) =>
        second.date.localeCompare(first.date)
    );

    // Repeat this code once for every transaction.
    sortedTransactions.forEach(transaction => {

      // Create a new table row.
      const row = document.createElement("tr");

      // Keep the income/expense type available to other scripts.
      row.dataset.kind = transaction.type;


      // Create the transaction description cell.
      const nameCell = document.createElement("td");

      // Create a container for the description and category.
      const nameContainer = document.createElement("span");
      nameContainer.className = "transaction-name";

      // Create the transaction description text.
      const name = document.createElement("strong");
      name.textContent = transaction.description;

      // Create smaller text showing the category.
      const subtitle = document.createElement("small");
      subtitle.textContent = transaction.category;

      // Put the description and category into the container.
      nameContainer.append(name, subtitle);

      // Put the container into the table cell.
      nameCell.appendChild(nameContainer);


      // Create the category cell and its styled label.
      const categoryCell = document.createElement("td");
      const categoryLabel = document.createElement("span");

      categoryLabel.className = "table-category";
      categoryLabel.textContent = transaction.category;

      categoryCell.appendChild(categoryLabel);


      // Create and format the date cell.
      const dateCell = document.createElement("td");

      dateCell.textContent = new Date(
        transaction.date + "T12:00:00"
      ).toLocaleDateString("en-AU", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });


      // Create a status cell for the transaction.
      const statusCell = document.createElement("td");
      const status = document.createElement("span");

      status.className = "status-pill complete";
      status.textContent = "Recorded";

      statusCell.appendChild(status);


      // Create the amount cell.
      const amountCell = document.createElement("td");
      amountCell.className = "amount";

      // Income gets a plus sign; expenses get a minus sign.
      const sign =
        transaction.type === "income" ? "+" : "−";

      // Format the amount as Australian currency.
      amountCell.textContent =
        sign + formatMoney(Number(transaction.amount));

      // Highlight income using the existing CSS class.
      if (transaction.type === "income") {
        amountCell.classList.add("positive-amount");
      }


      /* STEP 8A: Create the Edit button. */

      const actionsCell = document.createElement("td");
      actionsCell.className = "transaction-actions";

      const editButton = document.createElement("button");

      editButton.type = "button";
      editButton.className = "row-action";
      editButton.textContent = "Edit";

      // When clicked, load this transaction into the form.
      editButton.addEventListener("click", () => {
        editTransaction(transaction.id);
      });


      /* STEP 8B: Create the Delete button. */

      const deleteButton = document.createElement("button");

      deleteButton.type = "button";
      deleteButton.className = "row-action delete-action";
      deleteButton.textContent = "Delete";

      // When clicked, ask the user to delete this transaction.
      deleteButton.addEventListener("click", () => {
        deleteTransaction(transaction.id);
      });


      // Add both buttons to the actions cell.
      actionsCell.append(editButton, deleteButton);

      // Add all six cells to the table row.
      row.append(
        nameCell,
        categoryCell,
        dateCell,
        statusCell,
        amountCell,
        actionsCell
      );

      // Display the completed row in the table.
      transactionRows.appendChild(row);
    });

    // Refresh the summary cards after updating the table.
    updateSummary();

    // Refresh the transaction count under the table.
    updateTransactionCount(sortedTransactions.length);
  }


  /* STEP 9: Calculate income, expenses and savings. */

  function updateSummary() {

    // Add together all transactions marked as income.
    const income = transactions
      .filter(item => item.type === "income")
      .reduce(
        (total, item) => total + Number(item.amount),
        0
      );

    // Add together all transactions marked as expenses.
    const expenses = transactions
      .filter(item => item.type === "expense")
      .reduce(
        (total, item) => total + Number(item.amount),
        0
      );

    // Savings is income minus expenses.
    const savings = income - expenses;

    // Calculate the savings rate, avoiding division by zero.
    const savingsRate =
      income > 0 ? (savings / income) * 100 : 0;


    // Find the summary values in the HTML.
    const incomeMetric =
      document.querySelector('[data-metric="income"]');

    const expensesMetric =
      document.querySelector('[data-metric="expenses"]');

    const savingsMetric =
      document.querySelector('[data-metric="savings"]');


    // Update each summary value if the element exists.
    if (incomeMetric) {
      incomeMetric.textContent = formatMoney(income);
    }

    if (expensesMetric) {
      expensesMetric.textContent = formatMoney(expenses);
    }

    if (savingsMetric) {
      savingsMetric.textContent = formatMoney(savings);
    }


    // Find and update the savings rate note.
    const savingsNote =
      document.querySelector(".savings-card .metric-note");

    if (savingsNote) {
      savingsNote.textContent =
        `${savingsRate.toFixed(1)}% savings rate`;
    }
  }


  /* STEP 10: Update the transaction count below the table. */

  function updateTransactionCount(count) {
    const countText =
      document.querySelector(".table-footer > span");

    if (countText) {
      // Display the count with the correct singular/plural wording.
      countText.textContent =
        `Showing ${count} transaction${count === 1 ? "" : "s"}`;
    }
  }


  /* STEP 11: Load an existing transaction for editing. */

  function editTransaction(id) {

    // Find the transaction that matches the clicked Edit button.
    const transaction = transactions.find(
      item => item.id === id
    );

    // Stop if the transaction cannot be found.
    if (!transaction) return;

    // Remember which transaction is being edited.
    editingId = id;

    // Fill in the existing transaction details.
    descriptionInput.value = transaction.description;
    amountInput.value = transaction.amount;
    typeInput.value = transaction.type;
    categoryInput.value = transaction.category;
    dateInput.value = transaction.date;

    // Change the form button and heading to edit mode.
    submitButton.textContent = "Save changes";
    cancelButton.hidden = false;
    editorTitle.textContent = "Edit transaction";

    // Scroll the form into view.
    editorSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    // Put the cursor in the description field.
    descriptionInput.focus();
  }


  /* STEP 12: Cancel editing and reset the form. */

  function cancelEditing() {

    // Clear the editing ID so the next submission adds a new record.
    editingId = null;

    // Reset all form fields to their default values.
    form.reset();

    // Restore the original Add transaction button.
    submitButton.textContent = "Add transaction";

    // Hide the Cancel button.
    cancelButton.hidden = true;

    // Restore the original form heading.
    editorTitle.textContent = "Add a transaction";
  }


  /* STEP 13: Delete a transaction. */

  function deleteTransaction(id) {

    // Find the selected transaction.
    const transaction = transactions.find(
      item => item.id === id
    );

    // Stop if the transaction no longer exists.
    if (!transaction) return;

    // Ask the user to confirm the deletion.
    const confirmed = confirm(
      `Delete "${transaction.description}"?`
    );

    // Do nothing if the user presses Cancel.
    if (!confirmed) return;

    // Keep the current list in case saving fails.
    const previousTransactions = transactions;

    // Create a new list without the selected transaction.
    transactions = transactions.filter(
      item => item.id !== id
    );

    // Try to save the updated list.
    if (!saveTransactions()) {

      // Restore the original list if saving fails.
      transactions = previousTransactions;

      return; // Stop without showing an unsaved deletion.
    }

    // If the deleted transaction was being edited, reset the form.
    if (editingId === id) {
      cancelEditing();
    }

    // Refresh the table and summary cards.
    renderDashboard();
  }


  /* STEP 14: Add new transactions and save edits. */

  form.addEventListener("submit", event => {

    // Prevent the browser from reloading the page.
    event.preventDefault();

    // Read the form fields and remove extra description spaces.
    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);
    const type = typeInput.value;
    const category = categoryInput.value;
    const date = dateInput.value;


    // Check the required fields and ensure the amount is positive.
    if (
      !description ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      !date
    ) {
      alert(
        "Please enter a description, a valid amount greater " +
        "than zero, and a date."
      );

      return; // Stop if the information is invalid.
    }


    // Make sure the transaction type is valid.
    if (type !== "income" && type !== "expense") {
      alert("Please choose Income or Expense.");
      return;
    }


    // Make a copy of the current list before changing anything.
    let nextTransactions = [...transactions];


    // If editingId has a value, update the existing transaction.
    if (editingId !== null) {

      // Find the position of the transaction being edited.
      const transactionIndex = nextTransactions.findIndex(
        item => item.id === editingId
      );

      // Handle the case where the transaction cannot be found.
      if (transactionIndex === -1) {
        alert(
          "That transaction could not be found. Please try again."
        );

        cancelEditing();
        return;
      }

      // Replace the old transaction with its updated details.
      nextTransactions[transactionIndex] = {
        ...nextTransactions[transactionIndex],
        description,
        amount,
        type,
        category,
        date
      };

    } else {

      // Create a unique ID for a new transaction.
      const newId =
        window.crypto &&
        typeof window.crypto.randomUUID === "function"
          ? window.crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

      // Add the new transaction to the copied list.
      nextTransactions.push({
        id: newId,
        description,
        amount,
        type,
        category,
        date
      });
    }


    // Keep the previous list in case the save operation fails.
    const previousTransactions = transactions;

    // Apply the proposed changes.
    transactions = nextTransactions;

    // Save the updated list to localStorage.
    if (!saveTransactions()) {

      // Undo the changes if saving was unsuccessful.
      transactions = previousTransactions;

      return;
    }

    // Clear the form and return to Add mode.
    cancelEditing();

    // Redraw the table and update the summary totals.
    renderDashboard();
  });


  /* STEP 15: Make the Cancel button work. */

  cancelButton.addEventListener("click", cancelEditing);
  // Clicking Cancel returns the form to Add mode.


  /* STEP 16: Display transactions when the page first opens. */

  renderDashboard();
  // Draw saved transactions or the initial sample transactions.

})(); // End of the dashboard's private function.
