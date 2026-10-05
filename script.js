/* =========================================
   PERSONAL EXPENSE PLANNER
   ========================================= */


/* ================= ELEMENTS ================= */

const loginPage = document.getElementById("loginPage");
const dashboardPage = document.getElementById("dashboardPage");

const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");

const userName = document.getElementById("userName");
const sidebarUserName = document.getElementById("sidebarUserName");
const userAvatar = document.getElementById("userAvatar");

const budgetInput = document.getElementById("budgetInput");
const setBudgetBtn = document.getElementById("setBudgetBtn");

const budgetAmount = document.getElementById("budgetAmount");
const totalExpense = document.getElementById("totalExpense");
const remainingAmount = document.getElementById("remainingAmount");
const expenseCount = document.getElementById("expenseCount");

const progressFill = document.getElementById("progressFill");
const budgetPercentage = document.getElementById("budgetPercentage");

const spentText = document.getElementById("spentText");
const budgetText = document.getElementById("budgetText");

const expenseForm = document.getElementById("expenseForm");
const expenseList = document.getElementById("expenseList");

const clearExpenses = document.getElementById("clearExpenses");

const currentDate = document.getElementById("currentDate");
const monthName = document.getElementById("monthName");

const expenseDate = document.getElementById("expenseDate");


/* ================= DATA ================= */

let budget = Number(
    localStorage.getItem("monthlyBudget")
) || 0;

let expenses = JSON.parse(
    localStorage.getItem("expenses")
) || [];


/* ================= LOGIN ================= */

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (email === "" || password === "") {
        alert("Please enter email and password.");
        return;
    }

    /*
        Create a simple username from email.
        Example:
        raj@gmail.com → Raj
    */

    let name = email
        .split("@")[0]
        .replace(/[._-]/g, " ");

    name = name
        .split(" ")
        .map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join(" ");

    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("userName", name);

    showDashboard();

});


/* ================= SHOW DASHBOARD ================= */

function showDashboard() {

    const savedName =
        localStorage.getItem("userName") || "User";

    loginPage.classList.add("hidden");
    dashboardPage.classList.remove("hidden");

    userName.textContent = savedName;
    sidebarUserName.textContent = savedName;

    userAvatar.textContent =
        savedName.charAt(0).toUpperCase();

    updateDate();

    loadDashboard();

}


/* ================= LOGOUT ================= */

logoutBtn.addEventListener("click", function () {

    localStorage.removeItem("loggedIn");

    dashboardPage.classList.add("hidden");
    loginPage.classList.remove("hidden");

});


/* ================= BUDGET ================= */

setBudgetBtn.addEventListener("click", function () {

    const value = Number(budgetInput.value);

    if (value <= 0) {
        alert("Please enter a valid budget.");
        return;
    }

    budget = value;

    localStorage.setItem(
        "monthlyBudget",
        budget
    );

    budgetInput.value = "";

    updateDashboard();

});


/* ================= ADD EXPENSE ================= */

expenseForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name =
        document.getElementById("expenseName").value.trim();

    const amount =
        Number(document.getElementById("expenseAmount").value);

    const date =
        document.getElementById("expenseDate").value;

    const category =
        document.getElementById("expenseCategory").value;


    if (!name || amount <= 0 || !date) {

        alert("Please fill all fields correctly.");

        return;
    }


    const expense = {

        id: Date.now(),

        name: name,

        amount: amount,

        date: date,

        category: category

    };


    expenses.unshift(expense);


    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );


    expenseForm.reset();

    expenseDate.valueAsDate = new Date();

    updateDashboard();

});


/* ================= UPDATE DASHBOARD ================= */

