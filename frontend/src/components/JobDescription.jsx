import React, { useState } from 'react';
import { Save, RotateCcw, Briefcase } from 'lucide-react';

const DOMAIN_TEMPLATES = {
  it: `We are looking for a Software Engineer with 3+ years of experience in:
- React.js, Node.js, TypeScript
- RESTful APIs and GraphQL
- Cloud platforms (AWS/Azure)
- Agile development methodologies
- Database design and optimization`,
  marketing: `Seeking a Marketing Manager with:
- 4+ years of digital marketing experience
- SEO/SEM expertise
- Content strategy and social media management
- Data-driven campaign optimization
- Excellent communication skills`,
  finance: `Hiring a Financial Analyst with:
- CPA or CFA certification preferred
- 3+ years in financial modeling
- Advanced Excel and SQL skills
- Experience with ERP systems
- Strong analytical and problem-solving abilities`,
  hr: `Looking for an HR Business Partner with:
- 5+ years of HR experience
- Talent acquisition and retention strategies
- Employee relations expertise
- HRIS system knowledge
- SHRM or HRCI certification`,
};

export default function JobDescription({ onSave }) {
  const [content, setContent] = useState('');
  const [domain, setDomain] = useState('it');
  const [title, setTitle] = useState('');
  const [saved, setSaved] = useState(false);

  const handleDomainChange = (e) => {
    const newDomain = e.target.value;
    setDomain(newDomain);
    setContent(DOMAIN_TEMPLATES[newDomain]);
    setSaved(false);
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    onSave?.({ title, content, domain });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setTitle('');
    setContent('');
    setDomain('it');
    setSaved(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Job Description</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Create or edit job descriptions for candidate matching</p>
      </div>

      <div className="card space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Job Title
          </label>
          <input
            type="text"
            value={title}
            onChange={e => { setTitle(e.target.value); setSaved(false); }}
            placeholder="e.g., Senior Software Engineer"
            className="input-field"
          />
        </div>

        {/* Domain Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Domain Template
          </label>
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-gray-500" />
            <select
              value={domain}
              onChange={handleDomainChange}
              className="input-field w-auto"
            >
              <option value="it">Information Technology</option>
              <option value="marketing">Marketing</option>
              <option value="finance">Finance</option>
              <option value="hr">Human Resources</option>
            </select>
          </div>
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            value={content}
            onChange={e => { setContent(e.target.value); setSaved(false); }}
            rows={12}
            placeholder="Enter job description details..."
            className="input-field resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={!title.trim() || !content.trim()}
            className="btn-primary flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saved ? 'Saved!' : 'Save JD'}
          </button>
          <button
            onClick={handleReset}
            className="btn-secondary flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

