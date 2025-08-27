# My PWA App

This is a minimal Progressive Web App (PWA) example.

- **Frontend**: React + Vite (inside `src/`)
- **Backend**: Node.js + Express (inside `server/`)
- **Features**:
  - Service Worker (offline caching, background sync, push notifications)
  - Push Notifications with **VAPID keys**
  - Hugging Face LLM API integration via `@gradio/client`
  - Monorepo managed with **npm workspaces**
  - Docker + Docker Compose setup for easy deployment

## Project Structure

```
my-pwa-app
├── src/               # Frontend (React + Vite)
│   ├── app.js
│   ├── index.html
│   ├── service-worker.js
│   └── package.json
│
├── server/            # Backend (Express API + Push notifications)
│   ├── server.js
│   └── package.json
│
├── docker-compose.yml # Orchestrates frontend + backend
├── package.json       # Root package.json (workspaces)
├── package-lock.json  # Root lock file
└── README.md
```

## Getting Started

To set up and run the PWA, follow these steps:

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd my-pwa-app
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. Environment Variables

Create a .env file inside `server/`:
```env
PORT=3000
VAPID_PUBLIC_KEY=your_generated_public_key
VAPID_PRIVATE_KEY=your_generated_private_key
```

Generate keys once:
```bash
npx web-push generate-vapid-keys
```

4. **Run the application:**
   Run frontend + backend together:
   ```
   docker compose up --build
   ```

   -	Frontend: http://localhost:5173
	-	Backend: http://localhost:3000

5. **Access the app:**
   Open your browser and navigate to `http://localhost:8080` (or the port specified by your server).

6. Development (without Docker)

   Start backend:
   ```bash
   cd server
   npm start
   ```

   Start frontend
   ```bash
   cd src
   npm run dev
   ```

## Features

- Offline capabilities through service worker
- Basic caching strategies
- Responsive design

## License

This project is licensed under the MIT License.