function updateDashboard() {

    const total = expenses.reduce(
        (sum, expense) =>
            sum + Number(expense.amount),
        0
    );


    const remaining = budget - total;


    budgetAmount.textContent =
        formatCurrency(budget);

    totalExpense.textContent =
        formatCurrency(total);

    remainingAmount.textContent =
        formatCurrency(Math.max(remaining, 0));

    expenseCount.textContent =
        expenses.length;


    let percentage = 0;

    if (budget > 0) {

        percentage =
            Math.round((total / budget) * 100);

    }


    budgetPercentage.textContent =
        percentage + "%";


    progressFill.style.width =
        Math.min(percentage, 100) + "%";


    spentText.textContent =
        formatCurrency(total) + " spent";


    budgetText.textContent =
        formatCurrency(budget) + " budget";


    /*
        Change progress bar appearance
        if budget is exceeded.
    */

    if (percentage >= 100) {

        progressFill.style.background =
            "#ef5350";

    } else if (percentage >= 80) {

        progressFill.style.background =
            "#f2a93b";

    } else {

        progressFill.style.background =
            "linear-gradient(90deg, #635bff, #817bff)";

    }


    renderExpenses();

}


/* ================= RENDER EXPENSES ================= */

function renderExpenses() {

    if (expenses.length === 0) {

        expenseList.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ₹
                </div>

                <h3>No expenses yet</h3>

                <p>
                    Add your first expense to start
                    tracking your spending.
                </p>

            </div>

        `;

        return;
    }


    expenseList.innerHTML = "";


    expenses.forEach(function (expense) {

        const item =
            document.createElement("div");

        item.className =
            "expense-item";


        item.innerHTML = `

            <div class="expense-info">

                <div class="category-icon">
                    ${getCategoryIcon(expense.category)}
                </div>

                <div>

                    <div class="expense-name">
                        ${escapeHTML(expense.name)}
                    </div>

                    <div class="expense-meta">
                        ${expense.category}
                        •
                        ${formatDate(expense.date)}
                    </div>

                </div>

            </div>


            <div class="expense-right">

                <div class="expense-amount">
                    - ${formatCurrency(expense.amount)}
                </div>

                <button
                    class="delete-btn"
                    onclick="deleteExpense(${expense.id})"
                    title="Delete expense"
                >
                    ×
                </button>

            </div>

        `;


        expenseList.appendChild(item);

    });

}


/* ================= DELETE EXPENSE ================= */

function deleteExpense(id) {

    expenses =
        expenses.filter(
            expense => expense.id !== id
        );


    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );


    updateDashboard();

}


/* ================= CLEAR ALL ================= */

clearExpenses.addEventListener("click", function () {

    if (expenses.length === 0) {

        alert("There are no expenses to clear.");

        return;
    }


    const confirmDelete =
        confirm(
            "Are you sure you want to delete all expenses?"
        );


    if (!confirmDelete) {
        return;
    }


    expenses = [];


    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );


    updateDashboard();

});


/* ================= CATEGORY ICON ================= */

function getCategoryIcon(category) {

    const icons = {

        Food: "🍔",

        Travel: "🚗",

        Shopping: "🛍️",

        Bills: "📄",

        Entertainment: "🎮",

        Education: "📚",

        Other: "📦"

    };


    return icons[category] || "📦";

}


/* ================= CURRENCY ================= */

function formatCurrency(amount) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(amount);

}


/* ================= DATE ================= */

function formatDate(date) {

    const d = new Date(date);

    return d.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* ================= CURRENT DATE ================= */

function updateDate() {

    const today = new Date();


    currentDate.textContent =
        today.toLocaleDateString(
            "en-IN",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );


    monthName.textContent =
        today.toLocaleDateString(
            "en-IN",
            {
                month: "long",
                year: "numeric"
            }
        );


    expenseDate.valueAsDate =
        today;

}


/* ================= SECURITY HELPER ================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* ================= LOAD DASHBOARD ================= */

function loadDashboard() {

    updateDashboard();

}


/* ================= AUTO LOGIN ================= */

if (
    localStorage.getItem("loggedIn") === "true"
) {

    showDashboard();

} else {

    loginPage.classList.remove("hidden");
    dashboardPage.classList.add("hidden");

}
