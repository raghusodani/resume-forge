'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api, Resume } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Loader } from '@/components/ui/Loader';
import { ResumePreview } from '@/components/resume/ResumePreview';
import { PdfViewer } from '@/components/resume/PdfViewer';
import { Upload, FileText, LogOut, Edit2, Save, X, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function Dashboard() {
  const { token, logout, isAuthenticated, isLoading: authLoading } = useAuth();
  const [baseResume, setBaseResume] = useState<Resume | null>(null);
  const [resumeJson, setResumeJson] = useState('');
  const [jdText, setJdText] = useState('');
  const [status, setStatus] = useState('idle');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    } else if (isAuthenticated && token) {
      fetchBaseResume(token);
    }
  }, [isAuthenticated, authLoading, token, router]);

  const fetchBaseResume = async (authToken: string) => {
    try {
      const resume = await api.getResume(authToken);
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
      await api.updateResume(token, resume);
      setBaseResume(resume);
      setIsEditing(false);
    } catch (error) {
      alert('Invalid JSON or save failed');
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!token || !e.target.files?.[0]) return;
    
    try {
      setIsParsing(true);
      const file = e.target.files[0];
      const parsedResume = await api.parsePdf(token, file);
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
      
      const tailoredResume = await api.tailorResume(token, { raw_text: jdText });
      
      setStatus('generating');
      const pdfBlob = await api.generatePdf(tailoredResume);
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);

      // Save to History
      try {
        await api.saveHistory(token, jdText, tailoredResume);
      } catch (err) {
        console.error('Failed to save to history', err);
      }
      
      setStatus('complete');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  if (authLoading || !isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-cyan-500/30">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Top Navigation */}
      <nav className="bg-black/50 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20">
            <span className="text-xl">R</span>
          </div>
          <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Resume Forge
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/history">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-cyan-400 hover:bg-white/5">
              <FileText className="w-4 h-4 mr-2" /> History
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={logout} className="text-gray-400 hover:text-red-400 hover:bg-white/5">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Left Panel: Resume Preview */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              Your Base Resume
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
                <Button variant="secondary" size="sm" isLoading={isParsing} className="bg-white/10 hover:bg-white/20 text-white border-none">
                  <Upload className="w-4 h-4 mr-2" /> {isParsing ? 'Parsing...' : 'Import PDF'}
                </Button>
              </div>
              <Button 
                variant={isEditing ? "primary" : "outline"} 
                size="sm" 
                onClick={() => setIsEditing(!isEditing)}
                className={isEditing ? "bg-cyan-600 hover:bg-cyan-500" : "border-white/20 text-gray-300 hover:bg-white/10 hover:text-white"}
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
                <Card className="h-[calc(100vh-200px)] flex flex-col bg-black/40 backdrop-blur-md border-white/10">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-200">Edit JSON Data</h3>
                    <Button size="sm" onClick={handleSaveBaseResume} className="bg-green-600 hover:bg-green-500">
                      <Save className="w-4 h-4 mr-2" /> Save Changes
                    </Button>
                  </div>
                  <textarea
                    className="flex-1 w-full p-4 font-mono text-sm bg-black/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-none text-gray-300 custom-scrollbar"
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
                  <Card className="h-full flex flex-col items-center justify-center text-center p-12 border-dashed border-2 border-white/10 bg-white/5">
                    <div className="w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                      <Upload className="w-10 h-10 text-cyan-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">No Resume Found</h3>
                    <p className="text-gray-400 max-w-sm mb-8 text-lg">
                      Upload your existing PDF resume to get started, or paste your resume data manually.
                    </p>
                    <div className="relative group">
                      <input 
                        type="file" 
                        accept=".pdf"
                        onChange={handlePdfUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <Button size="lg" className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-lg shadow-cyan-500/20 text-lg px-8 py-6 h-auto">
                        Upload Resume PDF
                      </Button>
                    </div>
                  </Card>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Panel: Job Description & Tailoring */}
        <div className="lg:col-span-5 space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            Tailor to Job
          </h2>
          
          <Card className="h-fit sticky top-24 bg-black/40 backdrop-blur-md border-white/10">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
                  Paste Job Description
                </label>
                <textarea
                  className="w-full h-64 p-4 text-sm bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-none text-gray-200 placeholder-gray-600 transition-all focus:bg-black/70"
                  placeholder="Paste the full job description here..."
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                />
              </div>

              <Button 
                className="w-full h-16 text-lg font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 shadow-xl shadow-cyan-500/20 transition-all duration-300 transform hover:scale-[1.02]" 
                onClick={handleProcess}
                disabled={!baseResume || !jdText || (status !== 'idle' && status !== 'complete' && status !== 'error')}
              >
                {status === 'idle' && <>Tailor Resume <ChevronRight className="ml-2 w-6 h-6" /></>}
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
                    className="pt-6 border-t border-white/10"
                  >

                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-green-400 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" /> Tailored Resume Ready
                      </h3>
                    </div>
                    <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                        <PdfViewer url={pdfUrl} />
                    </div>
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
