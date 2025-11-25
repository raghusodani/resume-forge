'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Loader } from '@/components/ui/Loader';
import { PdfViewer } from '@/components/resume/PdfViewer';
import { ArrowLeft, Calendar, FileText, Download, Eye, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function HistoryPage() {
  const { token, logout, isAuthenticated, isLoading: authLoading } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResume, setSelectedResume] = useState<any | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    } else if (isAuthenticated && token) {
      fetchHistory(token);
    }
  }, [isAuthenticated, authLoading, token, router]);

  const fetchHistory = async (authToken: string) => {
    try {
      const data = await apiClient.getHistory(authToken);
      // Sort by newest first
      setHistory(data.reverse());
    } catch (error) {
      console.error('Failed to fetch history', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewResume = async (item: any) => {
    if (!token) return;
    setSelectedResume(item);
    setGeneratingPdf(true);
    setPdfUrl(null);

    try {
      const blob = await apiClient.generatePdf(item.content);
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error('Failed to generate PDF', error);
      alert('Failed to generate PDF');
    } finally {
      setGeneratingPdf(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20">
              <span className="text-xl">R</span>
            </div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Resume Forge
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-cyan-400 hover:bg-white/5">
              Dashboard
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={logout} className="text-gray-400 hover:text-red-400 hover:bg-white/5">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/5">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Resume History
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* List */}
            <div className="lg:col-span-4 space-y-4 h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
              {history.length === 0 ? (
                <Card className="p-8 text-center text-gray-400 border-white/10 bg-white/5">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No tailored resumes yet.</p>
                  <Link href="/dashboard" className="text-cyan-400 hover:text-cyan-300 hover:underline mt-2 block">
                    Create your first one!
                  </Link>
                </Card>
              ) : (
                history.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleViewResume(item)}
                    className={`cursor-pointer transition-all ${selectedResume?.id === item.id ? 'ring-2 ring-cyan-500' : ''}`}
                  >
                    <Card className={`p-4 transition-all border-white/10 ${selectedResume?.id === item.id ? 'bg-cyan-500/10' : 'bg-white/5 hover:bg-white/10'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Calendar className="w-3 h-3" />
                          {formatDate(item.created_at)}
                        </div>
                        {selectedResume?.id === item.id && (
                          <span className="bg-cyan-500/20 text-cyan-300 text-xs px-2 py-0.5 rounded-full font-medium border border-cyan-500/30">
                            Viewing
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-200 line-clamp-2 mb-2">
                        {item.job_description.slice(0, 100)}...
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="bg-white/10 px-2 py-1 rounded">
                          {item.content.skills.length} Skills
                        </span>
                        <span className="bg-white/10 px-2 py-1 rounded">
                          {item.content.experience.length} Exp Items
                        </span>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>

            {/* Preview */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                {selectedResume ? (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Card className="p-6 h-[calc(100vh-200px)] flex flex-col bg-black/40 backdrop-blur-md border-white/10">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h2 className="text-xl font-bold text-white">Resume Preview</h2>
                          <p className="text-sm text-gray-400">
                            Generated on {formatDate(selectedResume.created_at)}
                          </p>
                        </div>
                        {pdfUrl && (
                          <a href={pdfUrl} download={`Resume_${selectedResume.id}.pdf`}>
                            <Button className="bg-cyan-600 hover:bg-cyan-500">
                              <Download className="w-4 h-4 mr-2" /> Download PDF
                            </Button>
                          </a>
                        )}
                      </div>

                      <div className="flex-1 bg-black/50 rounded-lg overflow-hidden relative border border-white/10">
                        {generatingPdf ? (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
                            <div className="text-center">
                              <Loader />
                              <p className="mt-2 text-gray-400">Generating PDF...</p>
                            </div>
                          </div>
                        ) : pdfUrl ? (
                          <div className="h-full overflow-auto custom-scrollbar">
                            <PdfViewer url={pdfUrl} />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-500">
                            Select a resume to view
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500 border-2 border-dashed border-white/10 rounded-xl bg-white/5">
                    <div className="text-center">
                      <Eye className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      <p>Select a resume from the history to view details</p>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
