'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getMyResume, updateMyResume, tailorMyResume, generatePdf, parsePdfResume, Resume } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Loader } from '@/components/ui/Loader';
import { ResumePreview } from '@/components/resume/ResumePreview';
import { Upload, FileText, LogOut, Edit2, Save, X, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [baseResume, setBaseResume] = useState<Resume | null>(null);
  const [resumeJson, setResumeJson] = useState('');
  const [jdText, setJdText] = useState('');
  const [status, setStatus] = useState('idle');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      router.push('/login');
      return;
    }
    setToken(storedToken);
    fetchBaseResume(storedToken);
  }, [router]);

  const fetchBaseResume = async (authToken: string) => {
    try {
      const resume = await getMyResume(authToken);
      if (resume) {
        setBaseResume(resume);
        setResumeJson(JSON.stringify(resume, null, 2));
      }
    } catch (error) {
      console.error('Failed to fetch resume', error);
    }
  };

  const handleSaveBaseResume = async () => {
    if (!token) return;
    try {
      const resume: Resume = JSON.parse(resumeJson);
      await updateMyResume(token, resume);
      setBaseResume(resume);
      setIsEditing(false);
      // alert('Base resume saved!'); // Replaced with UI feedback if possible, or just silent success
    } catch (error) {
      alert('Invalid JSON or save failed');
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!token || !e.target.files?.[0]) return;
    
    try {
      setIsParsing(true);
      const file = e.target.files[0];
      const parsedResume = await parsePdfResume(token, file);
      setBaseResume(parsedResume);
      setResumeJson(JSON.stringify(parsedResume, null, 2));
      setIsParsing(false);
    } catch (error) {
      console.error(error);
      alert('Failed to parse PDF');
      setIsParsing(false);
    }
  };

  const handleProcess = async () => {
    if (!token || !baseResume) return;
    try {
      setStatus('tailoring');
      
      const tailoredResume = await tailorMyResume(token, { raw_text: jdText });
      
      setStatus('generating');
      const pdfBlob = await generatePdf(tailoredResume);
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      
      setStatus('complete');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    router.push('/login');
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold">R</div>
          <span className="font-bold text-xl tracking-tight">Resume Tailor</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-500 hover:text-red-600">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Panel: Resume Preview */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" /> Your Base Resume
            </h2>
            <div className="flex gap-2">
              <div className="relative">
                <input 
                  type="file" 
                  accept=".pdf"
                  onChange={handlePdfUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isParsing}
                />
                <Button variant="secondary" size="sm" isLoading={isParsing}>
                  <Upload className="w-4 h-4 mr-2" /> {isParsing ? 'Parsing...' : 'Import PDF'}
                </Button>
              </div>
              <Button 
                variant={isEditing ? "primary" : "outline"} 
                size="sm" 
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit2 className="w-4 h-4 mr-2" />}
                {isEditing ? 'Cancel Edit' : 'Edit Data'}
              </Button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="editor"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="h-[calc(100vh-200px)] flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-700">Edit JSON Data</h3>
                    <Button size="sm" onClick={handleSaveBaseResume}>
                      <Save className="w-4 h-4 mr-2" /> Save Changes
                    </Button>
                  </div>
                  <textarea
                    className="flex-1 w-full p-4 font-mono text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                    value={resumeJson}
                    onChange={(e) => setResumeJson(e.target.value)}
                  />
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar"
              >
                {baseResume ? (
                  <ResumePreview resume={baseResume} />
                ) : (
                  <Card className="h-full flex flex-col items-center justify-center text-center p-12 border-dashed border-2 border-gray-300 bg-gray-50/50">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                      <Upload className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Resume Found</h3>
                    <p className="text-gray-500 max-w-sm mb-6">
                      Upload your existing PDF resume to get started, or paste your resume data manually.
                    </p>
                    <div className="relative">
                      <input 
                        type="file" 
                        accept=".pdf"
                        onChange={handlePdfUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Button size="lg">Upload Resume PDF</Button>
                    </div>
                  </Card>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Panel: Job Description & Tailoring */}
        <div className="lg:col-span-5 space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-600" /> Tailor to Job
          </h2>
          
          <Card className="h-fit sticky top-24">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paste Job Description
                </label>
                <textarea
                  className="w-full h-64 p-4 text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none shadow-inner"
                  placeholder="Paste the full job description here..."
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                />
              </div>

              <Button 
                className="w-full h-14 text-lg shadow-blue-200 shadow-xl" 
                onClick={handleProcess}
                disabled={!baseResume || !jdText || (status !== 'idle' && status !== 'complete' && status !== 'error')}
              >
                {status === 'idle' && <>Tailor Resume <ChevronRight className="ml-2" /></>}
                {status === 'tailoring' && <><Loader /> <span className="ml-2">Analyzing & Rewriting...</span></>}
                {status === 'generating' && <><Loader /> <span className="ml-2">Generating PDF...</span></>}
                {status === 'complete' && <>Done! Tailor Another?</>}
                {status === 'error' && <><AlertCircle className="mr-2" /> Error - Try Again</>}
              </Button>

              {/* Result Area */}
              <AnimatePresence>
                {pdfUrl && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pt-6 border-t border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-green-600 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" /> Tailored Resume Ready
                      </h3>
                      <a href={pdfUrl} download="Tailored_Resume.pdf">
                        <Button size="sm" variant="outline">Download PDF</Button>
                      </a>
                    </div>
                    <iframe 
                      src={pdfUrl} 
                      className="w-full h-[400px] rounded-lg border border-gray-200 shadow-sm" 
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </div>

      </main>
    </div>
  );
}
