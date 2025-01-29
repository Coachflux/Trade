let currentUser = null;

// Show a specific page
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.style.display = 'none';
  });
  document.getElementById(pageId).style.display = 'block';

  if (pageId === 'home-page' && currentUser) {
    document.getElementById('username-display').textContent = currentUser.username;
  } else if (pageId === 'referral-page' && currentUser) {
    updateReferralPage();
  }
}

// Signup function
function signup() {
  const username = document.getElementById('signup-username').value;
  const password = document.getElementById('signup-password').value;
  const referralCode = document.getElementById('referral-code').value;

  if (!username || !password) {
    alert('Please fill in all fields.');
    return;
  }

  const users = JSON.parse(localStorage.getItem('users')) || [];
  if (users.find(user => user.username === username)) {
    alert('Username already exists.');
    return;
  }

  const newUser = {
    username,
    password,
    referralCode: generateReferralCode(),
    points: 0,
    invitedFriends: []
  };

  if (referralCode) {
    const referrer = users.find(user => user.referralCode === referralCode);
    if (referrer) {
      referrer.points += 1;
      referrer.invitedFriends.push(username);
      localStorage.setItem('users', JSON.stringify(users));
    }
  }

  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  alert('Signup successful! Please login.');
  showPage('login-page');
}

// Login function
function login() {
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(user => user.username === username && user.password === password);

  if (user) {
    currentUser = user;
    showPage('home-page');
  } else {
    alert('Invalid username or password.');
  }
}

// Logout function
function logout() {
  currentUser = null;
  showPage('login-page');
}

// Update referral page
function updateReferralPage() {
  document.getElementById('user-referral-code').textContent = currentUser.referralCode;
  document.getElementById('total-points').textContent = currentUser.points;
  const invitedFriendsList = document.getElementById('invited-friends');
  invitedFriendsList.innerHTML = currentUser.invitedFriends.map(friend => `<li>${friend}</li>`).join('');
}

// Generate a random referral code
function generateReferralCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Initialize
showPage('signup-page');
