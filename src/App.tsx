import React, { useState } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisResults } from './components/AnalysisResults';
import { ReportGenerator } from './components/ReportGenerator';
import { UploadedImage, Defect } from './types';
import { analyzeImages } from './services/geminiService';
import { Building2, Loader2, Search, ArrowRight } from 'lucide-react';

export default function App() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [defects, setDefects] = useState<Defect[] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (images.length === 0) return;

    setIsAnalyzing(true);
    setError(null);
    setDefects(null);

    try {
      const results = await analyzeImages(images);
      
      // Add unique IDs to the results
      const defectsWithIds = results.map((d) => ({
        ...d,
        id: Math.random().toString(36).substring(7),
      }));
      
      setDefects(defectsWithIds);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setImages([]);
    setDefects(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-2 rounded-lg shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              AI Property Defect Detector
            </h1>
          </div>
          {defects !== null && (
            <button
              onClick={resetAnalysis}
              className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
            >
              Start New Inspection
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="space-y-10">
          
          {/* Step 1: Upload */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold">1</span>
                Upload Property Images
              </h2>
              <p className="text-slate-500 text-sm mt-1 ml-8">
                Upload clear photos of the property. The AI will analyze them for common defects like cracks, leaks, and damage.
              </p>
            </div>
            
            <ImageUploader images={images} onImagesChange={setImages} />

            {images.length > 0 && defects === null && (
              <div className="mt-8 flex justify-end border-t border-slate-100 pt-6">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-3 px-8 rounded-xl flex items-center gap-2 transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing Images...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Analyze {images.length} {images.length === 1 ? 'Image' : 'Images'}
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                <p className="font-semibold mb-1">Analysis Failed</p>
                <p>{error}</p>
              </div>
            )}
          </section>

          {/* Step 2 & 3: Results & Report */}
          {defects !== null && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold">2</span>
                    Inspection Results
                  </h2>
                  <p className="text-slate-500 text-sm mt-1 ml-8">
                    Review the detected defects. The AI has categorized and assessed the severity of each issue.
                  </p>
                </div>
                
                <AnalysisResults images={images} defects={defects} />
              </section>

              <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
                <div className="mb-2">
                  <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold">3</span>
                    Generate Report
                  </h2>
                  <p className="text-slate-500 text-sm mt-1 ml-8">
                    Download a comprehensive PDF report or send it directly to your client.
                  </p>
                </div>
                
                <ReportGenerator images={images} defects={defects} />
              </section>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} AI Property Defect Detector. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
