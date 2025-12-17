// src/pages/QuestionBank.jsx
import React, { useState, useMemo, useRef, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import SelectedSidebar from "@/components/layout/SelectedSidebar";
import QuestionPreview from "@/components/question/QuestionPreview";
import SolutionPanel from "@/components/question/SolutionPanel";
import FiltersBar from "@/components/layout/FiltersBar";
import SummaryModal from "@/components/layout/SummaryModal";
import QuestionModal from "@/components/question/QuestionModal";
import useQuestions from "@/hooks/useQuestions";
import useMetadata from "@/hooks/useMetaData";

export default function QuestionBank() {
    const { data: metadata, loading: metaLoading } = useMetadata();
    const [filters, setFilters] = useState(null);
    const { items, loading: questionsLoading } = useQuestions(filters);

    // STATE IS NOW LOCAL: Resets on route change
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [hoveredQuestion, setHoveredQuestion] = useState(null);
    const [viewingQuestion, setViewingQuestion] = useState(null);
    const [isSummaryOpen, setIsSummaryOpen] = useState(false);

    const selectedIdsSet = useMemo(() => new Set(selectedQuestions.map(q => q.id)), [selectedQuestions]);
    const current = hoveredQuestion ?? items?.[0] ?? null;

    // Set initial filters on load
    useEffect(() => {
        if (!metadata || filters) return;
        const c = metadata.classes?.[0];
        if (!c) return;
        const defaults = {
            classId: Number(c.id),
            subjectId: Number(c.subjects?.[0]?.id),
            chapterId: Number(c.subjects?.[0]?.chapters?.[0]?.id),
            questionLevelId: Number(metadata.questionLevels?.[0]?.id),
            questionTypeId: Number(metadata.questionTypes?.[0]?.id),
            removeUsedQuestions: true,
        };
        setFilters(defaults);
    }, [metadata, filters]);


    const handleToggleSelection = (newIdList) => {
        setSelectedQuestions(prev => {
            if (newIdList.length > prev.length) {
                const addedId = newIdList.find(id => !prev.some(q => q.id === id));
                const q = items.find(item => item.id === addedId);

                if (q && metadata) {
                    // Correct metadata lookup using the .label property
                    const cls = metadata.classes?.find(c => Number(c.id) === Number(filters.classId));
                    const sub = cls?.subjects?.find(s => Number(s.id) === Number(filters.subjectId));
                    const chp = sub?.chapters?.find(ch => Number(ch.id) === Number(filters.chapterId));

                    const enriched = {
                        ...q,
                        displayLabels: {
                            className: cls?.label || "N/A",
                            subjectName: sub?.label || "N/A",
                            chapterName: chp?.label || chp?.title || "No Chapter",
                            levelName: metadata.questionLevels?.find(l => Number(l.id) === Number(filters.questionLevelId))?.label,
                            typeName: metadata.questionTypes?.find(t => Number(t.id) === Number(filters.questionTypeId))?.label,
                        }
                    };
                    return [...prev, enriched];
                }
                return prev;
            }
            return prev.filter(q => newIdList.includes(q.id));
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
                        selectedIds={selectedIdsSet}
                        onHoverQuestion={setHoveredQuestion}
                    />
                </aside>

                <main className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div className="bg-white rounded-xl shadow-sm p-6 border">
                            <QuestionPreview question={current} />
                        </div>
                        {current?.solutionHtml && (
                            <div className="bg-white rounded-xl shadow-sm p-6 border">
                                <SolutionPanel solution={current.solutionHtml} />
                            </div>
                        )}
                    </div>
                </main>

                <SelectedSidebar
                    selectedQuestions={selectedQuestions}
                    onRemove={(id) => setSelectedQuestions(p => p.filter(q => q.id !== id))}
                    onClearAll={() => setSelectedQuestions([])}
                    onViewQuestion={setViewingQuestion}
                    onOpenSummary={() => setIsSummaryOpen(true)}
                />
            </div>

            {isSummaryOpen && <SummaryModal questions={selectedQuestions} onClose={() => setIsSummaryOpen(false)} />}
            {viewingQuestion && <QuestionModal question={viewingQuestion} onClose={() => setViewingQuestion(null)} />}
        </div>
    );
}