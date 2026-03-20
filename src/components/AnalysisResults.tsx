import React from 'react';
import { Defect, UploadedImage } from '../types';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { cn } from './ImageUploader';

interface AnalysisResultsProps {
  images: UploadedImage[];
  defects: Defect[];
}

export function AnalysisResults({ images, defects }: AnalysisResultsProps) {
  if (defects.length === 0) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 flex flex-col items-center text-center">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-emerald-800">No Defects Found</h3>
        <p className="text-emerald-600 mt-1">
          The AI analysis did not detect any issues in the uploaded images.
        </p>
      </div>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Medium':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Low':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">
          Detected Defects ({defects.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {defects.map((defect) => {
          const image = images[defect.imageIndex];
          return (
            <div
              key={defect.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col"
            >
              <div className="relative h-48 bg-slate-100 border-b border-slate-200">
                {image ? (
                  <img
                    src={image.previewUrl}
                    alt={`Defect in image ${defect.imageIndex + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    Image not found
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span
                    className={cn(
                      'px-2.5 py-1 rounded-md text-xs font-semibold border shadow-sm backdrop-blur-md',
                      getSeverityColor(defect.severity)
                    )}
                  >
                    {defect.severity} Severity
                  </span>
                </div>
                <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-md font-mono backdrop-blur-md">
                  Img #{defect.imageIndex !== undefined ? defect.imageIndex + 1 : '?'}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-800 text-lg">
                    {defect.category}
                  </h3>
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                    {defect.confidenceScore}% Match
                  </span>
                </div>
                <p className="text-slate-600 text-sm mb-4 flex-1">
                  {defect.description}
                </p>

                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 mt-auto">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
                        Recommended Action
                      </span>
                      <p className="text-sm text-slate-600">
                        {defect.recommendedAction}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
