// script.js

// Elements
const loginPage = document.getElementById("loginPage");
const signupPage = document.getElementById("signupPage");
const dashboardPage = document.getElementById("dashboardPage");
const userNameSpan = document.getElementById("userName");
const referralCodeSpan = document.getElementById("referralCode");
const referralCountSpan = document.getElementById("referralCount");
const invitedList = document.getElementById("invitedList");

// User Data in Local Storage
const usersKey = "users";
let users = JSON.parse(localStorage.getItem(usersKey)) || [];

// Functions
const saveUsers = () => localStorage.setItem(usersKey, JSON.stringify(users));

// Switch Pages
const showPage = (page) => {
  [loginPage, signupPage, dashboardPage].forEach(p => p.classList.add("hidden"));
  page.classList.remove("hidden");
};

// Generate Referral Code
const generateReferralCode = (name) => `${name.toLowerCase().replace(/\s/g, "")}-${Date.now()}`;

// Login
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    loadDashboard(user);
    showPage(dashboardPage);
  } else {
    alert("Invalid login credentials!");
  }
});

// Signup
document.getElementById("signupForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const referralCode = document.getElementById("signupReferral").value.trim();

  if (users.some(u => u.email === email)) {
    alert("Email already registered!");
    return;
  }

  const newUser = {
    name,
    email,
    password,
    referralCode: generateReferralCode(name),
    referralCount: 0,
    invitedUsers: []
  };

  // Handle Referrals
  if (referralCode) {
    const referrer = users.find(u => u.referralCode === referralCode);
    if (referrer) {
      referrer.referralCount++;
      referrer.invitedUsers.push(name);
    } else {
      alert("Invalid referral code!");
      return;
    }
  }

  users.push(newUser);
  saveUsers();

  alert("Signup successful! Please login.");
  showPage(loginPage);
});

// Load Dashboard
const loadDashboard = (user) => {
  userNameSpan.textContent = user.name;
  referralCodeSpan.textContent = user.referralCode;
  referralCountSpan.textContent = user.referralCount;
  invitedList.innerHTML = user.invitedUsers.map(u => `<li>${u}</li>`).join("");
};

// Logout
document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  showPage(loginPage);
});

// Page Navigation
document.getElementById("goToSignup").addEventListener("click", () => showPage(signupPage));
document.getElementById("goToLogin").addEventListener("click", () => showPage(loginPage));

// Load Current User
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (currentUser) {
  loadDashboard(currentUser);
  showPage(dashboardPage);
} else {
  showPage(loginPage);
}
