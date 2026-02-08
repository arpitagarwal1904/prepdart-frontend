// src/pages/QuestionBank.jsx
import React, { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import SelectedSidebar from "@/components/layout/SelectedSidebar";
import QuestionPreview from "@/components/question/QuestionPreview";
import SolutionPanel from "@/components/question/SolutionPanel";
import FiltersBar from "@/components/layout/FiltersBar";
import SummaryModal from "@/components/layout/SummaryModal";
import QuestionModal from "@/components/question/QuestionModal";
import SavePaperModal from "@/components/layout/SavePaperModal";
import GeneratePaperModal from "@/components/layout/GeneratePaperModal";
import useQuestions from "@/hooks/useQuestions";
import useMetadata from "@/hooks/useMetaData";
import { apiFetch } from "@/lib/apiClient";
import toast from "react-hot-toast";

export default function QuestionBank() {
    const [searchParams] = useSearchParams();
    const paperId = searchParams.get("paperId");
    const hasFetchedPaper = useRef(false);

    const { data: metadata, loading: metaLoading } = useMetadata();
    const [filters, setFilters] = useState(null);
    const { items, loading: questionsLoading } = useQuestions(filters);

    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [hoveredQuestion, setHoveredQuestion] = useState(null);
    const [viewingQuestion, setViewingQuestion] = useState(null);
    const [isSummaryOpen, setIsSummaryOpen] = useState(false);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

    // Sync left sidebar highlights using questionId
    const selectedIdsSet = useMemo(() => 
        new Set(selectedQuestions.map(q => q.questionId)), 
        [selectedQuestions]
    );

    const current = hoveredQuestion ?? items?.[0] ?? null;

    const selectedQuestionIds = useMemo(() =>
        selectedQuestions.map(q => q.questionId),
        [selectedQuestions]
    );

    /**
     * Helper to enrich question objects with display labels
     */
    const enrichQuestion = (q, meta, currentFilters) => {
        const cls = meta.classes?.find(c => Number(c.id) === Number(q.classId || currentFilters?.classId));
        const sub = cls?.subjects?.find(s => Number(s.id) === Number(q.subjectId || currentFilters?.subjectId));
        const chp = sub?.chapters?.find(ch => Number(ch.id) === Number(q.chapterId || currentFilters?.chapterId));

        return {
            ...q,
            displayLabels: {
                className: cls?.label || "N/A",
                subjectName: sub?.label || "N/A",
                chapterName: chp?.label || chp?.title || "No Chapter",
                levelName: meta.questionLevels?.find(l => Number(l.id) === Number(q.level || currentFilters?.questionLevelId))?.label || "Normal",
                typeName: meta.questionTypes?.find(t => Number(t.id) === Number(q.type || currentFilters?.questionTypeId))?.label || "MCQ",
            }
        };
    };

    /**
     * LOGIC 1: FETCH SAVED PAPER (Once)
     * Now populates selectedQuestions directly from the response objects
     */
    useEffect(() => {
        if (!paperId || hasFetchedPaper.current || !metadata) return;

        async function fetchPaperDetails() {
            hasFetchedPaper.current = true;
            try {
                const res = await apiFetch(`/papers/${paperId}`);
                if (res.status === 1 && res.paper?.questions) {
                    // Directly map the questions from API response to our selected state
                    const preLoaded = res.paper.questions.map(q => enrichQuestion(q, metadata, null));
                    setSelectedQuestions(preLoaded);
                }
            } catch (err) {
                toast.error("Failed to load paper context");
            }
        }
        fetchPaperDetails();
    }, [paperId, metadata]);

    /**
     * LOGIC 2: Initial Filters setup
     */
    useEffect(() => {
        if (!metadata || filters) return;
        const c = metadata.classes?.[0];
        if (!c) return;
        
        setFilters({
            classId: Number(c.id),
            subjectId: Number(c.subjects?.[0]?.id),
            chapterId: Number(c.subjects?.[0]?.chapters?.[0]?.id),
            questionLevelId: Number(metadata.questionLevels?.[0]?.id),
            questionTypeId: Number(metadata.questionTypes?.[0]?.id),
            removeUsedQuestions: true,
        });
    }, [metadata, filters]);

    /**
     * LOGIC 3: Manual Selection Handler
     */
    const handleToggleSelection = (newIdList) => {
        setSelectedQuestions(prev => {
            if (newIdList.length > prev.length) {
                // Find which questionId was just added in the sidebar
                const addedId = newIdList.find(id => !prev.some(q => q.questionId === id));
                const q = items.find(item => item.questionId === addedId);

                if (q && metadata) {
                    const enriched = enrichQuestion(q, metadata, filters);
                    return [...prev, enriched];
                }
                return prev;
            }
            // Remove based on questionId
            return prev.filter(q => newIdList.includes(q.questionId));
        });
    };

    return (
        <div className="flex flex-col flex-1 overflow-hidden">
            <div className="bg-white border-b shrink-0 px-4">
                <FiltersBar metadata={metadata} loading={metaLoading} onSubmit={setFilters} />
            </div>

            <div className="flex flex-1 overflow-hidden">
                <aside className="w-64 bg-white border-r overflow-y-auto p-3 shrink-0">
                    <Sidebar
                        items={items}
                        onSelect={handleToggleSelection}
                        selectedIds={Array.from(selectedIdsSet)}
                        onHoverQuestion={setHoveredQuestion}
                    />
                </aside>

                <main className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                            {questionsLoading ? (
                                <div className="p-12 text-center text-gray-400 italic">Updating results...</div>
                            ) : (
                                <QuestionPreview question={current} />
                            )}
                        </div>
                        {current?.solutionHtml && (
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                                <SolutionPanel solution={current.solutionHtml} />
                            </div>
                        )}
                    </div>
                </main>

                <SelectedSidebar
                    selectedQuestions={selectedQuestions}
                    onRemove={(id) => setSelectedQuestions(p => p.filter(q => q.questionId !== id))}
                    onClearAll={() => setSelectedQuestions([])}
                    onViewQuestion={setViewingQuestion}
                    onOpenSummary={() => setIsSummaryOpen(true)}
                    onOpenSaveModal={() => setIsSaveModalOpen(true)}
                    onOpenGenerateModal={() => setIsGenerateModalOpen(true)}
                />
            </div>

            {isSaveModalOpen && (
                <SavePaperModal
                    isOpen={isSaveModalOpen}
                    onClose={() => setIsSaveModalOpen(false)}
                    questionIds={selectedQuestionIds}
                    onSuccess={() => {
                        toast.success("Changes saved successfully!");
                        setSelectedQuestions([]);
                    }}
                />
            )}

            {isGenerateModalOpen && (
                <GeneratePaperModal
                    isOpen={isGenerateModalOpen}
                    onClose={() => setIsGenerateModalOpen(false)}
                    questionIds={selectedQuestionIds}
                />
            )}

            {isSummaryOpen && <SummaryModal questions={selectedQuestions} onClose={() => setIsSummaryOpen(false)} />}
            {viewingQuestion && <QuestionModal question={viewingQuestion} onClose={() => setViewingQuestion(null)} />}
        </div>
    );
}