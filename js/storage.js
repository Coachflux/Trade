const storage = {
  init() {
    if (!localStorage.getItem("tradingApp")) {
      const initialData = {
        accounts: {
          real: {
            balance: 0,
            orders: [],
            transactions: [],
          },
          demo: {
            balance: 10000, // Demo account starts with $10,000
            orders: [],
            transactions: [],
          },
        },
        settings: {
          theme: "light",
          selectedAccount: "demo",
          selectedPair: "BTC/USDT",
        },
      }
      localStorage.setItem("tradingApp", JSON.stringify(initialData))
    }
    return this.getData()
  },

  getData() {
    return JSON.parse(localStorage.getItem("tradingApp"))
  },

  saveData(data) {
    localStorage.setItem("tradingApp", JSON.stringify(data))
  },

  updateBalance(amount, accountType) {
    const data = this.getData()
    data.accounts[accountType].balance = amount
    this.saveData(data)
  },

  addOrder(order, accountType) {
    const data = this.getData()
    data.accounts[accountType].orders.push(order)
    this.saveData(data)
  },

  removeOrder(orderId, accountType) {
    const data = this.getData()
    data.accounts[accountType].orders = data.accounts[accountType].orders.filter((order) => order.id !== orderId)
    this.saveData(data)
  },

  addTransaction(transaction, accountType) {
    const data = this.getData()
    data.accounts[accountType].transactions.push(transaction)
    this.saveData(data)
  },

  updateSettings(settings) {
    const data = this.getData()
    data.settings = { ...data.settings, ...settings }
    this.saveData(data)
  },
}

