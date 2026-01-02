// src/components/layout/SavePaperModal.jsx
import React, { useState } from "react";
import { X, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/apiClient";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function SavePaperModal({ isOpen, onClose, questionIds, onSuccess }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "", // Changed to free text
    date: new Date().toISOString().split('T')[0], // yyyy-mm-dd
    narration: ""
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      ...formData,
      questionIds: questionIds
    };

    try {
      await apiFetch("/papers/save", {
        method: "POST",
        body: payload,
      });
      
      // 1. Show Success Toast
      toast.success("Paper saved successfully!");
      
      // 2. Call parent success logic (like clearing selection)
      onSuccess?.(); 
      
      // 3. Close modal and Redirect
      onClose();
      navigate("/papers"); 
      
    } catch (err) {
      // 1. Show Failure Toast
      toast.error(`Failed to save: ${err.message}`);
      // Note: loading is set to false in finally, so modal stays open for retry
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">Save Test Paper</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="size-5 text-gray-400" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Paper Name</label>
            <input
              required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g. JEE Mock 2026"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. Physics, Mock"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Date</label>
              <input
                type="date"
                className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Narration</label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              rows={3}
              placeholder="Add some notes about this selection..."
              value={formData.narration}
              onChange={(e) => setFormData({ ...formData, narration: e.target.value })}
            />
          </div>

          <div className="pt-2">
            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Selection...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Paper ({questionIds.length} Qs)
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}