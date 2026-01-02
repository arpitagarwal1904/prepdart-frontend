// src/pages/Templates.jsx
import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiClient";
import { Plus, Layout, Edit2, Trash2, Search, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import TemplateModal from "@/components/layout/TemplateModal";

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState({ isOpen: false, template: null });

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/templates/list");
      setTemplates(res?.templates || []);
    } catch (err) {
      toast.error("Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this template?")) return;
    try {
      await apiFetch(`/templates/${id}`, { method: "DELETE" });
      toast.success("Template deleted");
      fetchTemplates();
    } catch (err) {
      toast.error("Delete failed: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50/50 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Paper Templates</h1>
            <p className="text-sm text-gray-500 font-medium">Customize headers, footers, and logos for your papers</p>
          </div>
          <Button 
            onClick={() => setModalData({ isOpen: true, template: null })}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
          >
            <Plus className="mr-2 size-4" /> Create New
          </Button>
        </div>
      </div>

      {/* List Table */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Template Name</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Header/Footer Preview</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Logo</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {templates.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                        <Layout className="size-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{t.name}</p>
                        <p className="text-xs text-gray-400 truncate max-w-xs">{t.narration}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-xs space-y-1">
                      <p><span className="font-bold text-gray-500">H:</span> {t.header}</p>
                      <p><span className="font-bold text-gray-500">F:</span> {t.footer}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    {t.logoUrl ? (
                      <img src={t.logoUrl} alt="Logo" className="size-10 object-contain mx-auto border rounded p-1 bg-white" />
                    ) : (
                      <ImageIcon className="size-6 text-gray-300 mx-auto" />
                    )}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" size="icon" 
                        onClick={() => setModalData({ isOpen: true, template: t })}
                        className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                      >
                        <Edit2 className="size-4" />
                      </Button>
                      <Button 
                        variant="ghost" size="icon"
                        onClick={() => handleDelete(t.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <TemplateModal 
        isOpen={modalData.isOpen} 
        template={modalData.template} 
        onClose={() => setModalData({ isOpen: false, template: null })}
        onSuccess={fetchTemplates}
      />
    </div>
  );
}