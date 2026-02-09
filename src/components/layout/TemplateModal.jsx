import React, { useState, useEffect } from "react";
import { X, Save, Loader2, Upload, ImageIcon } from "lucide-react";
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
  const [previewUrl, setPreviewUrl] = useState(null); // Used for autopopulating the UI

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name || "",
        header: template.header || "",
        footer: template.footer || "",
        narration: template.narration || "",
      });
      // Show existing logo if available
      setPreviewUrl(template.logoUrl || null);
    } else {
      setFormData({ name: "", header: "", footer: "", narration: "" });
      setPreviewUrl(null);
    }
    setLogoFile(null);
  }, [template, isOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      // Create a local URL to show the user what they just picked
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("header", formData.header);
    data.append("footer", formData.footer);
    data.append("narration", formData.narration);
    
    // API expects "image" key for the file
    if (logoFile) {
      data.append("logo", logoFile);
    }

    if(template) {
      data.append("id", template.id)
    } 

    // Append ID to URL if updating
    const url = "/templates/save";
    const method = "POST";

    try {
      await apiFetch(url, {
        method,
        body: data, 
      });
      toast.success(template ? "Template updated" : "Template created");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in duration-200">
        <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">
            {template ? "Edit Template" : "New Template"}
          </h2>
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

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Logo Management</label>
            <div className="flex items-center gap-4 p-4 border rounded-xl bg-gray-50/50">
              {/* Visual Preview Box */}
              <div className="size-16 rounded-lg border bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                {previewUrl ? (
                  <img src={previewUrl} alt="Logo Preview" className="size-full object-contain" />
                ) : (
                  <ImageIcon className="size-6 text-gray-300" />
                )}
              </div>
              
              <div className="flex-1 space-y-2">
                <p className="text-[10px] text-gray-400 font-medium leading-tight">
                  {template && !logoFile ? "Existing logo loaded. Click upload to replace." : "Upload JPG/PNG (Max 2MB)"}
                </p>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <Button type="button" variant="outline" size="sm" className="w-full text-xs gap-2 pointer-events-none">
                    <Upload className="size-3" /> {logoFile ? "Change Image" : "Upload Logo"}
                  </Button>
                </div>
              </div>
            </div>
            {logoFile && <p className="text-[10px] text-indigo-600 font-bold italic truncate">Selected: {logoFile.name}</p>}
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
            <Button disabled={loading} className="w-full !border-none !bg-gray-600 text-white gap-2 h-9 text-xs font-semibold uppercase tracking-wider hover:!text-gray-300">
              {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 size-4" />}
              {template ? "Update Template" : "Save Template"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}