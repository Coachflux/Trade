const storage = {
  init() {
    if (!localStorage.getItem("cryptoNexData")) {
      const initialData = {
        accounts: {
          real: {
            balance: 0,
            assets: {},
            orders: [],
            transactions: [],
          },
          demo: {
            balance: 10000,
            assets: {
              BTC: 0.1,
              ETH: 1,
              USDT: 1000,
            },
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
      localStorage.setItem("cryptoNexData", JSON.stringify(initialData))
    }
    return this.getData()
  },

  getData() {
    return JSON.parse(localStorage.getItem("cryptoNexData"))
  },

  saveData(data) {
    localStorage.setItem("cryptoNexData", JSON.stringify(data))
  },

  updateBalance(amount, accountType) {
    const data = this.getData()
    data.accounts[accountType].balance = amount
    this.saveData(data)
  },

  updateAsset(asset, amount, accountType) {
    const data = this.getData()
    data.accounts[accountType].assets[asset] = amount
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

