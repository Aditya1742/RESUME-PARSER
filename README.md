# Resume Parser - Full Stack Application

A modern, responsive Resume Parser web application with a React frontend and Python backend.

## Project Structure

```
resume-parser/
├── frontend/          # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page-level components
│   │   ├── contexts/     # React Context providers
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
│
├── backend/           # Python Flask API
│   ├── app.py              # Flask application entry
│   ├── parser_engine.py    # Resume parsing logic
│   └── requirements.txt
│
├── start.ps1          # One-click startup script (Windows)
└── README.md
```

## Features

### Frontend
- **Authentication**: Login page with email/password validation
- **Dashboard**: Responsive layout with sidebar navigation
- **Resume Upload**: Drag & drop + file browse (PDF/DOCX)
- **Job Description**: Dynamic text area with save/edit functionality
- **Parsed Output**: Structured display of extracted candidate data
- **Dark Mode**: Toggle between light and dark themes
- **Toast Notifications**: Success/error feedback
- **Progress Bar**: Visual feedback during parsing
- **Mobile Responsive**: Works on all screen sizes

### Backend
- **Flask REST API**: Clean endpoints for auth, parsing, and JD management
- **Resume Parsing**: Extracts text from PDF/DOCX using PyMuPDF and python-docx
- **NLP Processing**: spaCy-based entity extraction and text cleaning
- **Skill Matching**: TF-IDF + cosine similarity for job-resume matching
- **Semantic Scoring**: Overlap and semantic match scores

## Quick Start (Windows)

Run the provided startup script:

```powershell
cd resume-parser
.\start.ps1
```

This will:
1. Create a Python virtual environment (if needed)
2. Install backend dependencies
3. Download spaCy language model (if needed)
4. Start the Flask backend on `http://localhost:5000`
5. Install frontend dependencies (if needed)
6. Start the Vite dev server on `http://localhost:5173`

## Manual Setup

### Backend

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
python app.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/login` | User login |
| POST | `/api/resume/parse` | Upload and parse resume |
| POST | `/api/job-description/save` | Save job description |

## Component Breakdown

| Component | Purpose |
|-----------|---------|
| `Navbar.jsx` | Top navigation bar with dark mode toggle |
| `Sidebar.jsx` | Left navigation sidebar (responsive) |
| `ResumeUpload.jsx` | Drag & drop file upload component |
| `JobDescription.jsx` | JD text editor with domain examples |
| `ParsedOutput.jsx` | Displays extracted resume data |
| `ProgressBar.jsx` | Animated progress indicator |
| `Toast.jsx` | Notification popups |
| `LoginPage.jsx` | Authentication page |
| `DashboardPage.jsx` | Main dashboard layout |

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React
- **Backend**: Flask, PyMuPDF, python-docx, spaCy, scikit-learn
- **NLP**: spaCy (en_core_web_sm), TF-IDF vectorization

## Notes

- The backend uses an in-memory mock for authentication. In production, replace with a proper auth system (JWT, OAuth, etc.)
- Job descriptions are saved in-memory only. Connect to a database for persistence.
- Uploaded files are temporarily stored and deleted after processing.

