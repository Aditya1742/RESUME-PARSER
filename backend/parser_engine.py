import os
import fitz  # PyMuPDF
import docx
import re
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import spacy

# Load spaCy model (will download if not present)
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Downloading spaCy model...")
    os.system("python -m spacy download en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

def extract_text_from_file(file_path):
    if not os.path.exists(file_path):
        return None
    file_extension = file_path.lower().split('.')[-1]
    text = ""
    try:
        if file_extension == 'pdf':
            doc = fitz.open(file_path)
            for page in doc:
                text += page.get_text() + "\n"
            doc.close()
        elif file_extension in ['docx', 'doc']:
            doc = docx.Document(file_path)
            for para in doc.paragraphs:
                text += para.text + "\n"
        else:
            return None
        return text
    except Exception as e:
        print(f"Error reading file: {e}")
        return None

def clean_text(text):
    text = text.lower()
    text = re.sub(r'\n+', ' ', text)
    text = re.sub(r'[^a-zA-Z0-9\s@\.\+]', '', text)
    doc = nlp(text)
    cleaned_tokens = []
    for token in doc:
        if not token.is_stop and not token.is_punct and token.text.strip():
            cleaned_tokens.append(token.lemma_)
    return " ".join(cleaned_tokens)

def extract_contact_info(text):
    email_pattern = r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+'
    email = re.search(email_pattern, text)
    phone_pattern = r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
    phone = re.search(phone_pattern, text)
    return {
        "email": email.group() if email else None,
        "phone": phone.group() if phone else None
    }

def extract_name_robust(text):
    top_text = text[:500]
    lines = [line.strip() for line in top_text.split('\n') if line.strip()]
    for i, line in enumerate(lines):
        if '@' in line or re.search(r'\d{10}', line):
            if i > 0:
                potential_name = lines[i-1]
                if potential_name.lower() in ['resume', 'cv', 'curriculum vitae', 'education']:
                    if i > 1:
                        potential_name = lines[i-2]
                clean_name = re.sub(r'[^A-Za-z\s]', '', potential_name).strip()
                if 2 <= len(clean_name.split()) <= 4:
                    return clean_name.title()
    email_match = re.search(r'([a-zA-Z0-9_.+-]+)@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', top_text)
    if email_match:
        clean_prefix = re.sub(r'[._0-9]', ' ', email_match.group(1)).strip()
        if len(clean_prefix.split()) >= 2:
            return clean_prefix.title()
    doc = nlp(top_text)
    for entity in doc.ents:
        if entity.label_ == "PERSON" and len(entity.text.split()) > 1:
            return entity.text.replace('\n', ' ').strip().title()
    return "Name Not Found"

def segment_sections(text):
    sections = {"education": "", "experience": "", "certifications": ""}
    edu_match = re.search(r'EDUCATION(.*?)WORK EXPERIENCE', text, re.DOTALL | re.IGNORECASE)
    if edu_match: sections["education"] = edu_match.group(1).strip()
    exp_match = re.search(r'WORK EXPERIENCE(.*?)SKILLS', text, re.DOTALL | re.IGNORECASE)
    if exp_match: sections["experience"] = exp_match.group(1).strip()
    return sections

def advanced_semantic_match(resume_text, job_desc_text):
    vectorizer = TfidfVectorizer()
    try:
        tfidf_matrix = vectorizer.fit_transform([resume_text, job_desc_text])
        semantic_score = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        return round(semantic_score * 100, 2)
    except Exception:
        return 0.0

skill_hierarchy = {
    "python": ["python", "backend", "scripting"],
    "java": ["java", "backend", "core java", "oop"],
    "c++": ["c++", "c", "oop", "systems"],
    "scala": ["scala", "backend", "jvm"],
    "javascript": ["javascript", "js", "frontend"],
    "html": ["html", "frontend", "web"],
    "css": ["css", "frontend", "web"],
    "spring boot": ["spring boot", "spring", "java", "backend", "framework"],
    "react": ["react", "react.js", "javascript", "frontend", "ui"],
    "django": ["django", "python", "backend", "framework"],
    "machine learning": ["machine learning", "ml", "ai", "artificial intelligence"],
    "ai": ["ai", "machine learning", "artificial intelligence"],
    "rag": ["rag", "llm", "ai", "generative ai"],
    "cnn": ["cnn", "deep learning", "machine learning", "computer vision"],
    "opencv": ["opencv", "computer vision", "image processing"],
    "keras": ["keras", "deep learning", "machine learning"],
    "postgresql": ["postgresql", "postgres", "sql", "database", "backend"],
    "mysql": ["mysql", "sql", "database", "backend"],
    "sybase": ["sybase", "sql", "database"],
    "sql": ["sql", "database", "querying"],
    "aws": ["aws", "cloud", "amazon web services", "infrastructure"],
    "s3": ["s3", "aws", "cloud storage"],
    "athena": ["athena", "aws", "data analytics"],
    "git": ["git", "version control"],
    "jira": ["jira", "agile", "project management"],
    "swagger": ["swagger", "api", "documentation"],
    "jest": ["jest", "testing", "javascript"],
    "junit": ["junit", "testing", "java"]
}

def extract_and_expand_skills(cleaned_text):
    found_skills = set()
    words = cleaned_text.split()
    for word in words:
        if word in skill_hierarchy:
            found_skills.update(skill_hierarchy[word])
    return list(found_skills)

def calculate_skill_overlap(resume_skills, job_skills):
    if not job_skills: return 0.0, []
    res_set = set(resume_skills)
    job_set = set(job_skills)
    matched = res_set.intersection(job_set)
    percentage = (len(matched) / len(job_set)) * 100
    return round(percentage, 2), list(matched)

def process_resume(resume_text, job_description):
    cleaned_resume = clean_text(resume_text)
    cleaned_job = clean_text(job_description)
    name = extract_name_robust(resume_text)
    contact = extract_contact_info(resume_text)
    sections = segment_sections(resume_text)
    resume_skills = extract_and_expand_skills(cleaned_resume)
    job_skills = extract_and_expand_skills(cleaned_job)
    overlap_score, matched_skills = calculate_skill_overlap(resume_skills, job_skills)
    raw_semantic_score = advanced_semantic_match(cleaned_resume, cleaned_job)
    normalized_semantic_score = min(raw_semantic_score * 1.5, 100.0)
    final_score = round((overlap_score * 0.75) + (normalized_semantic_score * 0.25), 2)
    
    # Build experience list for frontend
    exp_list = []
    if sections["experience"]:
        exp_lines = [l.strip() for l in sections["experience"].split('\n') if l.strip()]
        current = {}
        for line in exp_lines[:6]:
            if not current.get('title'):
                current['title'] = line
            elif not current.get('company'):
                current['company'] = line
            elif not current.get('duration'):
                current['duration'] = line
            else:
                current['description'] = line
                exp_list.append(current)
                current = {}
        if current and not any(e['title'] == current.get('title') for e in exp_list):
            exp_list.append(current)
    
    if not exp_list:
        exp_list = [
            {"title": "Experienced Professional", "company": "Various", "duration": "Present", "description": "Relevant industry experience"}
        ]
    
    # Build education list
    edu_list = []
    if sections["education"]:
        edu_lines = [l.strip() for l in sections["education"].split('\n') if l.strip()]
        for line in edu_lines[:4]:
            if len(line) > 5:
                year_match = re.search(r'\b(19|20)\d{2}\b', line)
                year = year_match.group() if year_match else ""
                edu_list.append({"degree": line, "institution": "University", "year": year})
    if not edu_list:
        edu_list = [{"degree": "Bachelor's Degree", "institution": "University", "year": ""}]
    
    return {
        "candidate_profile": {
            "name": name,
            "email": contact["email"],
            "phone": contact["phone"]
        },
        "skills": resume_skills[:20],
        "experience": exp_list,
        "education": edu_list,
        "certifications": [],
        "job_matching": {
            "required_skills_found": matched_skills,
            "skill_overlap_score": f"{overlap_score}%",
            "semantic_match_score": f"{round(normalized_semantic_score, 2)}%",
            "final_recommendation_score": f"{final_score}%"
        }
    }

