const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const webpush = require("web-push");
const app = express();

/*
const vapidKeys = webpush.generateVAPIDKeys();
console.log("VAPID Keys:", vapidKeys);
*/
// npx web-push generate-vapid-keys
const PORT = process.env.PORT;
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
  console.error("❌ VAPID keys missing in .env");
  process.exit(1);
}

app.use(cors());
app.use(bodyParser.json());

// Configure web-push
webpush.setVapidDetails(
  "mailto:huangdongxy@hotmail.com",
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

let subscriptions = [];

// Subscribe endpoint
app.post("/subscribe", (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({});
  console.log("✅ Subscribed:", subscription);
});

// Send notification to all subscribers
app.post("/send", async (req, res) => {
  const { title, body } = req.body;
  const payload = JSON.stringify({ title, body });

  subscriptions.forEach((sub) =>
    webpush.sendNotification(sub, payload).catch(console.error)
  );
  res.json({ ok: true });
});

// Background sync endpoint
app.post("/sync-endpoint", (req, res) => {
  console.log("📡 Received sync data:", req.body);
  res.json({ ok: true });
});

// send the public key
app.get("/publicKey", (req, res) => {
  res.send(VAPID_PUBLIC_KEY);
});

app.listen(PORT, () => { console.log(`✅ Server running on http://localhost:${PORT}`); });