// server.js
const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
app.use(cors()); // Allow your frontend to call this server
app.use(express.json());

// --- YOUR BYBIT API CREDENTIALS ---
const BYBIT_API_KEY = "qzNSqYXlcTFYs2Tc3u";
const BYBIT_API_SECRET = "nchbOODvpVpp89UPs6da3xTe1ikERGpE6Q8p";
const BYBIT_API_URL = "https://api.bybit.com";

// --- Endpoint to get balance ---
app.get('/balance', async (req, res) => {
    try {
        const timestamp = Date.now();
        const recvWindow = 5000;
        const queryString = `category=linear&api_key=${BYBIT_API_KEY}&timestamp=${timestamp}&recvWindow=${recvWindow}`;
        
        const signature = crypto
            .createHmac('sha256', BYBIT_API_SECRET)
            .update(queryString)
            .digest('hex');
        
        const finalUrl = `${BYBIT_API_URL}/v5/account/wallet-balance?${queryString}&sign=${signature}`;

        const response = await axios.get(finalUrl);
        
        if (response.data.retCode === 0) {
            const balance = response.data.result.list[0].totalWalletBalance;
            res.json({ balance: balance });
        } else {
            res.status(400).json({ error: "Failed to fetch balance" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
});

// --- Start Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});