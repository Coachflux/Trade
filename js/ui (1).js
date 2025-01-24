const ui = {
  init() {
    this.attachEventListeners()
    this.renderDashboard()
    this.renderMarkets()
    this.renderTrade()
    this.renderFutures()
    this.renderEarn()
    this.renderWallet()
    this.updateAccountInfo()
  },

  attachEventListeners() {
    // Navigation
    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        this.showPage(e.target.dataset.page)
      })
    })

    // Account type toggle
    document.getElementById("account-type-toggle").addEventListener("click", () => {
      const data = storage.getData()
      const newType = data.settings.selectedAccount === "demo" ? "real" : "demo"
      storage.updateSettings({ selectedAccount: newType })
      this.updateAccountInfo()
      this.renderWallet()
    })

    // Logout
    document.getElementById("logout-btn").addEventListener("click", (e) => {
      e.preventDefault()
      // Implement logout functionality
      utils.showNotification("Logged out successfully", "success")
    })

    // Trading form tabs
    document.querySelectorAll(".tab-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const tabGroup = button.closest(".tabs")
        this.switchTab(tabGroup.querySelectorAll(".tab-btn"), button.dataset.tab)
      })
    })

    // Order form
    document.getElementById("order-form").addEventListener("submit", (e) => {
      e.preventDefault()
      trading.placeOrder()
    })

    // Market search
    document.getElementById("market-search-input").addEventListener(
      "input",
      utils.debounce(() => this.filterMarkets(), 300),
    )
  },

  showPage(pageId) {
    document.querySelectorAll(".page").forEach((page) => {
      page.classList.remove("active")
    })
    document.getElementById(pageId).classList.add("active")
  },

  switchTab(tabs, tabId) {
    tabs.forEach((tab) => {
      tab.classList.remove("active")
      const content = document.getElementById(tab.dataset.tab + "-content")
      if (content) content.classList.remove("active")
    })
    const activeTab = Array.from(tabs).find((tab) => tab.dataset.tab === tabId)
    activeTab.classList.add("active")
    const activeContent = document.getElementById(tabId + "-content")
    if (activeContent) activeContent.classList.add("active")
  },

  updateAccountInfo() {
    const data = storage.getData()
    const accountType = data.settings.selectedAccount
    const balance = data.accounts[accountType].balance

    document.getElementById("user-balance").textContent = utils.formatCurrency(balance)
    document.getElementById("account-type-toggle").textContent =
      accountType.charAt(0).toUpperCase() + accountType.slice(1)
  },

  async renderDashboard() {
    this.renderPortfolioSummary()
    this.renderMarketOverview()
    this.renderRecentTrades()
    this.renderNewsFeed()
  },

  async renderPortfolioSummary() {
    const data = storage.getData()
    const accountType = data.settings.selectedAccount
    const assets = data.accounts[accountType].assets
    const portfolioTotal = document.getElementById("portfolio-total")
    const portfolioChart = document.getElementById("portfolio-chart")

    let totalValue = 0
    const assetData = Object.entries(assets).map(([asset, amount]) => {
      const value = amount * (api.marketData[`${asset}/USDT`]?.price || 0)
      totalValue += value
      return { asset, amount, value }
    })

    portfolioTotal.textContent = utils.formatCurrency(totalValue)

    // Implement chart rendering here (e.g., using Chart.js)
    // This is a placeholder for the chart implementation
    portfolioChart.innerHTML = `
            <canvas id="portfolio-chart-canvas"></canvas>
        `
    // Implement actual chart rendering using a library like Chart.js
  },

  async renderMarketOverview() {
    const marketList = document.getElementById("market-list")
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
                    <span>${utils.formatNumber(data.volume, 0)}</span>
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

  async renderRecentTrades() {
    const data = storage.getData()
    const pair = data.settings.selectedPair
    const trades = await api.getRecentTrades(pair)
    const tradesList = document.getElementById("trades-list")

    tradesList.innerHTML = trades
      .map(
        (trade) => `
            <div class="trade-item">
                <span>${utils.formatNumber(trade.price, 2)}</span>
                <span>${utils.formatNumber(trade.amount, 4)}</span>
                <span>${utils.formatDate(trade.time)}</span>
            </div>
        `,
      )
      .join("")
  },

  async renderNewsFeed() {
    const newsData = await api.getNewsData()
    const newsList = document.getElementById("news-list")

    newsList.innerHTML = newsData
      .map(
        (news) => `
            <div class="news-item">
                <h3>${news.title}</h3>
                <p>Source: ${news.source}</p>
            </div>
        `,
      )
      .join("")
  },

  async renderMarkets() {
    const marketData = await api.getMarketData()
    const marketsBody = document.getElementById("markets-body")

    marketsBody.innerHTML = Object.entries(marketData)
      .map(
        ([pair, data]) => `
                <tr>
                    <td>${pair}</td>
                    <td>${utils.formatNumber(data.price, 2)}</td>
                    <td class="${data.change >= 0 ? "success" : "danger"}">
                        ${data.change >= 0 ? "+" : ""}${utils.formatNumber(data.change, 2)}%
                    </td>
                    <td>${utils.formatNumber(data.volume, 0)}</td>
                </tr>
            `,
      )
      .join("")
  },

  filterMarkets() {
    const searchInput = document.getElementById("market-search-input")
    const filter = searchInput.value.toUpperCase()
    const rows = document.getElementById("markets-body").getElementsByTagName("tr")

    for (let i = 0; i < rows.length; i++) {
      const pair = rows[i].getElementsByTagName("td")[0]
      if (pair) {
        const textValue = pair.textContent || pair.innerText
        if (textValue.toUpperCase().indexOf(filter) > -1) {
          rows[i].style.display = ""
        } else {
          rows[i].style.display = "none"
        }
      }
    }
  },

  async renderTrade() {
    this.renderTradingChart()
    this.renderOrderBook()
    this.renderOpenOrders()
  },

  renderTradingChart() {
    const chartContainer = document.getElementById("chart-container")
    // Implement chart rendering here (e.g., using TradingView widget or Chart.js)
    chartContainer.innerHTML = "<div>Trading Chart Placeholder</div>"
  },

  async renderOrderBook() {
    const data = storage.getData()
    const pair = data.settings.selectedPair
    const orderBook = await api.getOrderBook(pair)
    const orderBookContent = document.getElementById("order-book-content")

    orderBookContent.innerHTML = `
            <div class="sell-orders">
                ${orderBook.sellOrders
                  .map(
                    (order) => `
                    <div class="order-row">
                        <span>${utils.formatNumber(order.price, 2)}</span>
                        <span>${utils.formatNumber(order.amount, 4)}</span>
                        <span>${utils.formatNumber(order.price * order.amount, 2)}</span>
                    </div>
                `,
                  )
                  .join("")}
            </div>
            <div class="buy-orders">
                ${orderBook.buyOrders
                  .map(
                    (order) => `
                    <div class="order-row">
                        <span>${utils.formatNumber(order.price, 2)}</span>
                        <span>${utils.formatNumber(order.amount, 4)}</span>
                        <span>${utils.formatNumber(order.price * order.amount, 2)}</span>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        `
  },

  renderOpenOrders() {
    const data = storage.getData()
    const accountType = data.settings.selectedAccount
    const orders = data.accounts[accountType].orders
    const openOrdersList = document.getElementById("open-orders-list")

    openOrdersList.innerHTML = orders
      .map(
        (order) => `
            <div class="order-item">
                <span>${order.pair}</span>
                <span>${order.type}</span>
                <span>${utils.formatNumber(order.price, 2)}</span>
                <span>${utils.formatNumber(order.amount, 4)}</span>
                <span>${utils.formatNumber(order.total, 2)}</span>
                <button class="btn-secondary" onclick="trading.cancelOrder('${order.id}')">Cancel</button>
            </div>
        `,
      )
      .join("")
  },

  async renderFutures() {
    this.renderFuturesChart()
    this.renderPositions()
    this.setupFuturesOrderForm()
  },

  renderFuturesChart() {
    const chartContainer = document.getElementById("futures-chart-container")
    // Implement futures chart rendering here (e.g., using TradingView widget or Chart.js)
    chartContainer.innerHTML = "<div>Futures Trading Chart Placeholder</div>"
  },

  renderPositions() {
    const positionsList = document.getElementById("positions-list")
    // Implement rendering of open futures positions
    positionsList.innerHTML = "<div>No open positions</div>"
  },

  setupFuturesOrderForm() {
    const leverageInput = document.getElementById("futures-leverage")
    const leverageValue = document.getElementById("leverage-value")
    leverageInput.addEventListener("input", () => {
      leverageValue.textContent = `${leverageInput.value}x`
    })
  },

  async renderEarn() {
    this.renderStakingOptions()
    this.renderSavingsOptions()
    this.renderLaunchpadProjects()
    this.renderLiquidityPools()
  },

  async renderStakingOptions() {
    const stakingOptions = await api.getStakingOptions()
    const stakingContainer = document.getElementById("staking-options")
    stakingContainer.innerHTML = stakingOptions
      .map(
        (option) => `
            <div class="staking-option">
                <h3>${option.asset}</h3>
                <p>APY: ${option.apy}%</p>
                <p>Lock Period: ${option.lockPeriod} days</p>
                <button class="btn-primary">Stake</button>
            </div>
        `,
      )
      .join("")
  },

  async renderSavingsOptions() {
    const savingsOptions = await api.getSavingsOptions()
    const savingsContainer = document.getElementById("savings-options")
    savingsContainer.innerHTML = savingsOptions
      .map(
        (option) => `
            <div class="savings-option">
                <h3>${option.asset}</h3>
                <p>APY: ${option.apy}%</p>
                <p>Type: ${option.type}</p>
                <button class="btn-primary">Subscribe</button>
            </div>
        `,
      )
      .join("")
  },

  async renderLaunchpadProjects() {
    const launchpadProjects = await api.getLaunchpadProjects()
    const launchpadContainer = document.getElementById("launchpad-projects")
    launchpadContainer.innerHTML = launchpadProjects
      .map(
        (project) => `
            <div class="launchpad-project">
                <h3>${project.name} (${project.symbol})</h3>
                <p>Start Date: ${utils.formatDate(project.startDate)}</p>
                <p>End Date: ${utils.formatDate(project.endDate)}</p>
                <button class="btn-primary">View Details</button>
            </div>
        `,
      )
      .join("")
  },

  async renderLiquidityPools() {
    const liquidityPools = await api.getLiquidityPools()
    const poolsContainer = document.getElementById("liquidity-pools-list")
    poolsContainer.innerHTML = liquidityPools
      .map(
        (pool) => `
            <div class="liquidity-pool">
                <h3>${pool.pair}</h3>
                <p>APY: ${pool.apy}%</p>
                <p>Total Liquidity: ${utils.formatCurrency(pool.totalLiquidity)}</p>
                <button class="btn-primary">Add Liquidity</button>
            </div>
        `,
      )
      .join("")
  },

  async renderWallet() {
    this.renderAssetList()
    this.setupDepositWithdrawForms()
    this.renderTransactionHistory()
  },

  renderAssetList() {
    const data = storage.getData()
    const accountType = data.settings.selectedAccount
    const assets = data.accounts[accountType].assets
    const assetList = document.getElementById("asset-list")

    assetList.innerHTML = Object.entries(assets)
      .map(
        ([asset, amount]) => `
            <div class="asset-item">
                <span>${asset}</span>
                <span>${utils.formatNumber(amount, 8)}</span>
                <span>${utils.formatCurrency(amount * (api.marketData[`${asset}/USDT`]?.price || 0))}</span>
            </div>
        `,
      )
      .join("")
  },

  setupDepositWithdrawForms() {
    const depositForm = document.getElementById("deposit-crypto-form")
    const withdrawForm = document.getElementById("withdraw-crypto-form")

    depositForm.addEventListener("submit", (e) => {
      e.preventDefault()
      // Implement deposit logic
      utils.showNotification("Deposit address copied to clipboard", "success")
    })

    withdrawForm.addEventListener("submit", (e) => {
      e.preventDefault()
      // Implement withdraw logic
      utils.showNotification("Withdrawal request submitted", "success")
    })
  },

  renderTransactionHistory() {
    const data = storage.getData()
    const accountType = data.settings.selectedAccount
    const transactions = data.accounts[accountType].transactions
    const transactionList = document.getElementById("transaction-list")

    transactionList.innerHTML = transactions
      .map(
        (tx) => `
            <div class="transaction-item">
                <span>${utils.formatDate(tx.timestamp)}</span>
                <span>${tx.type}</span>
                <span>${tx.asset}</span>
                <span>${utils.formatNumber(tx.amount, 8)}</span>
                <span>${tx.status}</span>
            </div>
        `,
      )
      .join("")
  },

  switchTradingPair(pair) {
    storage.updateSettings({ selectedPair: pair })
    document.querySelector("#trading-chart h2").textContent = pair
    this.renderOrderBook()
    this.renderTradingChart()
    // Update other relevant UI elements
  },
}

