# TeachSync

TeachSync is an intelligent educational platform designed to streamline teaching workflows, content generation, and student engagement using generative AI.

## 🏗 Architecture

TeachSync is built using a modern full-stack web architecture:

- **Frontend**: React (Vite-powered)
- **Backend**: Node.js & Express
- **Database**: MongoDB (via Mongoose)
- **AI Service**: Google Gemini API (`@google/genai`)
- **Storage & Services**: Multer (file/audio uploads), Nodemailer (email notifications)

```
TeachSync/
├── backend/    # Express REST API, database models, Gemini AI services
└── frontend/   # Vite + React user interface
```

## 🚀 Local Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB instance (local or MongoDB Atlas connection string)
- Gemini API Key

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Setup Vite + React application:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
