/* =========================
   JAVASCRIPT
   ========================= */

/* Step 1: Find the optional footer year element on the portfolio page. */
const yearElement = document.getElementById("year"); // Gets the element whose text should show the current year.
if (yearElement) { // Checks that this portfolio-only element exists on the current page.
  yearElement.textContent = new Date().getFullYear(); // Writes the visitor's current calendar year into the footer.
} // Ends the optional year update.

/* Step 2: Find and connect the optional contact button. */
const emailButton = document.getElementById("emailButton"); // Gets the portfolio's email action button.
if (emailButton) { // Runs this behavior only when the portfolio button exists.
  emailButton.addEventListener("click", () => { // Waits for the visitor to activate the email action.
    window.location.href = "mailto:adam.ganczarczyk94@gmail.com"; // Opens the visitor's configured email application.
  }); // Ends the click listener.
} // Ends the optional contact-button setup.

/* Step 3: Find the optional back-to-top control used on the portfolio. */
const backToTopButton = document.getElementById("backToTop"); // Gets the portfolio's floating return-to-top button.
if (backToTopButton) { // Avoids binding events when the finance page has no such button.
  function updateButtonVisibility() { // Defines how scroll position controls the button's visibility.
    if (window.scrollY > 300) { // Checks whether the visitor has moved down the page.
      backToTopButton.classList.add("is-visible"); // Reveals the button after a meaningful scroll.
    } else { // Handles the page top and small scroll distances.
      backToTopButton.classList.remove("is-visible"); // Hides the button when it is not useful.
    } // Ends the visibility decision.
  } // Ends the visibility function.
  window.addEventListener("scroll", updateButtonVisibility, { passive: true }); // Updates visibility without blocking page scrolling.
  backToTopButton.addEventListener("click", function () { // Responds when the visitor selects the button.
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scrolls smoothly back to the start of the portfolio.
  }); // Ends the click listener.
  updateButtonVisibility(); // Sets the correct initial state when the page first loads.
} // Ends the optional back-to-top setup.

/* Step 4: Store the demonstration totals for each selectable dashboard month. */
const periodTotals = { // Starts the lookup table used by the month selector.
  october: { income: "$6,420", expenses: "$3,184", savings: "$3,236", networth: "$48,295" }, // Holds the October example totals.
  september: { income: "$5,934", expenses: "$3,296", savings: "$2,638", networth: "$47,025" }, // Holds the September example totals.
  august: { income: "$5,620", expenses: "$3,360", savings: "$2,260", networth: "$45,755" } // Holds the August example totals.
}; // Ends the sample totals lookup table.

/* Step 5: Update the visible dashboard totals when its reporting period changes. */
const periodSelect = document.getElementById("periodSelect"); // Gets the dashboard's reporting month selector when present.
if (periodSelect) { // Runs dashboard interactions only on the finance page.
  periodSelect.addEventListener("change", () => { // Waits until the visitor chooses a different month.
    const selectedTotals = periodTotals[periodSelect.value]; // Looks up sample figures for the selected month.
    if (!selectedTotals) return; // Stops safely if a new option has no matching sample data.
    Object.entries(selectedTotals).forEach(([metricName, amount]) => { // Visits each metric name and its selected value.
      const metricElement = document.querySelector(`[data-metric="${metricName}"]`); // Finds the matching total in the page.
      if (metricElement) metricElement.textContent = amount; // Replaces the displayed total when that element exists.
    }); // Ends the metric update loop.
  }); // Ends the reporting-period listener.
} // Ends the optional reporting-period setup.

/* Step 6: Let the visitor filter transactions between income and expense records. */
const filterButton = document.getElementById("filterButton"); // Gets the transaction filter control.
const showAllButton = document.getElementById("showAllButton"); // Gets the control that restores all transaction rows.
const transactionRows = document.getElementById("transactionRows"); // Gets the table body containing sample transactions.
if (transactionRows && (filterButton || showAllButton)) { // Confirms the table and at least one filter control exist.
  let activeFilter = "all"; // Starts with every transaction visible.
  const applyTransactionFilter = () => { // Defines one reusable routine for showing the selected rows.
    transactionRows.querySelectorAll("tr").forEach((row) => { // Visits every transaction row in the table.
      row.hidden = activeFilter !== "all" && row.dataset.kind !== activeFilter; // Hides rows outside the current selection.
    }); // Ends the row visibility loop.
  }; // Ends the reusable filter routine.
  if (filterButton) { // Adds the income/expense cycling control when available.
    filterButton.addEventListener("click", () => { // Responds to each filter-button activation.
      activeFilter = activeFilter === "all" ? "expense" : activeFilter === "expense" ? "income" : "all"; // Cycles through all, expenses and income.
      filterButton.innerHTML = `<span aria-hidden="true">☷</span> ${activeFilter === "all" ? "Filter" : activeFilter === "expense" ? "Expenses" : "Income"}`; // Announces the currently selected filter.
      applyTransactionFilter(); // Applies the updated selection to the table rows.
    }); // Ends the filter-button listener.
  } // Ends the optional filter-button setup.
  if (showAllButton) { // Adds the reset control when the table footer includes it.
    showAllButton.addEventListener("click", () => { // Responds when the visitor requests the complete list.
      activeFilter = "all"; // Resets the active selection to include every transaction.
      if (filterButton) filterButton.innerHTML = '<span aria-hidden="true">☷</span> Filter'; // Restores the default filter-button label.
      applyTransactionFilter(); // Shows all transaction rows again.
    }); // Ends the show-all listener.
  } // Ends the optional show-all setup.
} // Ends the optional transaction-filter setup.
