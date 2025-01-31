// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlzbgw-yiXXxfDc99DzHWF8_JR0nlXGx8",
  authDomain: "megadrop-d7f9f.firebaseapp.com",
  projectId: "megadrop-d7f9f",
  storageBucket: "megadrop-d7f9f.firebasestorage.app",
  messagingSenderId: "726965576147",
  appId: "1:726965576147:web:c601f7db7e2a1e18f44f26"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

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
async function signup() {
  const username = document.getElementById('signup-username').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const referralCode = document.getElementById('referral-code').value;

  if (!username || !email || !password) {
    alert('Please fill in all fields.');
    return;
  }

  try {
    // Create user in Firebase Authentication
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Generate a referral code
    const newReferralCode = generateReferralCode();

    // Save user data to Firestore
    await db.collection('users').doc(user.uid).set({
      username,
      email,
      referralCode: newReferralCode,
      points: 0,
      invitedFriends: []
    });

    // If a referral code is provided, update the referrer's data
    if (referralCode) {
      const referrer = await db.collection('users').where('referralCode', '==', referralCode).get();
      if (!referrer.empty) {
        const referrerData = referrer.docs[0].data();
        await db.collection('users').doc(referrer.docs[0].id).update({
          points: referrerData.points + 1,
          invitedFriends: [...referrerData.invitedFriends, username]
        });
      }
    }

    alert('Signup successful! Please login.');
    showPage('login-page');
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

// Login function
async function login() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Fetch user data from Firestore
    const userDoc = await db.collection('users').doc(user.uid).get();
    currentUser = userDoc.data();
    showPage('home-page');
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

// Logout function
function logout() {
  auth.signOut().then(() => {
    currentUser = null;
    showPage('login-page');
  });
}

// Update referral page
function updateReferralPage() {
  if (!currentUser) return;

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

// Auth state observer
auth.onAuthStateChanged(user => {
  if (user) {
    db.collection('users').doc(user.uid).get().then(doc => {
      currentUser = doc.data();
      showPage('home-page');
    });
  } else {
    currentUser = null;
    showPage('signup-page');
  }
});
