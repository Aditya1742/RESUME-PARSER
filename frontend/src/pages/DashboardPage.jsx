import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ResumeUpload from '../components/ResumeUpload';
import JobDescription from '../components/JobDescription';
import ParsedOutput from '../components/ParsedOutput';
import Toast from '../components/Toast';

const API_URL = 'http://localhost:5000/api';

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState('upload');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [toast, setToast] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [jobDescription, setJobDescription] = useState('');

  const handleParse = async (files) => {
    setIsParsing(true);
    try {
      const file = files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('job_description', jobDescription);

      const res = await fetch(`${API_URL}/resume/parse`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setParsedData(data);
        setActiveSection('output');
        setToast({ message: `Successfully parsed ${file.name}!`, type: 'success' });
      } else {
        setToast({ message: data.message || 'Parse failed', type: 'error' });
      }
    } catch (e) {
      setToast({ message: 'Network error. Is the backend running?', type: 'error' });
    } finally {
      setIsParsing(false);
    }
  };

  const handleSaveJD = async (jd) => {
    setJobDescription(jd.content);
    try {
      await fetch(`${API_URL}/job-description/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jd)
      });
      setToast({ message: 'Job description saved successfully!', type: 'success' });
    } catch (e) {
      setToast({ message: 'Saved locally (backend unavailable)', type: 'info' });
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'upload':
        return <ResumeUpload onParse={handleParse} isParsing={isParsing} />;
      case 'job':
        return <JobDescription onSave={handleSaveJD} />;
      case 'output':
        return <ParsedOutput data={parsedData} />;
      default:
        return <ResumeUpload onParse={handleParse} isParsing={isParsing} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      
      <div className="lg:ml-20">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {renderSection()}
          </div>
        </main>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

