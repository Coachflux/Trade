const trading = {
  init() {
    this.attachFormListeners()
    this.startPriceUpdates()
  },

  attachFormListeners() {
    // Buy form
    document.getElementById("buyForm").addEventListener("submit", (e) => {
      e.preventDefault()
      this.placeOrder("buy")
    })

    // Sell form
    document
      .getElementById("sellForm")
      .addEventListener("submit", (e) => {
        e.preventDefault()
        this.placeOrder("sell")
      })

    // Calculate totals on input
    ;["buy", "sell"].forEach((type) => {
      const amount = document.getElementById(`${type}Amount`)
      const price = document.getElementById(`${type}Price`)
      const total = document.getElementById(`${type}Total`)
      ;[amount, price].forEach((input) => {
        input.addEventListener("input", () => {
          const totalValue = amount.value * price.value
          total.value = totalValue ? utils.formatNumber(totalValue, 2) : ""
        })
      })
    })
  },

  async placeOrder(type) {
    const data = storage.getData()
    const accountType = data.settings.selectedAccount
    const pair = data.settings.selectedPair

    const amount = Number.parseFloat(document.getElementById(`${type}Amount`).value)
    const price = Number.parseFloat(document.getElementById(`${type}Price`).value)
    const total = amount * price

    // Validate balance
    if (type === "buy" && total > data.accounts[accountType].balance) {
      utils.showNotification("Insufficient balance", "error")
      return
    }

    try {
      const order = {
        id: utils.generateId(),
        type,
        pair,
        amount,
        price,
        total,
        status: "open",
        timestamp: Date.now(),
      }

      const result = await api.placeOrder(order)

      if (result.success) {
        // Update balance
        const newBalance =
          type === "buy" ? data.accounts[accountType].balance - total : data.accounts[accountType].balance + total

        storage.updateBalance(newBalance, accountType)
        storage.addOrder(order, accountType)

        // Add transaction
        storage.addTransaction(
          {
            id: utils.generateId(),
            orderId: order.id,
            type,
            pair,
            amount,
            price,
            total,
            timestamp: Date.now(),
          },
          accountType,
        )

        utils.showNotification("Order placed successfully", "success")
        ui.updateBalance()
        ui.renderOrders()

        // Reset form
        document.getElementById(`${type}Form`).reset()
      }
    } catch (error) {
      utils.showNotification(error.message, "error")
    }
  },

  async cancelOrder(orderId) {
    const data = storage.getData()
    const accountType = data.settings.selectedAccount

    try {
      const result = await api.cancelOrder(orderId)

      if (result.success) {
        const order = data.accounts[accountType].orders.find((order) => order.id === orderId)

        // Refund the balance for buy orders
        if (order.type === "buy") {
          const newBalance = data.accounts[accountType].balance + order.total
          storage.updateBalance(newBalance, accountType)
        }

        storage.removeOrder(orderId, accountType)
        utils.showNotification("Order cancelled successfully", "success")
        ui.updateBalance()
        ui.renderOrders()
      }
    } catch (error) {
      utils.showNotification("Failed to cancel order", "error")
    }
  },

  startPriceUpdates() {
    api.startPriceUpdates((marketData) => {
      // Update market list
      Object.entries(marketData).forEach(([pair, data]) => {
        const marketItem = document.querySelector(`.market-item[data-pair="${pair}"]`)
        if (marketItem) {
          marketItem.querySelector("span:last-child").textContent =
            `${utils.formatNumber(data.price, 2)} ` +
            `(${data.change >= 0 ? "+" : ""}${utils.formatNumber(data.change, 2)}%)`
        }
      })

      // Update current trading pair price
      const data = storage.getData()
      const currentPair = data.settings.selectedPair
      const currentPrice = marketData[currentPair]?.price

      if (currentPrice) {
        document.getElementById("buyPrice").value = currentPrice
        document.getElementById("sellPrice").value = currentPrice
      }
    })
  },
}

