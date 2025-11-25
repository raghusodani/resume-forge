'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  url: string;
}

export const PdfViewer = ({ url }: PdfViewerProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [loading, setLoading] = useState(true);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  return (
    <div className="flex flex-col items-center bg-gray-100/50 rounded-xl border border-gray-200 overflow-hidden">
      {/* Toolbar */}
      <div className="w-full bg-white border-b border-gray-200 p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-600 font-medium">
            Page {pageNumber} of {numPages || '--'}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
            disabled={pageNumber >= numPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setScale(s => Math.max(s - 0.1, 0.5))}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-600 w-12 text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button variant="ghost" size="sm" onClick={() => setScale(s => Math.min(s + 0.1, 2.0))}>
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>

        <a href={url} download="Resume.pdf">
          <Button size="sm" variant="outline">
            <Download className="w-4 h-4 mr-2" /> Download
          </Button>
        </a>
      </div>

      {/* Viewer Area */}
      <div className="relative w-full overflow-auto flex justify-center p-8 min-h-[500px] bg-slate-50/50">
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center h-64 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          }
          error={
            <div className="flex items-center justify-center h-64 text-red-400">
              Failed to load PDF
            </div>
          }
          className="shadow-2xl"
        >
          <Page 
            pageNumber={pageNumber} 
            scale={scale} 
            renderTextLayer={false} 
            renderAnnotationLayer={false}
            className="shadow-xl"
          />
        </Document>
      </div>
    </div>
  );
};
