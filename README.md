# TeachSync

> **An AI-powered classroom assistant that transforms raw lecture audio into structured notes and multi-format student quizzes in seconds.**

[![React](https://img.shields.io/badge/Frontend-React%20%7C%20Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini%20API-8E75B2?logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![SkillPatch](https://img.shields.io/badge/Validated%20With-SkillPatch%20Postman-FF6C37?logo=postman&logoColor=white)](https://github.com/)

---

## 📌 Problem & Solution

Teachers spend countless hours manually drafting study guides, summarizing lecture topics, and composing practice quizzes after class. **TeachSync** automates this end-to-end workflow:

1. **Capture**: Record live classroom audio or upload audio files directly from the web dashboard.
2. **Transform**: Process spoken content (including Hinglish and code-switching) using Google Gemini AI into rich Markdown lecture notes, key takeaways, and customizable quizzes.
3. **Review & Edit**: Teachers can review, tweak, and refine generated summaries, raw transcripts, and quiz questions before publication.
4. **Dispatch**: Automatically email formatted HTML lecture notes and practice assessments directly to every registered student in the class with one click via Nodemailer.

---

## ✨ Key Features

- 🎙️ **Audio Transcription & Processing**
  - **Live Recording & File Upload**: Record live classroom lectures or upload recorded audio files (`.mp3`, `.wav`, `.m4a`, `.webm`).
  - **Multilingual & Code-Switching Support**: High-accuracy speech handling for mixed classroom language (e.g., Hinglish, Spanglish).

- 🧠 **AI-Driven Content & Assessment Generation**
  - **Structured Summaries & Notes**: Automatically extracts key takeaways and builds comprehensive, beautifully formatted Markdown lecture notes.
  - **Multi-Format Quizzes**: Generates practice assessments across multiple formats:
    - Multiple-Choice Questions (MCQs)
    - Short Answer Questions
    - Fill-in-the-Blanks
  - **Explanations & Answer Keys**: Provides auto-generated answer keys with detailed explanations for every question.

- 📧 **Automated Nodemailer Student Dispatch System**
  - **One-Click Dispatch**: Instantly email lecture summaries, practice quizzes, and answer keys directly to all enrolled students.
  - **Responsive HTML Email Templates**: Generates styled email templates with clear section boundaries for readability on mobile and desktop.

- 🏫 **Classroom & Roster Management**
  - Create and manage subject classes, student rosters, and email distribution lists.
  - Store draft and dispatched lectures in MongoDB for future reference and continuous learning history.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS, Lucide React Icons
- **HTTP Client**: Axios
- **Routing**: React Router DOM v6

### **Backend**
- **Runtime**: Node.js & Express.js (ES Modules)
- **Database**: MongoDB & Mongoose ORM
- **File Uploads**: Multer (in-memory storage for audio processing)
- **Email Delivery**: Nodemailer (SMTP transport)

### **Artificial Intelligence**
- **Google Gemini API** (`@google/genai`): Utilized for high-accuracy audio transcription, natural language comprehension, structured summary generation, and multi-format quiz synthesis.

---

## 🔌 SkillPatch Integration

During development, backend route reliability, status assertions, and response payload structures were validated using the **`postman-test-script-generator`** skill from **SkillPatch**.

### **How SkillPatch Was Used:**
- **Automated Test Script Generation**: Created assertions for HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`).
- **Schema & Payload Validation**: Verified structural integrity of returned lecture objects, including nested summary arrays, assessment item types (`mcq`, `short_answer`, `fill_in_the_blanks`), and answer keys.
- **Dynamic Endpoint Testing**: Automated test execution scripts across key backend API routes:
  - `POST /api/classes` & `GET /api/classes`
  - `POST /api/lectures/generate-draft` (Multer audio multipart upload & AI synthesis)
  - `POST /api/lectures/dispatch` (Nodemailer batch email dispatch execution)

---

## 🔑 Environment Variables

To run the project locally, create a `.env` file in the `backend/` directory with the following keys:

### `backend/.env`
```env
# Server Configuration
PORT=5000

# MongoDB Connection String
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/teachsync?retryWrites=true&w=majority

# Google Gemini API Key
GEMINI_API_KEY=your_google_gemini_api_key_here

# Optional: Override Gemini Model (Defaults to gemini-3.6-flash)
GEMINI_MODEL=gemini-3.6-flash

# Nodemailer Credentials (Gmail App Password recommended)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

*(Note: Never commit actual API keys or credentials to public source control.)*

---

## 🚀 Installation & Setup

### **Prerequisites**
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: A running local MongoDB instance or MongoDB Atlas cluster.

---

### **1. Clone the Repository**
```bash
git clone https://github.com/your-username/teachsync.git
cd teachsync
```

---

### **2. Setup & Start the Backend**

```bash
# Navigate to the backend folder
cd backend

# Install dependencies
npm install

# Start the development server (runs with --watch)
npm run dev
```

The backend server will start on `http://localhost:5000`.

---

### **3. Setup & Start the Frontend**

Open a new terminal window:

```bash
# Navigate to the frontend folder
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

The frontend application will be accessible at `http://localhost:5173` (or the URL displayed in the Vite terminal output).

---

## 📊 API Architecture Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check endpoint |
| `POST` | `/api/classes` | Create a new class with student roster |
| `GET` | `/api/classes` | Retrieve all registered classes |
| `GET` | `/api/classes/:id` | Get details for a specific class |
| `POST` | `/api/lectures/generate-draft` | Upload lecture audio & generate AI summary + quizzes |
| `POST` | `/api/lectures/dispatch` | Update lecture draft and dispatch emails to students |
| `GET` | `/api/lectures` | List all saved/dispatched lectures |
| `GET` | `/api/lectures/:id` | Fetch lecture by ID |

---
