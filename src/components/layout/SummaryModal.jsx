// src/components/layout/SummaryModal.jsx
import React, { useMemo } from "react";
import { X, BarChart3, BookOpen, Layers, Info, HelpCircle, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SummaryModal({ questions, onClose }) {
  // Aggregate all statistics
  const stats = useMemo(() => {
    const subjects = {}; // Main Group: Subject
    const levels = {};
    const types = {};

    questions.forEach(q => {
      // 1. Group by Subject and Sub-group by Topic
      const subName = q.displayLabels?.subjectName || "Uncategorized Subject";
      const topicName = q.displayLabels?.topicName || q.displayLabels?.chapterName || "General Topic";

      if (!subjects[subName]) {
        subjects[subName] = { total: 0, topics: {} };
      }
      subjects[subName].total += 1;

      if (!subjects[subName].topics[topicName]) {
        subjects[subName].topics[topicName] = { count: 0, meta: new Set() };
      }
      subjects[subName].topics[topicName].count += 1;
      
      // Add context chips to the topic metadata
      if (q.displayLabels?.className) subjects[subName].topics[topicName].meta.add(q.displayLabels.className);
      if (q.displayLabels?.typeName) subjects[subName].topics[topicName].meta.add(q.displayLabels.typeName);
      if (q.displayLabels?.levelName) subjects[subName].topics[topicName].meta.add(q.displayLabels.levelName);

      // 2. Difficulty Aggregation
      const lvl = q.displayLabels?.levelName || "Normal";
      levels[lvl] = (levels[lvl] || 0) + 1;

      // 3. Type Aggregation
      const typ = q.displayLabels?.typeName || "Other";
      types[typ] = (types[typ] || 0) + 1;
    });

    return { subjects, levels, types };
  }, [questions]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
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
          
          {/* Total Stats Hero Card */}
          <div className="bg-indigo-600 rounded-xl p-6 text-white flex items-center justify-between shadow-lg shadow-indigo-200">
            <div>
              <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest mb-1">Total Selected Questions</p>
              <p className="text-5xl font-black">{questions.length}</p>
            </div>
            <BookOpen className="size-16 opacity-20" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Subject and Topic Segregation */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2 px-1">
                <Layers className="size-3" /> Subject & Topic Distribution
              </h3>
              
              <div className="space-y-6">
                {Object.entries(stats.subjects).map(([subject, subData]) => (
                  <div key={subject} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                    {/* Subject Header */}
                    <div className="bg-gray-50 px-5 py-3 border-b flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="size-4 text-indigo-600" />
                        <span className="font-black text-gray-800 uppercase tracking-tight text-sm">{subject}</span>
                      </div>
                      <span className="text-[10px] font-black bg-white border px-2 py-0.5 rounded-full text-indigo-600">
                        {subData.total} Total
                      </span>
                    </div>

                    {/* Topics Sub-group */}
                    <div className="p-4 space-y-3 bg-white">
                      {Object.entries(subData.topics).map(([topic, data]) => (
                        <div key={topic} className="bg-white border border-gray-100 rounded-xl p-3 hover:bg-gray-50/50 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-gray-700">{topic}</span>
                            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-black">
                              {data.count} Qs
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {Array.from(data.meta).map((chip, idx) => (
                              <span key={idx} className="text-[8px] bg-white border border-gray-200 px-1.5 py-0.5 rounded-full text-gray-400 font-bold uppercase">
                                {chip}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Difficulty & Type Mix */}
            <div className="space-y-8">
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
      </div>
    </div>
  );
}