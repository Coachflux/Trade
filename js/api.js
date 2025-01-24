const api = {
  // Simulated market data
  marketData: {
    "BTC/USDT": { price: 45000, change: 2.5 },
    "ETH/USDT": { price: 3200, change: 1.8 },
    "BNB/USDT": { price: 380, change: -0.5 },
    "SOL/USDT": { price: 120, change: 5.2 },
    "ADA/USDT": { price: 1.2, change: -1.3 },
  },

  async getMarketData() {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    return this.marketData
  },

  async getPrice(pair) {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return this.marketData[pair]?.price || 0
  },

  async placeOrder(order) {
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Simulate order matching
    const success = Math.random() > 0.1 // 90% success rate
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

  // Simulate real-time price updates
  startPriceUpdates(callback) {
    return setInterval(() => {
      Object.keys(this.marketData).forEach((pair) => {
        const change = (Math.random() - 0.5) * 100
        this.marketData[pair].price += change
        this.marketData[pair].change = (change / this.marketData[pair].price) * 100
      })
      callback(this.marketData)
    }, 3000)
  },
}

