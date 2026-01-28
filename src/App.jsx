import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Download, 
  Settings, 
  CheckCircle2, 
  PenLine, 
  ChevronDown,
  History,
  Type
} from 'lucide-react';

const App = () => {
  const [effectiveDate, setEffectiveDate] = useState(new Date().toLocaleDateString());
  const [clientName, setClientName] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [signature, setSignature] = useState(null);
  const [isSigning, setIsSigning] = useState(false);
  const canvasRef = useRef(null);

  // Initial Sections based on Arcodic Policy
  const [sections, setSections] = useState([
    {
      id: 1,
      title: "Introduction and Purpose",
      content: "ARCODIC (\"we\", \"us\", \"our\") is committed to protecting the privacy and personal information of our clients, website visitors, and business partners worldwide. This Privacy Policy explains how we collect, use, store, and protect personal information in accordance with applicable data protection laws, including POPIA (South Africa) and GDPR (EU).",
      points: []
    },
    {
      id: 2,
      title: "Information We Collect",
      content: "We may collect the following categories of information to provide high-quality digital services:",
      points: [
        "Personal Information (Full name, Email, Phone, Billing details)",
        "Technical Information (IP address, Browser type, Device info)",
        "Communication Data (Project-related emails, support requests)"
      ]
    },
    {
      id: 3,
      title: "How We Use Information",
      content: "We use personal information solely for legitimate business purposes:",
      points: [
        "Providing and managing our services",
        "Preparing proposals, contracts, and invoices",
        "Complying with legal and regulatory obligations"
      ]
    },
    {
      id: 4,
      title: "Data Security Measures",
      content: "We implement rigorous technical and organizational measures to protect personal information, including encrypted communications and strict access controls.",
      points: []
    }
  ]);

  // Section Management
  const addSection = () => {
    const newId = sections.length > 0 ? Math.max(...sections.map(s => s.id)) + 1 : 1;
    setSections([...sections, { id: newId, title: "New Section", content: "Enter content here...", points: [] }]);
  };

  const removeSection = (id) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const updateSection = (id, field, value) => {
    setSections(sections.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const addPoint = (sectionId) => {
    setSections(sections.map(s => {
      if (s.id === sectionId) {
        return { ...s, points: [...s.points, "New detail point"] };
      }
      return s;
    }));
  };

  const removePoint = (sectionId, pointIndex) => {
    setSections(sections.map(s => {
      if (s.id === sectionId) {
        const newPoints = [...s.points];
        newPoints.splice(pointIndex, 1);
        return { ...s, points: newPoints };
      }
      return s;
    }));
  };

  const updatePoint = (sectionId, pointIndex, value) => {
    setSections(sections.map(s => {
      if (s.id === sectionId) {
        const newPoints = [...s.points];
        newPoints[pointIndex] = value;
        return { ...s, points: newPoints };
      }
      return s;
    }));
  };

  // Signature Logic
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsSigning(true);
  };

  const draw = (e) => {
    if (!isSigning) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsSigning(false);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      setSignature(canvas.toDataURL());
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setSignature(null);
    }
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      window.print();
      setIsExporting(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans selection:bg-blue-100">
      {/* Navigation Bar */}
      <nav className={`sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 px-6 py-4 flex items-center justify-between transition-all ${isExporting ? 'hidden' : ''}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
            <Settings className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="font-semibold text-lg tracking-tight">ARCODIC</h1>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">Policy Architect</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={addSection}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 hover:border-black transition-all text-sm font-medium"
          >
            <Plus size={16} /> Add Section
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-6 py-2 rounded-full bg-black text-white hover:bg-gray-800 transition-all text-sm font-medium shadow-lg shadow-black/10"
          >
            <Download size={16} /> Generate PDF
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-[850px] mx-auto py-12 px-8">
        <div className={`bg-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-[2.5rem] overflow-hidden transition-all border border-white ${isExporting ? 'shadow-none border-none p-0' : 'p-16'}`}>
          
          {/* Header Section */}
          <header className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 rounded-full bg-gray-100 text-[10px] font-bold tracking-[0.2em] text-gray-500 mb-6 uppercase">
              Legal Document
            </div>
            <h1 className="text-5xl font-bold tracking-tight mb-4 text-black">Privacy Policy</h1>
            <p className="text-gray-400 text-lg font-medium">ARCODIC - Web Development & Digital Services</p>
            
            <div className="mt-8 flex flex-col items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Effective Date:</span>
                <input 
                  type="text" 
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                  className={`text-sm border-b border-gray-100 focus:border-black outline-none transition-colors font-medium text-center ${isExporting ? 'border-none' : ''}`}
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Prepared For:</span>
                <input 
                  type="text" 
                  placeholder="Enter Client Name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className={`text-sm border-b border-gray-100 focus:border-black outline-none transition-colors font-medium text-center italic ${isExporting ? 'border-none' : ''}`}
                />
              </div>
            </div>
          </header>

          {/* Dynamic Content Sections */}
          <div className="space-y-12">
            {sections.map((section, idx) => (
              <section key={section.id} className="relative group">
                {!isExporting && (
                  <button 
                    onClick={() => removeSection(section.id)}
                    className="absolute -left-12 top-0 p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
                
                <div className="flex items-start gap-6">
                  <span className="text-2xl font-light text-gray-200 tabular-nums">0{idx + 1}</span>
                  <div className="flex-1">
                    <input 
                      type="text"
                      value={section.title}
                      onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                      className={`w-full text-xl font-bold mb-4 outline-none border-l-2 border-transparent focus:border-black pl-2 transition-all ${isExporting ? 'border-none p-0' : ''}`}
                    />
                    <textarea 
                      value={section.content}
                      onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                      rows={3}
                      className={`w-full text-[#424245] leading-relaxed outline-none resize-none focus:bg-gray-50 p-2 rounded-lg transition-all ${isExporting ? 'p-0 bg-transparent' : ''}`}
                    />
                    
                    {/* Bullet Points */}
                    <div className="mt-4 space-y-2">
                      {section.points.map((point, pIdx) => (
                        <div key={pIdx} className="flex items-center gap-3 group/point pl-4 border-l border-gray-100">
                          <div className="w-1 h-1 rounded-full bg-black flex-shrink-0" />
                          <input 
                            type="text"
                            value={point}
                            onChange={(e) => updatePoint(section.id, pIdx, e.target.value)}
                            className={`flex-1 text-sm text-[#6E6E73] outline-none transition-all ${isExporting ? 'border-none' : 'focus:text-black'}`}
                          />
                          {!isExporting && (
                            <button 
                              onClick={() => removePoint(section.id, pIdx)}
                              className="opacity-0 group-hover/point:opacity-100 text-gray-300 hover:text-red-500 transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                      {!isExporting && (
                        <button 
                          onClick={() => addPoint(section.id)}
                          className="text-[10px] uppercase tracking-widest font-bold text-blue-500 hover:text-blue-600 transition-all mt-2 ml-4 flex items-center gap-1"
                        >
                          <Plus size={10} /> Add Detail
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>

          {/* Footer Information */}
          <footer className="mt-20 pt-12 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-12">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Contact Information</h3>
                <p className="text-sm font-medium text-black">ARCODIC HQ</p>
                <p className="text-sm text-gray-500 mt-1 italic underline">arcodichq@gmail.com</p>
              </div>
              
              {/* Signature Area */}
              <div className="relative">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Digital Authorization</h3>
                {!signature ? (
                  <div className={`border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 p-4 transition-all ${isExporting ? 'hidden' : 'hover:border-black/20'}`}>
                    <canvas 
                      ref={canvasRef}
                      width={300}
                      height={120}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      className="cursor-crosshair w-full h-[120px]"
                    />
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-[10px] text-gray-400 font-medium italic">Sign inside the box</span>
                      <div className="flex gap-2">
                        <button onClick={clearSignature} className="text-[10px] font-bold uppercase text-gray-400 hover:text-red-500">Clear</button>
                        <button onClick={saveSignature} className="text-[10px] font-bold uppercase text-blue-500 hover:text-blue-700">Accept</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative group">
                    <img src={signature} alt="Signature" className="h-16 object-contain" />
                    <div className="h-[1px] bg-black w-full mt-2" />
                    <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-tighter">Verified Digitally • {new Date().toLocaleDateString()}</p>
                    {!isExporting && (
                      <button 
                        onClick={() => setSignature(null)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                )}
                {isExporting && !signature && (
                   <div className="h-24 border-b border-black flex items-end pb-2">
                     <span className="text-xs text-gray-400 italic">Signature required</span>
                   </div>
                )}
              </div>
            </div>
          </footer>
        </div>

        {/* Global Action Tips */}
        {!isExporting && (
          <div className="mt-12 flex items-center justify-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
            <span className="flex items-center gap-2"><Type size={14} /> Auto-Saving</span>
            <span className="flex items-center gap-2"><History size={14} /> Version 1.0</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={14} /> Compliance Ready</span>
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background-color: white !important; }
          .min-h-screen { background-color: white !important; padding: 0 !important; }
          main { margin: 0 !important; max-width: 100% !important; padding: 0 !important; }
          button, nav { display: none !important; }
          textarea { height: auto !important; }
          @page { margin: 2cm; }
        }
      `}} />
    </div>
  );
};

export default App;
