// src/components/question/SolutionPanel.jsx
import { MathJax } from 'better-react-mathjax'

export default function SolutionPanel({ solution }) {
  if (!solution) return <div className="p-6 text-sm text-gray-500">Solution will appear here</div>
  return (
    <div className="p-4">
      <div className="text-sm font-semibold text-gray-700 mb-2">Solution</div>
      <MathJax dynamic>
        <div dangerouslySetInnerHTML={{ __html: solution || '<em>No solution provided</em>' }} />
      </MathJax>
    </div>
  )
}
