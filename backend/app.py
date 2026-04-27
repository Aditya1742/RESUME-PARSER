import os
import uuid
from flask import Flask, request, jsonify
from flask_cors import CORS
from parser_engine import extract_text_from_file, process_resume

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"})

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email', '')
    password = data.get('password', '')
    if not email or not password or len(password) < 6:
        return jsonify({"success": False, "message": "Invalid credentials"}), 401
    return jsonify({
        "success": True,
        "user": {"email": email, "name": email.split('@')[0], "id": "1"}
    })

@app.route('/api/resume/parse', methods=['POST'])
def parse_resume():
    if 'file' not in request.files:
        return jsonify({"success": False, "message": "No file uploaded"}), 400
    
    file = request.files['file']
    job_description = request.form.get('job_description', '')
    
    if file.filename == '':
        return jsonify({"success": False, "message": "Empty filename"}), 400
    
    ext = file.filename.rsplit('.', 1)[-1].lower()
    if ext not in ['pdf', 'docx', 'doc']:
        return jsonify({"success": False, "message": "Unsupported file type"}), 400
    
    filename = f"{uuid.uuid4().hex}.{ext}"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)
    
    try:
        resume_text = extract_text_from_file(filepath)
        if not resume_text:
            return jsonify({"success": False, "message": "Could not extract text"}), 400
        
        result = process_resume(resume_text, job_description)
        result["success"] = True
        return jsonify(result)
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if os.path.exists(filepath):
            os.remove(filepath)

@app.route('/api/job-description/save', methods=['POST'])
def save_jd():
    data = request.get_json()
    # Mock save - in production save to DB
    return jsonify({"success": True, "message": "Job description saved"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

