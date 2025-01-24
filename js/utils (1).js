const utils = {
  formatNumber: (number, decimals = 2) => {
    return Number(number).toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  },

  formatCurrency: (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount)
  },

  formatDate: (date) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
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

  debounce: (func, delay) => {
    let timeoutId
    return (...args) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func(...args), delay)
    }
  },
}

