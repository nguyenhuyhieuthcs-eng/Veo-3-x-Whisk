
# Whisk + Veo3 Combo Showcase

This is a full-stack web application built to demonstrate a fictional "Whisk + Veo3 Combo" AI media generation package. The frontend is built with React and Tailwind CSS, and the backend server using Node.js and Express can operate in a mock mode or by connecting to the live Google Gemini API.

The application is designed to be fully functional in mock mode out-of-the-box, allowing you to experience the UI and features without needing real API keys.

## Features

- **Modern Landing Page**: An introduction to the Whisk + Veo3 Combo package and its features.
- **Whisk AI**: An interface for generating images from text prompts with various options.
- **Veo3 AI**: An interface for generating videos, demonstrating an asynchronous job polling mechanism.
- **Account & Services**: A section showing mock account integration and support options.
- **Dual-Mode Backend**: An Express server that uses the live Gemini API if a key is provided, otherwise it simulates API responses for image and video generation.

---

## Project Structure

```
.
├── client/        # React Frontend Application (at root for this bundle)
│   ├── components/ 
│   ├── views/      
│   ├── hooks/      
│   ├── types.ts    
│   ├── App.tsx
│   └── index.tsx
├── server/        # Node.js + Express Backend
│   ├── .env.example # Example environment file
│   ├── server.js   
│   └── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### 1. Running the Backend Server

The server is crucial for the frontend to function correctly.

1.  **Navigate to the server directory:**
    ```bash
    cd server
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure API (Optional):** To use the real Gemini API, see the "Configuration" section below. Otherwise, the server will run in mock mode.

4.  **Start the server:**
    ```bash
    node server.js
    ```

The server will start on `http://localhost:3001`. Keep this terminal window open.

### 2. Running the Frontend Client

1.  **Open a new terminal window** and navigate to the project's root directory.

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the React development server:**
    ```bash
    npm start
    ```

The React application will open in your browser at `http://localhost:3000`.

---

## Configuration (Real API Mode)

By default, the server runs in **mock mode**. To connect to the real Gemini APIs for image and video generation, you need to provide an API key.

1.  **Create a `.env` file** inside the `server/` directory:
    ```
    server/.env
    ```

2.  **Add your API key** to the `.env` file:
    ```
    API_KEY=YOUR_GEMINI_API_KEY
    ```

3.  **Restart the server**:
    If the server is already running, stop it (`Ctrl+C`) and restart it with `node server.js`.

The server will automatically detect the `API_KEY` and switch from mock mode to using the Gemini API. If you remove the key, it will revert to mock mode.

---

## How Mock Mode Works

If no `API_KEY` is provided in a `server/.env` file, the application runs in "mock mode" by default.

-   **Image Generation (`/api/generate-image`)**: The backend waits for 2 seconds and then returns a random placeholder image URL from `picsum.photos`.
-   **Video Generation (`/api/generate-video`)**:
    -   The backend creates a job with a unique ID and sets its status to `processing`.
    -   It returns the `jobId` to the client immediately.
-   **Video Job Status (`/api/job-status/:id`)**:
    -   The frontend polls this endpoint every 3 seconds.
    -   The backend simulates processing. After 15 seconds, it updates the job status to `completed` and provides a URL to a sample video.

## Switching to Real APIs

The backend is already configured to use the Gemini API for image (`imagen-4.0-generate-001`) and video (`veo-2.0-generate-001`) generation. All you need to do is provide your API key as described in the **Configuration** section above.

If you need to change the API models or adjust parameters, you can do so in `server/server.js`.
