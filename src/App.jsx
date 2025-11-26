// src/App.jsx
import { useState } from 'react'
import { MathJaxContext } from 'better-react-mathjax'
import Sidebar from '@/components/layout/Sidebar'
import QuestionPreview from '@/components/question/QuestionPreview'
import SolutionPanel from '@/components/question/SolutionPanel'
import useQuestions from '@/hooks/useQuestions'

const config = { /* your MathJax config */ }

export default function App() {
  const { items, loading } = useQuestions({ classId: 2, subjectId: 2, chapterId: 13 })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [hoveredQuestion, setHoveredQuestion] = useState(null)
  const [selectedIds, setSelectedIds] = useState([]);

  const current = hoveredQuestion ?? items?.[selectedIndex] ?? null

  return (
    <MathJaxContext version={3} config={config}>
      {/* IMPORTANT: overflow-hidden stops body scrolling and keeps the app fixed to viewport */}
      <div className="h-screen flex overflow-hidden">
        {/* Sidebar: fixed width, internal scroll */}
        <aside className="w-64 bg-gray-50 border-r overflow-auto p-2 flex-shrink-0">
          <Sidebar
            items={items}
            selectedIds={selectedIds}  
            onHoverQuestion={(q) => setHoveredQuestion(q)}
            onSelect={(ids) => setSelectedIds(ids)}
          />
        </aside>

        {/* Main: takes remaining space and scrolls internally */}
        <main className="flex-1 p-4 overflow-auto flex justify-center">
          {/* Fixed width content centered */}
          <div className="w-[800px] space-y-6">

            {/* Question + Options */}
            <div className="bg-white rounded shadow p-4" style={{ maxHeight: 500, overflow: 'auto' }}>
                <QuestionPreview question={current} />
            </div>

            {/* Solution at bottom */}
            <div className="bg-white rounded shadow p-4" style={{ maxHeight: 300, overflow: 'auto' }}>
              <SolutionPanel solution={current?.solutionHtml} />
            </div>

          </div>
        </main>
      </div>
    </MathJaxContext>
  )
}
