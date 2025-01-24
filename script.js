document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm")
  const userInfo = document.getElementById("userInfo")
  const welcomeUsername = document.getElementById("welcomeUsername")
  const referralLinkElement = document.getElementById("referralLink")
  const referralCountElement = document.getElementById("referralCount")
  const memberCountElement = document.getElementById("memberCount")

  signupForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const username = document.getElementById("username").value
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const referralCode = document.getElementById("referralCode").value

    // Generate a unique referral code for the new user
    const newReferralCode = generateReferralCode()

    // Create user object
    const user = {
      username,
      email,
      password,
      referralCode: newReferralCode,
      referralCount: 0,
      members: 0,
    }

    // Save user to local storage
    localStorage.setItem(username, JSON.stringify(user))

    // Update referrer's stats if a valid referral code was used
    if (referralCode) {
      updateReferrerStats(referralCode)
    }

    // Display user info
    showUserInfo(user)
  })

  function generateReferralCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  function updateReferrerStats(referralCode) {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      const user = JSON.parse(localStorage.getItem(key))
      if (user.referralCode === referralCode) {
        user.referralCount++
        user.members++
        localStorage.setItem(key, JSON.stringify(user))
        break
      }
    }
  }

  function showUserInfo(user) {
    signupForm.classList.add("hidden")
    userInfo.classList.remove("hidden")
    welcomeUsername.textContent = user.username
    referralLinkElement.textContent = `${window.location.origin}?ref=${user.referralCode}`
    referralCountElement.textContent = user.referralCount
    memberCountElement.textContent = user.members
  }

  // Check if there's a referral code in the URL
  const urlParams = new URLSearchParams(window.location.search)
  const refCode = urlParams.get("ref")
  if (refCode) {
    document.getElementById("referralCode").value = refCode
  }
})

