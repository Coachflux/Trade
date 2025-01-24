const utils = {
  formatNumber: (number, decimals = 2) => {
    return Number(number).toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  },

  formatCurrency: (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  },

  generateId: () => {
    return Math.random().toString(36).substr(2, 9)
  },

  showNotification: (message, type = "info") => {
    const notifications = document.getElementById("notifications")
    const notification = document.createElement("div")
    notification.className = `notification ${type}`
    notification.textContent = message

    notifications.appendChild(notification)

    setTimeout(() => {
      notification.style.opacity = "0"
      setTimeout(() => notification.remove(), 300)
    }, 3000)
  },
}

