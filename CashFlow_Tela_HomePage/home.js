class FinanceManager {
    constructor() {
        this.transactions = [];
        this.init();
    }

    init() {
        this.loadTransactions();
        this.bindEvents();
        this.updateDisplay();
        this.setTodayDate();
        this.initTabs();
    }

    initTabs() {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetTab = e.target.getAttribute('data-tab');
                this.switchTab(targetTab);
            });
        });
    }

    switchTab(tabName) {
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(tabName).classList.add('active');
    }

    bindEvents() {
        document.getElementById('transactionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTransaction();
        });

        document.getElementById('filterType').addEventListener('change', () => {
            this.filterTransactions();
        });

        document.getElementById('clearAll').addEventListener('click', () => {
            this.clearAllTransactions();
        });

        document.getElementById('category').addEventListener('change', (e) => {
            this.autoSetType(e.target.value);
        });
    }

    setTodayDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;
    }

    autoSetType(category) {
        const incomeCategories = ['salario', 'freelance', 'investimentos', 'outros-receitas'];
        const typeSelect = document.getElementById('type');

        if (incomeCategories.includes(category)) {
            typeSelect.value = 'income';
        } else if (category && !incomeCategories.includes(category)) {
            typeSelect.value = 'expense';
        }
    }

    addTransaction() {
        const transaction = {
            id: Date.now(),
            description: document.getElementById('description').value,
            amount: parseFloat(document.getElementById('amount').value),
            category: document.getElementById('category').value,
            type: document.getElementById('type').value,
            date: document.getElementById('date').value
        };

        if (!transaction.description || !transaction.amount || !transaction.category || !transaction.type || !transaction.date) {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        if (transaction.amount <= 0) {
            alert('O valor deve ser maior que zero!');
            return;
        }

        this.transactions.push(transaction);
        this.saveTransactions();
        this.updateDisplay();
        this.clearForm();
        this.showSuccessMessage('Transação adicionada com sucesso!');
    }

    clearForm() {
        document.getElementById('transactionForm').reset();
        this.setTodayDate();
    }

    showSuccessMessage(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #48bb78;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 3000);
    }

    deleteTransaction(id) {
        if (confirm('Tem certeza que deseja excluir esta transação?')) {
            this.transactions = this.transactions.filter(t => t.id !== id);
            this.saveTransactions();
            this.updateDisplay();
            this.showSuccessMessage('Transação excluída com sucesso!');
        }
    }

    clearAllTransactions() {
        if (confirm('Tem certeza que deseja excluir TODAS as transações? Esta ação não pode ser desfeita!')) {
            this.transactions = [];
            this.saveTransactions();
            this.updateDisplay();
            this.showSuccessMessage('Todas as transações foram excluídas!');
        }
    }

    filterTransactions() {
        const filterValue = document.getElementById('filterType').value;
        this.displayTransactions(filterValue);
    }

    updateDisplay() {
        this.updateSummary();
        this.displayTransactions();
        this.updateChart();
    }

    updateSummary() {
        const income = this.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expenses = this.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const balance = income - expenses;

        document.querySelector('.income-total').textContent = this.formatCurrency(income);
        document.querySelector('.expense-total').textContent = this.formatCurrency(expenses);
        document.querySelector('.balance-total').textContent = this.formatCurrency(balance);

        const balanceElement = document.querySelector('.balance-total');
        if (balance >= 0) {
            balanceElement.style.color = '#48bb78';
        } else {
            balanceElement.style.color = '#e53e3e';
        }
    }

    displayTransactions(filter = 'all') {
        const transactionList = document.getElementById('transactionList');
        let filteredTransactions = this.transactions;

        if (filter !== 'all') {
            filteredTransactions = this.transactions.filter(t => t.type === filter);
        }

        if (filteredTransactions.length === 0) {
            transactionList.innerHTML = `
                <div class="empty-state">
                    <p>📊 Nenhuma transação encontrada</p>
                    <p>Adicione sua primeira transação acima!</p>
                </div>
            `;
            return;
        }

        filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        transactionList.innerHTML = filteredTransactions.map(transaction => `
            <div class="transaction-item ${transaction.type}">
                <div class="transaction-info">
                    <h4>${transaction.description}</h4>
                    <p>${this.formatCategory(transaction.category)} • ${this.formatDate(transaction.date)}</p>
                </div>
                <div style="display: flex; align-items: center;">
                    <span class="transaction-amount ${transaction.type}">
                        ${transaction.type === 'income' ? '+' : '-'} ${this.formatCurrency(transaction.amount)}
                    </span>
                    <button class="delete-btn" onclick="financeManager.deleteTransaction(${transaction.id})">
                        🗑️
                    </button>
                </div>
            </div>
        `).join('');
    }

    updateChart() {
        const canvas = document.getElementById('categoryChart');
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const categoryTotals = {};
        this.transactions.forEach(t => {
            if (!categoryTotals[t.category]) {
                categoryTotals[t.category] = 0;
            }
            categoryTotals[t.category] += t.amount;
        });

        const categories = Object.keys(categoryTotals);
        const values = Object.values(categoryTotals);

        if (categories.length === 0) {
            ctx.fillStyle = '#718096';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Nenhuma transação para exibir', canvas.width / 2, canvas.height / 2);
            return;
        }

        const maxValue = Math.max(...values);
        const barWidth = canvas.width / categories.length - 20;
        const maxBarHeight = canvas.height - 60;

        categories.forEach((category, index) => {
            const barHeight = (categoryTotals[category] / maxValue) * maxBarHeight;
            const x = index * (barWidth + 20) + 10;
            const y = canvas.height - barHeight - 40;

            ctx.fillStyle = `hsl(${index * 60}, 70%, 60%)`;
            ctx.fillRect(x, y, barWidth, barHeight);

            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(
                this.formatCategory(category).substring(0, 8) + '...',
                x + barWidth / 2,
                canvas.height - 20
            );

            ctx.fillText(
                this.formatCurrency(categoryTotals[category]),
                x + barWidth / 2,
                y - 5
            );
        });
    }

    // ========== FERRAMENTAS FINANCEIRAS ==========

    calculateSalary() {
        const grossSalary = parseFloat(document.getElementById('grossSalary').value);
        const dependents = parseInt(document.getElementById('dependents').value) || 0;
        const healthPlan = parseFloat(document.getElementById('healthPlan').value) || 0;

        if (!grossSalary || grossSalary <= 0) {
            alert('Por favor, insira um salário bruto válido!');
            return;
        }

        // Cálculo do INSS (2023 - tabela progressiva)
        let inss = 0;
        if (grossSalary <= 1320.00) {
            inss = grossSalary * 0.075;
        } else if (grossSalary <= 2571.29) {
            inss = 1320.00 * 0.075 + (grossSalary - 1320.00) * 0.09;
        } else if (grossSalary <= 3856.94) {
            inss = 1320.00 * 0.075 + (2571.29 - 1320.00) * 0.09 + (grossSalary - 2571.29) * 0.12;
        } else if (grossSalary <= 7507.49) {
            inss = 1320.00 * 0.075 + (2571.29 - 1320.00) * 0.09 +
                (3856.94 - 2571.29) * 0.12 + (grossSalary - 3856.94) * 0.14;
        } else {
            inss = 1320.00 * 0.075 + (2571.29 - 1320.00) * 0.09 +
                (3856.94 - 2571.29) * 0.12 + (7507.49 - 3856.94) * 0.14;
        }

        // Base para cálculo do IRRF
        const baseIRRF = grossSalary - inss - (dependents * 189.59) - healthPlan;

        // Cálculo do IRRF (2023)
        let irrf = 0;
        if (baseIRRF <= 2112.00) {
            irrf = 0;
        } else if (baseIRRF <= 2826.65) {
            irrf = baseIRRF * 0.075 - 158.40;
        } else if (baseIRRF <= 3751.05) {
            irrf = baseIRRF * 0.15 - 370.40;
        } else if (baseIRRF <= 4664.68) {
            irrf = baseIRRF * 0.225 - 651.73;
        } else {
            irrf = baseIRRF * 0.275 - 884.96;
        }

        // Garantir que IRRF não seja negativo
        irrf = Math.max(0, irrf);

        const netSalary = grossSalary - inss - irrf;

        // Exibir resultados
        document.getElementById('inssValue').textContent = this.formatCurrency(inss);
        document.getElementById('irrfValue').textContent = this.formatCurrency(irrf);
        document.getElementById('netSalary').textContent = this.formatCurrency(netSalary);

        const resultBox = document.getElementById('salaryResult');
        resultBox.style.display = 'block';
    }

    calculateCompoundInterest() {
        const initialAmount = parseFloat(document.getElementById('initialAmount').value) || 0;
        const monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value) || 0;
        const interestRate = parseFloat(document.getElementById('interestRate').value) || 0;
        const timePeriod = parseInt(document.getElementById('timePeriod').value) || 0;

        if (initialAmount < 0 || monthlyContribution < 0 || interestRate < 0 || timePeriod <= 0) {
            alert('Por favor, insira valores válidos!');
            return;
        }

        const monthlyRate = Math.pow(1 + interestRate / 100, 1 / 12) - 1;
        const months = timePeriod * 12;

        let futureValue = initialAmount * Math.pow(1 + monthlyRate, months);

        if (monthlyContribution > 0) {
            futureValue += monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate * (1 + monthlyRate));
        }

        const totalInvested = initialAmount + monthlyContribution * months;
        const interestEarned = futureValue - totalInvested;

        document.getElementById('totalInvested').textContent = this.formatCurrency(totalInvested);
        document.getElementById('interestEarned').textContent = this.formatCurrency(interestEarned);
        document.getElementById('finalAmount').textContent = this.formatCurrency(futureValue);

        const resultBox = document.getElementById('interestResult');
        resultBox.style.display = 'block';
    }

    calculateLoan() {
        const loanAmount = parseFloat(document.getElementById('loanAmount').value) || 0;
        const loanRate = parseFloat(document.getElementById('loanRate').value) || 0;
        const loanPeriod = parseInt(document.getElementById('loanPeriod').value) || 0;

        if (loanAmount <= 0 || loanRate <= 0 || loanPeriod <= 0) {
            alert('Por favor, insira valores válidos!');
            return;
        }

        const monthlyRate = loanRate / 100;
        const monthlyPayment = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanPeriod) /
            (Math.pow(1 + monthlyRate, loanPeriod) - 1);

        const totalPayment = monthlyPayment * loanPeriod;
        const totalInterest = totalPayment - loanAmount;

        document.getElementById('monthlyPayment').textContent = this.formatCurrency(monthlyPayment);
        document.getElementById('totalPayment').textContent = this.formatCurrency(totalPayment);
        document.getElementById('totalInterest').textContent = this.formatCurrency(totalInterest);

        const resultBox = document.getElementById('loanResult');
        resultBox.style.display = 'block';
    }

    convertCurrency() {
        const amount = parseFloat(document.getElementById('amountToConvert').value) || 0;
        const fromCurrency = document.getElementById('fromCurrency').value;
        const toCurrency = document.getElementById('toCurrency').value;
        const exchangeRate = parseFloat(document.getElementById('exchangeRate').value) || 0;

        if (amount <= 0) {
            alert('Por favor, insira um valor válido!');
            return;
        }

        if (exchangeRate <= 0) {
            alert('Por favor, insira uma taxa de câmbio válida!');
            return;
        }

        if (fromCurrency === toCurrency) {
            alert('Selecione moedas diferentes para conversão!');
            return;
        }

        let convertedAmount;
        if (fromCurrency === 'BRL') {
            // Se estiver convertendo de BRL para outra moeda, divide pelo câmbio
            convertedAmount = amount / exchangeRate;
        } else {
            // Se estiver convertendo de outra moeda para BRL, multiplica pelo câmbio
            convertedAmount = amount * exchangeRate;

            // Se for conversão entre moedas estrangeiras (ex: USD para EUR)
            if (toCurrency !== 'BRL') {
                // Primeiro converte para BRL, depois para a moeda destino usando o câmbio inverso
                const amountInBRL = amount * exchangeRate;
                convertedAmount = amountInBRL / exchangeRate;
                // Neste caso simples, seria igual a amount * (exchangeRate / exchangeRateDestino)
                // Mas como estamos pedindo apenas 1 taxa, mantemos simples
            }
        }

        // Formatando o símbolo da moeda de destino
        let currencySymbol;
        switch (toCurrency) {
            case 'USD': currencySymbol = '$'; break;
            case 'EUR': currencySymbol = '€'; break;
            case 'GBP': currencySymbol = '£'; break;
            default: currencySymbol = 'R$';
        }

        document.getElementById('convertedAmount').textContent =
            `${currencySymbol} ${convertedAmount.toFixed(2)}`;

        const resultBox = document.getElementById('currencyResult');
        resultBox.style.display = 'block';
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(amount);
    }

    formatDate(dateString) {
        return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR');
    }

    formatCategory(category) {
        const categoryNames = {
            'salario': 'Salário',
            'freelance': 'Freelance',
            'investimentos': 'Investimentos',
            'outros-receitas': 'Outros (Receitas)',
            'alimentacao': 'Alimentação',
            'transporte': 'Transporte',
            'moradia': 'Moradia',
            'saude': 'Saúde',
            'educacao': 'Educação',
            'lazer': 'Lazer',
            'outros-despesas': 'Outros (Despesas)'
        };
        return categoryNames[category] || category;
    }

    saveTransactions() {
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
    }

    loadTransactions() {
        const savedTransactions = localStorage.getItem('transactions');
        if (savedTransactions) {
            try {
                this.transactions = JSON.parse(savedTransactions);
            } catch (e) {
                this.transactions = [];
            }
        }
    }
}

// --- Dropdown de usuário ---
const userIcon = document.getElementById("userIcon");
const userDropdown = document.getElementById("userDropdown");
const userName = document.getElementById("userName");

// Mostra/esconde o dropdown ao clicar no ícone
userIcon.addEventListener("click", () => {
    userDropdown.style.display =
        userDropdown.style.display === "block" ? "none" : "block";
});

// Fecha dropdown se clicar fora
document.addEventListener("click", (event) => {
    if (!userIcon.contains(event.target) && !userDropdown.contains(event.target)) {
        userDropdown.style.display = "none";
    }
});

function loadUserName() {
    const userNameElement = document.getElementById("userName");
    const username = localStorage.getItem("username");

    if (userNameElement && username) {
        userNameElement.textContent = username;
        userNameElement.style.color = "#333";
        userNameElement.style.display = "block";
        userNameElement.style.opacity = "1";
        userNameElement.style.visibility = "visible";
    }
}

document.addEventListener("DOMContentLoaded", loadUserName);


// --- Opções do menu ---
document.getElementById("logoutBtn").onclick = () => {
    localStorage.clear();
    window.location.href = "login.html";
};


// Inicializar aplicação
const financeManager = new FinanceManager();