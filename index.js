require("dotenv").config();

const express = require("express");
const bodyParser= require("body-parser");
const axios = require("axios");


const app = express();
app.use(bodyParser.json())


const { TEL_TOKEN, URL_NGROK} = process.env;

const TEL_API = `https://api.telegram.org/bot${TEL_TOKEN}`;

const WEBHOOK_END = '/webhook/' + TEL_TOKEN;
const WEBHOOK_URL = URL_NGROK + WEBHOOK_END;
const setWebhookUrl = async () => {
    try {
        const res = await axios.get(`${TEL_API}/setWebhook?url=${encodeURIComponent(WEBHOOK_URL)}`);
        console.log("setWebhook response:", res.data);
    } catch (err) {
        if (err && err.response) {
            console.error('setWebhook failed:', err.response.status, err.response.data);
        } else {
            console.error('setWebhook error:', err && err.message ? err.message : err);
        }
    }
};

app.listen(process.env.PORT || 4040, () => {
    console.log("app running on port", process.env.PORT || 4040);
    setWebhookUrl();
});

app.post(WEBHOOK_END, async (req, res) => {
    console.log("req.body:>>", req.body);
    const message = req.body && req.body.message;
    if (!message) return res.sendStatus(200);

    const chat_id = message.chat && message.chat.id;
    const text = message.text || '';

    try {
        await axios.post(`${TEL_API}/sendMessage`, {
            chat_id,
            text,
        });
    } catch (err) {
        console.error('sendMessage error:', err && err.response ? err.response.data : err && err.message ? err.message : err);
    }
    return res.sendStatus(200);
});

