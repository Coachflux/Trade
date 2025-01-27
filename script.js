
// Helper function to generate a random referral code
function generateReferralCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Helper function to get users from local storage
function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

// Helper function to save users to local storage
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Helper function to get current user from local storage
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

// Helper function to save current user to local storage
function saveCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

// Sign up functionality
if (document.getElementById('signup-form')) {
    document.getElementById('signup-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const referralCode = document.getElementById('referral-code').value;

        const users = getUsers();
        if (users.find(user => user.username === username)) {
            alert('Username already exists');
            return;
        }

        const newUser = {
            username,
            password,
            referralCode: generateReferralCode(),
            points: 0,
            referredUsers: []
        };

        users.push(newUser);
        saveUsers(users);

        if (referralCode) {
            const referrer = users.find(user => user.referralCode === referralCode);
            if (referrer) {
                referrer.points += 1;
                referrer.referredUsers.push(username);
                saveUsers(users);
            }
        }

        alert('Sign up successful! Please login.');
        window.location.href = 'login.html';
    });
}

// Login functionality
if (document.getElementById('login-form')) {
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const users = getUsers();
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            saveCurrentUser(user);
            window.location.href = 'dashboard.html';
        } else {
            alert('Invalid username or password');
        }
    });
}

// Dashboard functionality
if (document.getElementById('user-name')) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = 'login.html';
    } else {
        document.getElementById('user-name').textContent = currentUser.username;
        document.getElementById('referral-code').textContent = currentUser.referralCode;
        document.getElementById('points').textContent = currentUser.points;

        const referredList = document.getElementById('referred-list');
        currentUser.referredUsers.forEach(user => {
            const li = document.createElement('li');
            li.textContent = user;
            referredList.appendChild(li);
        });

        document.getElementById('logout-btn').addEventListener('click', function() {
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }
}

