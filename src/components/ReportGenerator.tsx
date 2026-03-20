import React, { useRef } from 'react';
import { Defect, UploadedImage } from '../types';
import { FileText, Download, Mail } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ReportGeneratorProps {
  images: UploadedImage[];
  defects: Defect[];
}

export function ReportGenerator({ images, defects }: ReportGeneratorProps) {
  const reportRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    if (!reportRef.current) return;

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('property-defect-report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF report.');
    }
  };

  const handleEmail = () => {
    // In a real app, this would send the PDF via a backend service.
    // For MVP, we'll just show an alert.
    alert('Email functionality is simulated in this MVP. In a production environment, this would send the generated PDF to the provided email address.');
  };

  return (
    <div className="mt-8">
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <button
          onClick={generatePDF}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <Download className="w-5 h-5" />
          Download PDF Report
        </button>
        <button
          onClick={handleEmail}
          className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <Mail className="w-5 h-5" />
          Email Report
        </button>
      </div>

      {/* Hidden report template for PDF generation */}
      <div className="overflow-hidden h-0 w-0 absolute opacity-0 pointer-events-none">
        <div
          ref={reportRef}
          className="bg-white p-10 w-[800px] text-slate-800 font-sans"
        >
          <div className="border-b-2 border-indigo-600 pb-6 mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Property Defect Inspection Report
              </h1>
              <p className="text-slate-500">
                Generated on {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="text-indigo-600">
              <FileText className="w-12 h-12" />
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold border-b border-slate-200 pb-2 mb-4">
              Summary
            </h2>
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-slate-500">Total Images Analyzed</p>
                <p className="text-lg font-bold">{images.length}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Defects Found</p>
                <p className="text-lg font-bold">{defects.length}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold border-b border-slate-200 pb-2 mb-6">
              Detailed Findings
            </h2>
            {defects.length === 0 ? (
              <p className="text-slate-600 italic">No defects were detected during the inspection.</p>
            ) : (
              <div className="space-y-8">
                {defects.map((defect, index) => (
                  <div key={defect.id} className="border border-slate-200 rounded-lg p-6 break-inside-avoid">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-slate-800">
                        {index + 1}. {defect.category}
                      </h3>
                      <span className="px-3 py-1 bg-slate-100 rounded-full text-sm font-medium">
                        Severity: {defect.severity}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-6">
                      <div className="col-span-1">
                        {images[defect.imageIndex] ? (
                          <img
                            src={images[defect.imageIndex].previewUrl}
                            alt={`Defect ${index + 1}`}
                            className="w-full h-auto rounded-md border border-slate-200"
                          />
                        ) : (
                          <div className="w-full aspect-square bg-slate-100 flex items-center justify-center text-slate-400 rounded-md border border-slate-200">
                            No Image
                          </div>
                        )}
                        <p className="text-xs text-slate-500 mt-2 text-center">
                          Image Reference #{defect.imageIndex !== undefined ? defect.imageIndex + 1 : '?'}
                        </p>
                      </div>
                      <div className="col-span-2 space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-700 mb-1">Description</h4>
                          <p className="text-sm text-slate-600">{defect.description}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-slate-700 mb-1">Recommended Action</h4>
                          <p className="text-sm text-slate-600">{defect.recommendedAction}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-slate-700 mb-1">AI Confidence</h4>
                          <p className="text-sm text-slate-600">{defect.confidenceScore}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-12 pt-6 border-t border-slate-200 text-center text-sm text-slate-500">
            <p>This report was automatically generated by AI Property Defect Detector.</p>
            <p>Please verify findings with a certified professional.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
