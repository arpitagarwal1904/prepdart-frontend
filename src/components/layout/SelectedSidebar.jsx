// src/components/layout/SelectedSidebar.jsx
import React from "react";
import { X, Trash2, Tag, BookOpen, Layers, Eye, FileText, Save, FileDown } from "lucide-react"; // Added Eye and FileDown
import { Button } from "@/components/ui/button";

export default function SelectedSidebar({ 
  selectedQuestions = [], 
  onRemove, 
  onClearAll,
  onViewQuestion,
  onOpenSummary,
  onOpenSaveModal,
  onOpenGenerateModal,
  paperId,
  paperName
}) {
  return (
    <aside className="w-80 bg-white border-l flex flex-col h-full shrink-0 shadow-sm">
      {paperId && paperName && (
        <div className="px-4 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <FileText className="size-3" />
          Editing: {paperName}
        </div>
      )}
      {/* Header same as your code */}
      <div className="p-4 border-b flex flex-col gap-3 bg-gray-50/50 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-tight">Saved Selection</h2>
            <p className="text-[11px] text-gray-500 font-medium">{selectedQuestions.length} Questions</p>
          </div>
          {selectedQuestions.length > 0 && (
            <Button variant="ghost" size="icon-sm" onClick={onClearAll} className="hover:!text-gray-300 !border-none !bg-gray-600 text-white">
              <Trash2 className="size-4" />
            </Button>
          )}
        </div>
        {/* View Summary Button */}
        {selectedQuestions.length > 0 && (
          <div className="flex flex-col gap-2">
            <Button 
              onClick={onOpenSummary}
              className="w-full !border-none !bg-gray-600 text-white gap-2 h-9 text-xs font-semibold uppercase tracking-wider hover:!text-gray-300"
            >
              <FileText className="size-4" />
              View Summary
            </Button>
            <Button 
                onClick={onOpenSaveModal}
                className="w-full !border-none !bg-gray-600 text-white gap-2 h-9 text-xs font-semibold uppercase tracking-wider hover:!text-gray-300"
              >
                <Save className="size-4" />
                {paperId ? 'Update Paper': 'Save Paper'}
            </Button>
            <Button 
                onClick={onOpenGenerateModal}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-2 h-9 text-xs font-semibold uppercase tracking-wider"
              >
                <FileDown className="size-4" />
                Generate Paper
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50/30">
        {selectedQuestions.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-30 p-6">
            <BookOpen className="size-10 mb-2" />
            <p className="text-sm font-medium">No items saved</p>
          </div>
        ) : (
          selectedQuestions.map((q) => (
            <div key={q.id} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:border-blue-300 transition-all flex flex-col gap-2">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-bold text-gray-700 truncate">
                    {q.displayLabels?.subjectName || "Subject"}
                  </div>
                </div>
                
                <div className="flex gap-1 shrink-0">
                  {/* NEW: View Button */}
                  <Button 
                    variant="ghost" 
                    size="icon-sm" 
                    className="hover:!text-gray-300 !border-none !bg-gray-600 text-white h-7 w-7" 
                    onClick={() => onViewQuestion(q)}
                  >
                    <Eye className="size-3.5" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon-sm" 
                    className="hover:!text-gray-300 !border-none !bg-gray-600 text-white h-7 w-7" 
                    onClick={() => onRemove(q.questionId)}
                  >
                    <X className="size-3.5" />
                  </Button>
                </div>
              </div>

              {/* Rest of metadata view remains same as your code */}
              <div className="space-y-1.5 border-t pt-2">
                <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                  <Layers className="size-3 text-gray-400 shrink-0" />
                  <span className="truncate">{q.displayLabels?.chapterName}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="text-[8px] px-1.5 py-0.5 rounded-full border bg-gray-50 text-gray-600 font-bold uppercase shrink-0">
                    {q.displayLabels?.className}
                  </span>
                  <span className="text-[8px] px-1.5 py-0.5 rounded-full border bg-gray-50 text-gray-600 font-bold uppercase shrink-0">
                    {q.displayLabels?.levelName}
                  </span>
                  <span className="text-[8px] px-1.5 py-0.5 rounded-full border bg-gray-50 text-gray-600 font-bold uppercase shrink-0">
                    {q.displayLabels?.typeName}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}