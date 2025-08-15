class AccountingApp {
    constructor() {
        this.apiUrl = window.CONFIG.apiUrl;
        this.init();
    }

    init() {
        this.loadTransactions();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const form = document.getElementById('transactionForm');
        form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const description = document.getElementById('description').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const type = document.getElementById('type').value;

        try {
            const response = await fetch(`${this.apiUrl}/api/transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ description, amount, type })
            });

            if (response.ok) {
                document.getElementById('transactionForm').reset();
                this.loadTransactions();
            } else {
                throw new Error('Failed to create transaction');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('新增交易失敗');
        }
    }

    async loadTransactions() {
        try {
            document.getElementById('transactions').innerHTML = '<div class="loading">載入中...</div>';
            
            const response = await fetch(`${this.apiUrl}/api/transactions`);
            const transactions = await response.json();

            this.renderTransactions(transactions);
            this.renderSummary(transactions);
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('transactions').innerHTML = '<div class="error">載入失敗</div>';
        }
    }

    renderTransactions(transactions) {
        const container = document.getElementById('transactions');
        
        if (transactions.length === 0) {
            container.innerHTML = '<div>尚無交易記錄</div>';
            return;
        }

        const html = transactions.map(t => `
            <div class="transaction">
                <div>
                    <strong>${t.description}</strong>
                    <div style="font-size: 12px; color: #7f8c8d;">
                        ${new Date(t.created_at).toLocaleString('zh-TW')}
                    </div>
                </div>
                <div class="${t.type}">
                    ${t.type === 'income' ? '+' : '-'}$${t.amount.toFixed(2)}
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
    }

    renderSummary(transactions) {
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const expenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const balance = income - expenses;

        const summaryHtml = `
            <div class="summary-item">
                <span>總收入:</span>
                <span class="income">$${income.toFixed(2)}</span>
            </div>
            <div class="summary-item">
                <span>總支出:</span>
                <span class="expense">$${expenses.toFixed(2)}</span>
            </div>
            <div class="summary-item">
                <span>餘額:</span>
                <span class="${balance >= 0 ? 'income' : 'expense'}">$${balance.toFixed(2)}</span>
            </div>
        `;

        document.getElementById('summary').innerHTML = summaryHtml;
    }
}

new AccountingApp();