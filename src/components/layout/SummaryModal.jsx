// src/components/layout/SummaryModal.jsx
import React, { useMemo } from "react";
import { X, BarChart3, BookOpen, Layers, Info, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SummaryModal({ questions, onClose }) {
  // Aggregate all statistics
  const stats = useMemo(() => {
    const chapters = {}; 
    const levels = {};
    const types = {};

    questions.forEach(q => {
      // 1. Chapter Aggregation (The Fix)
      const chp = q.displayLabels?.chapterName || "Uncategorized";
      if (!chapters[chp]) {
        chapters[chp] = { count: 0, meta: new Set() };
      }
      chapters[chp].count += 1;
      
      // Add context chips to the chapter
      if (q.displayLabels?.className) chapters[chp].meta.add(q.displayLabels.className);
      if (q.displayLabels?.subjectName) chapters[chp].meta.add(q.displayLabels.subjectName);
      if (q.displayLabels?.typeName) chapters[chp].meta.add(q.displayLabels.typeName);
      if (q.displayLabels?.levelName) chapters[chp].meta.add(q.displayLabels.levelName);

      // 2. Difficulty Aggregation
      const lvl = q.displayLabels?.levelName || "Normal";
      levels[lvl] = (levels[lvl] || 0) + 1;

      // 3. Type Aggregation
      const typ = q.displayLabels?.typeName || "Other";
      types[typ] = (types[typ] || 0) + 1;
    });

    return { chapters, levels, types };
  }, [questions]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b flex items-center justify-between bg-indigo-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <BarChart3 className="size-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Final Paper Summary</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="size-5 text-gray-400" />
          </Button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-8 overflow-y-auto max-h-[75vh]">
          
          {/* Block 1: Total Stats Hero Card */}
          <div className="bg-indigo-600 rounded-xl p-6 text-white flex items-center justify-between shadow-lg shadow-indigo-200">
            <div>
              <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest mb-1">Total Selected Questions</p>
              <p className="text-5xl font-black">{questions.length}</p>
            </div>
            <BookOpen className="size-16 opacity-20" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Block 2: Detailed Chapter Segregation with Chips */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2 px-1">
                <Layers className="size-3" /> Chapter Segregation
              </h3>
              <div className="space-y-3">
                {Object.entries(stats.chapters).map(([name, data]) => (
                  <div key={name} className="bg-gray-50 border border-gray-200 rounded-xl p-4 transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-sm font-bold text-gray-800">{name}</span>
                      <span className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs font-black shadow-sm shrink-0">
                        {data.count} {data.count === 1 ? 'Ques' : 'Ques'}
                      </span>
                    </div>
                    {/* Metadata Chips Area */}
                    <div className="flex flex-wrap gap-1.5">
                      {Array.from(data.meta).map((chip, idx) => (
                        <span key={idx} className="text-[9px] bg-white border border-gray-200 px-2 py-0.5 rounded-full text-gray-500 font-semibold uppercase shadow-xs">
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Block 3: Difficulty & Type Mix */}
            <div className="space-y-8">
              {/* Question Type List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2 px-1">
                  <HelpCircle className="size-3" /> Question Types
                </h3>
                <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100 overflow-hidden shadow-sm">
                  {Object.entries(stats.types).map(([name, count]) => (
                    <div key={name} className="flex items-center justify-between p-3 text-xs">
                      <span className="font-semibold text-gray-600">{name}</span>
                      <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-md font-bold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Difficulty Progress Bars */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2 px-1">
                  <Info className="size-3" /> Difficulty Analysis
                </h3>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-5">
                  {Object.entries(stats.levels).map(([label, count]) => (
                    <div key={label}>
                      <div className="flex justify-between text-[10px] font-black mb-1.5 uppercase text-gray-500">
                        <span>{label}</span>
                        <span>{count}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-700 ${
                            label.toLowerCase().includes('hard') ? 'bg-red-500' : 
                            label.toLowerCase().includes('medium') ? 'bg-orange-400' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${(count / questions.length) * 100}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t flex justify-end">
          <Button onClick={onClose} className="px-12 font-bold bg-gray-800 text-white">Done</Button>
        </div>
      </div>
    </div>
  );
}