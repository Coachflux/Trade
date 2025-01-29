document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    const usernameDisplay = document.getElementById('username-display');
    const referralCodeDisplay = document.getElementById('referral-code');

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('signup-username').value;
            const password = document.getElementById('signup-password').value;
            const referralCode = generateReferralCode();

            localStorage.setItem('username', username);
            localStorage.setItem('password', password);
            localStorage.setItem('referralCode', referralCode);

            showPage('login-page');
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;

            const storedUsername = localStorage.getItem('username');
            const storedPassword = localStorage.getItem('password');

            if (username === storedUsername && password === storedPassword) {
                usernameDisplay.textContent = username;
                referralCodeDisplay.textContent = localStorage.getItem('referralCode');
                showPage('home-page');
            } else {
                alert('Invalid username or password');
            }
        });
    }

    function showPage(pageId) {
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => {
            page.style.display = 'none';
        });
        document.getElementById(pageId).style.display = 'flex';
    }

    function generateReferralCode() {
        return Math.random().toString(36).substring(2, 10).toUpperCase();
    }

    function copyReferralCode() {
        const referralCode = localStorage.getItem('referralCode');
        navigator.clipboard.writeText(referralCode).then(() => {
            alert('Referral code copied to clipboard!');
        });
    }

    function logout() {
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        showPage('login-page');
    }

    // Check if user is already logged in
    if (localStorage.getItem('username')) {
        usernameDisplay.textContent = localStorage.getItem('username');
        referralCodeDisplay.textContent = localStorage.getItem('referralCode');
        showPage('home-page');
    } else {
        showPage('signup-page');
    }
});
