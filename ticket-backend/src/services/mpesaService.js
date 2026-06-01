const axios = require("axios");

const getAccessToken = async () => {
    const consumerKey = process.env.MPESA_CONSUMER_KEY?.trim();
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET?.trim();

    if (!consumerKey || !consumerSecret) {
        throw new Error("Missing MPESA_CONSUMER_KEY or MPESA_CONSUMER_SECRET environment variables.");
    }

    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

    const response = await axios.get(
        "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
        {
            headers: {
                Authorization: `Basic ${auth}`,
            },
        }
    );

    return response.data.access_token;
};

module.exports = { getAccessToken};