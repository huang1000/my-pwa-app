const fetch = require("node-fetch");

(async () => {
  await fetch("http://localhost:3000/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Hello from Server 🚀",
      body: "This is a test push notification"
    })
  });
})();