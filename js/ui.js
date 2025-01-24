const ui = {
  init() {
    this.attachEventListeners()
    this.updateTheme()
    this.renderMarketList()
  },

  attachEventListeners() {
    // Theme toggle
    document.getElementById("themeToggle").addEventListener("click", () => {
      const data = storage.getData()
      const newTheme = data.settings.theme === "light" ? "dark" : "light"
      storage.updateSettings({ theme: newTheme })
      this.updateTheme()
    })

    // Account type toggle
    document.getElementById("realAccount").addEventListener("click", () => {
      this.switchAccount("real")
    })

    document.getElementById("demoAccount").addEventListener("click", () => {
      this.switchAccount("demo")
    })

    // Trading form tabs
    document.querySelectorAll(".tab-button").forEach((button) => {
      button.addEventListener("click", () => {
        this.switchTab(button.dataset.tab)
      })
    })
  },

  updateTheme() {
    const data = storage.getData()
    document.body.className = data.settings.theme + "-theme"
  },

  async renderMarketList() {
    const marketList = document.getElementById("marketList")
    const marketData = await api.getMarketData()

    marketList.innerHTML = Object.entries(marketData)
      .map(
        ([pair, data]) => `
                <div class="market-item" data-pair="${pair}">
                    <span>${pair}</span>
                    <span class="${data.change >= 0 ? "success" : "danger"}">
                        ${utils.formatNumber(data.price, 2)}
                        (${data.change >= 0 ? "+" : ""}${utils.formatNumber(data.change, 2)}%)
                    </span>
                </div>
            `,
      )
      .join("")

    marketList.addEventListener("click", (e) => {
      const marketItem = e.target.closest(".market-item")
      if (marketItem) {
        const pair = marketItem.dataset.pair
        this.switchTradingPair(pair)
      }
    })
  },

  switchAccount(type) {
    const data = storage.getData()
    storage.updateSettings({ selectedAccount: type })

    document.getElementById("realAccount").classList.toggle("active", type === "real")
    document.getElementById("demoAccount").classList.toggle("active", type === "demo")

    this.updateBalance()
    this.renderOrders()
  },

  switchTab(tab) {
    document.querySelectorAll(".tab-button").forEach((button) => {
      button.classList.toggle("active", button.dataset.tab === tab)
    })

    document.querySelectorAll(".tab-content").forEach((content) => {
      content.classList.toggle("hidden", content.id !== `${tab}Tab`)
    })
  },

  switchTradingPair(pair) {
    storage.updateSettings({ selectedPair: pair })
    document.getElementById("selectedPair").textContent = pair
    this.updateOrderForms()
  },

  updateBalance() {
    const data = storage.getData()
    const accountType = data.settings.selectedAccount
    const balance = data.accounts[accountType].balance

    document.getElementById("totalBalance").textContent = utils.formatCurrency(balance)
  },

  updateOrderForms() {
    const data = storage.getData()
    const pair = data.settings.selectedPair

    document.querySelectorAll(".trade-form button").forEach((button) => {
      button.textContent = `${button.textContent.split(" ")[0]} ${pair.split("/")[0]}`
    })
  },

  renderOrders() {
    const data = storage.getData()
    const accountType = data.settings.selectedAccount
    const orders = data.accounts[accountType].orders

    const ordersList = document.getElementById("openOrdersList")
    ordersList.innerHTML = orders
      .map(
        (order) => `
            <div class="order-row">
                <span>${order.pair}</span>
                <span>${order.type}</span>
                <span>${utils.formatNumber(order.price, 2)}</span>
                <span>${utils.formatNumber(order.amount, 4)}</span>
                <span>${utils.formatNumber(order.total, 2)}</span>
                <button class="neumorphic-button danger" 
                        onclick="trading.cancelOrder('${order.id}')">
                    Cancel
                </button>
            </div>
        `,
      )
      .join("")
  },
}

