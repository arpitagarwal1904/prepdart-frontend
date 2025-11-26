// src/components/question/QuestionPreview.jsx
import { MathJax } from 'better-react-mathjax'
import OptionsList from './OptionsList'

export default function QuestionPreview({ question }) {
  if (!question) return <div className="p-6 text-sm text-gray-500">Hover a question to preview it</div>

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center gap-4">
        <div className="text-xs text-gray-600 captalise font-semibold">Question</div>
        <MathJax dynamic>
          <div dangerouslySetInnerHTML={{ __html: question.contentHtml }} />
        </MathJax>
      </div>

      <div className="mb-6">
        <div className="text-xs text-gray-600 font-semibold mb-4">Options</div>
        <OptionsList options={question.options} correct={question.correctOption} />
      </div>
    </div>
  )
}
