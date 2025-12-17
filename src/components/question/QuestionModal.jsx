// src/components/question/QuestionModal.jsx
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import QuestionPreview from "./QuestionPreview";
import SolutionPanel from "./SolutionPanel";

export default function QuestionModal({ question, onClose }) {
  if (!question) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Question Detail</h2>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              {question.displayLabels?.className} • {question.displayLabels?.subjectName}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="size-5" />
          </Button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <QuestionPreview question={question} />
          </div>
          
          {question.solutionHtml && (
            <div className="bg-blue-50/30 border border-blue-100 rounded-lg p-6">
              <h3 className="text-sm font-bold text-blue-800 uppercase mb-4 tracking-tight">Step-by-Step Solution</h3>
              <SolutionPanel solution={question.solutionHtml} />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
          <Button onClick={onClose}>Close Preview</Button>
        </div>
      </div>
    </div>
  );
}