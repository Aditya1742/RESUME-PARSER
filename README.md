# Resume Parser - Full Stack Application

A modern, responsive Resume Parser web application with a React frontend and Python backend.

---

## 📁 Project Structure
---

## 🚀 Features

### Frontend

- Authentication: Login page with email/password validation  
- Dashboard: Responsive layout with sidebar navigation  
- Resume Upload: Drag & drop + file browse (PDF/DOCX)  
- Job Description: Dynamic text area with save/edit functionality  
- Parsed Output: Structured display of extracted candidate data  
- Dark Mode: Toggle between light and dark themes  
- Toast Notifications: Success/error feedback  
- Progress Bar: Visual feedback during parsing  
- Mobile Responsive: Works on all screen sizes  

---

### Backend

- Flask REST API: Clean endpoints for auth, parsing, and JD management  
- Resume Parsing: Extracts text from PDF/DOCX using PyMuPDF and python-docx  
- NLP Processing: spaCy-based entity extraction and text cleaning  
- Skill Matching: TF-IDF + cosine similarity for job-resume matching  
- Semantic Scoring: Overlap and semantic match scores  

---

## ⚡ Quick Start (Windows)

Run the provided startup script:

```bash
cd resume-parser
.\start.ps1
