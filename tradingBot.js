require("dotenv").config();
const axios = require("axios");
const CryptoJS = require("crypto-js");

const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;
const BASE_URL = "https://futures.mexc.com";

// Function to generate signature for MEXC API
function getSignature(params) {
    return CryptoJS.HmacSHA256(params, API_SECRET).toString(CryptoJS.enc.Hex);
}

// Function to get current market price
async function getMarketPrice(symbol) {
    const endpoint = `/api/v1/ticker/price`;
    try {
        const response = await axios.get(BASE_URL + endpoint, { params: { symbol } });
        return parseFloat(response.data.price);
    } catch (error) {
        console.error("Market Data Error:", error.response?.data || error.message);
        return null;
    }
}

// Function to place an order (buy or sell)
async function placeOrder(symbol, side, quantity, price) {
    const endpoint = "/api/v1/order";
    const timestamp = Date.now();
    const params = `symbol=${symbol}&side=${side}&type=LIMIT&quantity=${quantity}&price=${price}&timestamp=${timestamp}`;
    const signature = getSignature(params);
    
    try {
        const response = await axios.post(BASE_URL + endpoint + `?${params}&signature=${signature}`, {}, {
            headers: { "X-MEXC-APIKEY": API_KEY }
        });
        console.log("Order Placed:", response.data);
        return response.data;
    } catch (error) {
        console.error("Order Error:", error.response.data);
    }
}

// Function to cancel an order
async function cancelOrder(symbol, orderId) {
    const endpoint = "/api/v1/order";
    const timestamp = Date.now();
    const params = `symbol=${symbol}&orderId=${orderId}&timestamp=${timestamp}`;
    const signature = getSignature(params);
    
    try {
        const response = await axios.delete(BASE_URL + endpoint + `?${params}&signature=${signature}`, {
            headers: { "X-MEXC-APIKEY": API_KEY }
        });
        console.log("Order Canceled:", response.data);
    } catch (error) {
        console.error("Cancel Error:", error.response.data);
    }
}

// Function for risk management (stop-loss and take-profit)
async function manageRisk(symbol, entryPrice, stopLossPct, takeProfitPct, orderId) {
    const currentPrice = await getMarketPrice(symbol);
    if (!currentPrice) return;

    const stopLossPrice = entryPrice * (1 - stopLossPct / 100);
    const takeProfitPrice = entryPrice * (1 + takeProfitPct / 100);

    if (currentPrice <= stopLossPrice) {
        console.log("Stop-Loss Triggered! Closing Position...");
        await cancelOrder(symbol, orderId);
        await placeOrder(symbol, "SELL", 0.01, currentPrice);
    } else if (currentPrice >= takeProfitPrice) {
        console.log("Take-Profit Reached! Closing Position...");
        await cancelOrder(symbol, orderId);
        await placeOrder(symbol, "SELL", 0.01, currentPrice);
    } else {
        console.log("Position is safe for now.");
    }
}

// Example: A simple moving average crossover strategy
async function tradeBasedOnStrategy(symbol, shortTermMA, longTermMA, quantity) {
    const currentPrice = await getMarketPrice(symbol);
    if (!currentPrice) return;

    if (shortTermMA > longTermMA) {
        console.log("Bullish Signal: Placing Buy Order");
        await placeOrder(symbol, "BUY", quantity, currentPrice);
    } else if (shortTermMA < longTermMA) {
        console.log("Bearish Signal: Placing Sell Order");
        await placeOrder(symbol, "SELL", quantity, currentPrice);
    } else {
        console.log("No clear signal. Waiting...");
    }
}

// Function to run the bot
async function runBot() {
    const symbol = "BTCUSDT";
    const shortTermMA = 45010;  // Replace with real-time calculation
    const longTermMA = 44950;   // Replace with real-time calculation
    const quantity = 0.01;

    await tradeBasedOnStrategy(symbol, shortTermMA, longTermMA, quantity);

    setTimeout(runBot, 5000);  // Run every 5 seconds
}

runBot();
