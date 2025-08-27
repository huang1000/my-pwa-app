const PORT = 3000;

// Register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
}
else {
  console.warn("Service workers not supported");
}

// Utility: get VAPID key from server
async function getVapidPublicKey() {
  const res = await fetch(`http://localhost:${PORT}/publicKey`);
  return await res.text();
}

// Utility: convert base64 public key to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

// ---- Push Notifications subscription ----
document.getElementById("subscribe").addEventListener("click", async () =>{
  const registration = await navigator.serviceWorker.ready;
  const publicKey = await getVapidPublicKey();

  // Request permission from user
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    alert("Notification not granted");
    return;
  }

  const sub = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey),
  });

  await fetch(`http://localhost:${PORT}/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sub),
  });

  console.log("🔔 Push subscription:", JSON.stringify(sub));
});



// ---- BACKGROUND SYNC ----
document.getElementById("send").addEventListener("click", async () => {
  const registration = await navigator.serviceWorker.ready;
  if ("sync" in registration) {
    await registration.sync.register("send-data");
    console.log("📡 Background sync registered!");
  } else {
    console.log("⚠️ Background sync not supported.");
  }
});

// ---- LLM Request ----
import { Client } from "@gradio/client";

document.getElementById("run-llm").addEventListener("click", async () => {
  const prompt = document.getElementById("prompt").value;
  const systemPrompt = document.getElementById("system-prompt").value || "You are a helpful assistant.";
  const temperature = parseFloat(document.getElementById("temperature").value) || 0;

  if (!prompt) {
    alert("Please enter a prompt!");
    return;
  }

  const responseDiv = document.getElementById("llm-response");
  responseDiv.textContent = "⏳ Waiting for LLM response...";

  try {
    // Connect to the Hugging Face Space
    const client = await Client.connect("amd/gpt-oss-120b-chatbot");
    // Call the `/chat` endpoint
    const result = await client.predict("/chat", {
      message: prompt,
      system_prompt: systemPrompt,
      temperature: temperature,
    });

    // Show result
    responseDiv.textContent = result?.data || "No response from LLM";

  } catch (err) {
    console.error("❌ Error contacting LLM:", err);
    responseDiv.textContent = "❌ Error contacting LLM (see console)";
  }
});
