const api = {
  // Simulated market data
  marketData: {
    "BTC/USDT": { price: 45000, change: 2.5, volume: 1000000 },
    "ETH/USDT": { price: 3200, change: 1.8, volume: 500000 },
    "BNB/USDT": { price: 380, change: -0.5, volume: 300000 },
    "SOL/USDT": { price: 120, change: 5.2, volume: 200000 },
    "ADA/USDT": { price: 1.2, change: -1.3, volume: 150000 },
  },

  async getMarketData() {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return this.marketData
  },

  async getPrice(pair) {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return this.marketData[pair]?.price || 0
  },

  async placeOrder(order) {
    await new Promise((resolve) => setTimeout(resolve, 800))

    const success = Math.random() > 0.1
    if (success) {
      return {
        success: true,
        orderId: utils.generateId(),
        message: "Order placed successfully",
      }
    } else {
      throw new Error("Order failed due to insufficient liquidity")
    }
  },

  async cancelOrder(orderId) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return {
      success: true,
      message: "Order cancelled successfully",
    }
  },

  async getOrderBook(pair) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const basePrice = this.marketData[pair]?.price || 45000
    const buyOrders = Array.from({ length: 10 }, (_, i) => ({
      price: basePrice - (i + 1) * 10,
      amount: Math.random() * 2,
    }))
    const sellOrders = Array.from({ length: 10 }, (_, i) => ({
      price: basePrice + (i + 1) * 10,
      amount: Math.random() * 2,
    }))
    return { buyOrders, sellOrders }
  },

  async getRecentTrades(pair) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const basePrice = this.marketData[pair]?.price || 45000
    return Array.from({ length: 20 }, () => ({
      price: basePrice + (Math.random() - 0.5) * 100,
      amount: Math.random() * 2,
      time: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    }))
  },

  startPriceUpdates(callback) {
    return setInterval(() => {
      Object.keys(this.marketData).forEach((pair) => {
        const change = (Math.random() - 0.5) * 100
        this.marketData[pair].price += change
        this.marketData[pair].change = (change / this.marketData[pair].price) * 100
        this.marketData[pair].volume += Math.random() * 10000
      })
      callback(this.marketData)
    }, 5000)
  },

  async getNewsData() {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return [
      { title: "Bitcoin Surges Past $50,000", source: "CryptoNews" },
      { title: "Ethereum 2.0 Upgrade on Track", source: "BlockchainToday" },
      { title: "New DeFi Protocol Gains Traction", source: "DeFiInsider" },
      { title: "Regulatory Concerns Impact Crypto Market", source: "CoinDesk" },
    ]
  },

  async getStakingOptions() {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return [
      { asset: "BTC", apy: 5.5, lockPeriod: 30 },
      { asset: "ETH", apy: 7.2, lockPeriod: 60 },
      { asset: "BNB", apy: 12.5, lockPeriod: 90 },
      { asset: "ADA", apy: 8.1, lockPeriod: 30 },
    ]
  },

  async getSavingsOptions() {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return [
      { asset: "USDT", apy: 8.5, type: "Flexible" },
      { asset: "USDC", apy: 9.0, type: "Flexible" },
      { asset: "BTC", apy: 6.5, type: "Fixed" },
      { asset: "ETH", apy: 7.0, type: "Fixed" },
    ]
  },

  async getLaunchpadProjects() {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return [
      { name: "NewCoin", symbol: "NCN", startDate: "2023-07-01", endDate: "2023-07-15" },
      { name: "DecentralizedApp", symbol: "DAPP", startDate: "2023-07-10", endDate: "2023-07-25" },
    ]
  },

  async getLiquidityPools() {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return [
      { pair: "BTC/USDT", apy: 15.5, totalLiquidity: 10000000 },
      { pair: "ETH/USDT", apy: 18.2, totalLiquidity: 5000000 },
      { pair: "BNB/USDT", apy: 22.5, totalLiquidity: 3000000 },
    ]
  },
}

