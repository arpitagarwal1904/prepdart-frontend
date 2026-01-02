// src/components/layout/TemplateModal.jsx
import React, { useState, useEffect } from "react";
import { X, Save, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/apiClient";
import toast from "react-hot-toast";

export default function TemplateModal({ isOpen, template, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    header: "",
    footer: "",
    narration: "",
  });
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name || "",
        header: template.header || "",
        footer: template.footer || "",
        narration: template.narration || "",
      });
    } else {
      setFormData({ name: "", header: "", footer: "", narration: "" });
    }
    setLogoFile(null);
  }, [template, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Using FormData for file upload support
    const data = new FormData();
    data.append("name", formData.name);
    data.append("header", formData.header);
    data.append("footer", formData.footer);
    data.append("narration", formData.narration);
    if (logoFile) data.append("logo", logoFile);

    const url = template ? `/templates/save/` : "/templates/save";
    const method = template ? "PUT" : "POST";

    try {
      await apiFetch(url, {
        method,
        body: data, // Note: apiFetch needs to handle FormData without stringifying
      });
      toast.success(template ? "Template updated" : "Template created");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in duration-200">
        <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">{template ? "Edit Template" : "New Template"}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="size-5 text-gray-400" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[80vh]">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Template Name</label>
            <input
              required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Monthly Mock Template"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Header Text</label>
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.header}
                onChange={(e) => setFormData({ ...formData, header: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Footer Text</label>
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.footer}
                onChange={(e) => setFormData({ ...formData, footer: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Logo Upload</label>
            <div className="flex items-center gap-4 border-2 border-dashed rounded-lg p-4 bg-gray-50">
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files[0])}
                  className="text-xs text-gray-500"
                />
              </div>
              <Upload className="size-5 text-gray-400" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Narration</label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none resize-none focus:ring-2 focus:ring-indigo-500"
              rows={2}
              value={formData.narration}
              onChange={(e) => setFormData({ ...formData, narration: e.target.value })}
            />
          </div>

          <div className="pt-2">
            <Button disabled={loading} className="w-full bg-indigo-600 font-bold h-11">
              {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 size-4" />}
              {template ? "Update Template" : "Save Template"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}