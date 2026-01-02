// src/pages/SavedPapers.jsx
import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiClient";
import { FileText, Calendar, Layers, Search, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SavedPapers() {
    const navigate = useNavigate();
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchPapers() {
            try {
                setLoading(true);
                const res = await apiFetch("/papers/list");
                // API returns { status: 1, papers: [...] }
                setPapers(res?.papers || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchPapers();
    }, []);

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50/50">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="size-8 text-indigo-600 animate-spin" />
                    <p className="text-sm font-medium text-gray-500">Loading your papers...</p>
                </div>
            </div>
        );
    }

    const handleViewDetails = (paperId) => {
        // Redirect with query parameter
        navigate(`/?paperId=${paperId}`);
    };

    return (
        <div className="flex-1 flex flex-col bg-gray-50/50 overflow-hidden">
            {/* Header Area */}
            <div className="bg-white border-b px-8 py-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Saved Papers</h1>
                        <p className="text-sm text-gray-500 font-medium">Manage and review your generated test papers</p>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search papers..."
                            className="pl-10 pr-4 py-2 bg-gray-50 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64"
                        />
                    </div>
                </div>
            </div>

            {/* Table Content */}
            <div className="flex-1 overflow-auto p-8">
                <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b">
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Paper Details</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Questions</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Category</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Created Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {papers.length > 0 ? (
                                papers.map((paper) => (
                                    <tr key={paper.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                    <FileText className="size-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">{paper.name}</p>
                                                    <p className="text-xs text-gray-400 truncate max-w-xs">{paper.narration || "No narration provided"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black border border-emerald-100">
                                                <Layers className="size-3" />
                                                {paper.numberOfQuestions}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                                {paper.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <Calendar className="size-3.5" />
                                                <span className="text-xs font-medium">
                                                    {new Date(paper.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button
                                                onClick={() => handleViewDetails(paper.id)}
                                                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center opacity-30">
                                            <FileText className="size-12 mb-2" />
                                            <p className="text-lg font-bold">No saved papers found</p>
                                            <p className="text-sm font-medium">Generate your first paper from the Question Bank</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}