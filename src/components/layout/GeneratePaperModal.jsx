// src/components/layout/GeneratePaperModal.jsx
import React, { useState, useEffect } from "react";
import { X, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/apiClient";
import toast from "react-hot-toast";

const BACKEND_URL = import.meta?.env?.VITE_BACKEND_URL || "http://localhost:7777";


export default function GeneratePaperModal({ isOpen, onClose, questionIds }) {
  const [loadingType, setLoadingType] = useState(null); // 'question' | 'answer' | 'solution' | null
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [formData, setFormData] = useState({
    templateId: "",
    questionSeparator: "yes",
    startNumbering: 1
  });

  // Fetch templates on mount
  useEffect(() => {
    if (isOpen) {
      fetchTemplates();
    }
  }, [isOpen]);

  const fetchTemplates = async () => {
    try {
      setLoadingTemplates(true);
      const res = await apiFetch("/templates/list");
      setTemplates(res?.templates || []);
      // Set first template as default if available
      if (res?.templates?.length > 0 && !formData.templateId) {
        setFormData(prev => ({ ...prev, templateId: String(res.templates[0].id) }));
      }
    } catch (err) {
      toast.error("Failed to load templates");
    } finally {
      setLoadingTemplates(false);
    }
  };

  const handleGenerate = async (type) => {
    if (!formData.templateId) {
      toast.error("Please select a template");
      return;
    }
  
    if (!questionIds || questionIds.length === 0) {
      toast.error("No questions selected");
      return;
    }
  
    setLoadingType(type);
  
    // ✅ open window immediately (prevents popup blockers when we await API)
    const newWindow = window.open("", "_blank");
    if (!newWindow) {
      toast.error("Please allow popups to view the generated paper");
      setLoadingType(null);
      return;
    }
  
    try {
      // 1) Create a DB-backed generation first
      const payload = {
        templateId: Number(formData.templateId),
        type: String(type).toUpperCase(), // QUESTION | ANSWER | SOLUTION
        separator: formData.questionSeparator === "yes",
        startNumbering: Number(formData.startNumbering) || 1,
        // IMPORTANT: these are Question.questionId values (your constraint)
        questionIds: questionIds.map(Number),
      };
  
      const res = await apiFetch("/papers/generations", {
        method: "POST",
        body: payload,
      });
  
      const generationId =
        res?.generationId ?? res?.id ?? res?.generation?.id;
  
      if (!generationId) {
        throw new Error("generationId not returned from server");
      }
  
      // 2) Open clean preview URL using generationId
  
      const previewUrl = `${BACKEND_URL}/papers/generations/${generationId}/preview`;
      newWindow.location.href = previewUrl;
  
      toast.success("Paper generated successfully!");
    } catch (err) {
      // close blank tab if generation failed
      try { newWindow.close(); } catch {}
  
      toast.error(`Failed to generate paper: ${err?.message || "Unknown error"}`);
    } finally {
      setLoadingType(null);
    }
  };
  

  const handleStartNumberingChange = (e) => {
    const value = e.target.value;
    // Only allow positive integers
    if (value === "" || (/^\d+$/.test(value) && parseInt(value) > 0)) {
      setFormData({ ...formData, startNumbering: value === "" ? 1 : parseInt(value) });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">Generate Paper</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="size-5 text-gray-400" />
          </Button>
        </div>

        <div className="p-6 space-y-4">
          {/* Template Dropdown */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Template</label>
            {loadingTemplates ? (
              <div className="w-full border rounded-lg px-3 py-2 text-sm flex items-center gap-2">
                <Loader2 className="size-4 animate-spin text-gray-400" />
                <span className="text-gray-400">Loading templates...</span>
              </div>
            ) : templates.length === 0 ? (
              <div className="w-full border rounded-lg px-3 py-2 text-sm text-gray-500 text-center">
                No templates available. Please create a template first.
              </div>
            ) : (
              <select
                required
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.templateId}
                onChange={(e) => setFormData({ ...formData, templateId: e.target.value })}
              >
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Question Separator and Start Numbering Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Question Separator</label>
              <select
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.questionSeparator}
                onChange={(e) => setFormData({ ...formData, questionSeparator: e.target.value })}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Start numbering</label>
              <input
                type="number"
                min="1"
                step="1"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.startNumbering}
                onChange={handleStartNumberingChange}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 space-y-3 border-t">
            <Button
              type="button"
              disabled={loadingType !== null || !formData.templateId}
              onClick={() => handleGenerate("question")}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11"
            >
              {loadingType === "question" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Question Paper
                </>
              )}
            </Button>

            <Button
              type="button"
              disabled={loadingType !== null || !formData.templateId}
              onClick={() => handleGenerate("answer")}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11"
            >
              {loadingType === "answer" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Answer Key
                </>
              )}
            </Button>

            <Button
              type="button"
              disabled={loadingType !== null || !formData.templateId}
              onClick={() => handleGenerate("solution")}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11"
            >
              {loadingType === "solution" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Solution
                </>
              )}
            </Button>

            <Button
              type="button"
              onClick={onClose}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold h-11"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
