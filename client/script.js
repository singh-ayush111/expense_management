const API_URL = 'http://localhost:5000/api';
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const messageDiv = document.getElementById('message');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        await authUser('/auth/login', { email, password });
    });
}

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        await authUser('/auth/register', { email, password });
    });
}

async function authUser(endpoint, data) {
    try {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        
        if (res.ok) {
            localStorage.setItem('token', result.token);
            window.location.href = 'dashboard.html';
        } else {
            messageDiv.innerText = result.msg || 'Error occurred';
        }
    } catch (err) {
        console.error(err);
    }
}

const expenseForm = document.getElementById('expense-form');
const logoutBtn = document.getElementById('logout-btn');

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    });
}

if (expenseForm) {
    expenseForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const desc = document.getElementById('desc').value;
        const amount = document.getElementById('amount').value;
        const category = document.getElementById('category').value;

        await fetch(`${API_URL}/expenses`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify({ description: desc, amount, category })
        });
        
        document.getElementById('desc').value = '';
        document.getElementById('amount').value = '';
        loadExpenses();
    });
}

async function loadExpenses() {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/expenses`, {
        headers: { 'x-auth-token': token }
    });
    const expenses = await res.json();

    const list = document.getElementById('expense-list');
    const totalAmount = document.getElementById('total-amount');
    const totalCount = document.getElementById('total-count');
    
    list.innerHTML = '';
    let total = 0;

    expenses.forEach(exp => {
        total += exp.amount;
        const item = document.createElement('li');
        item.innerHTML = `
            ${exp.description} <small>(${exp.category})</small> 
            <span>Rs. ${exp.amount} 
            <button class="delete-btn" onclick="deleteExpense('${exp._id}')">X</button></span>
        `;
        list.appendChild(item);
    });

    totalAmount.innerText = `Rs. ${total.toFixed(2)}`;
    totalCount.innerText = expenses.length;
}

async function deleteExpense(id) {
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/expenses/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
    });
    loadExpenses();
}