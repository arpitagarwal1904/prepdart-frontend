// src/hooks/useQuestions.js
import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/apiClient'

export default function useQuestions({ classId=2, subjectId=2, chapterId=13, questionLevel = 1, questionType=1, removeUsedQuestions=true} = {}) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true); setError(null)
      try {
        const qs = `?classId=${classId}&subjectId=${subjectId}&chapterId=${chapterId}&question_level_dd=${questionLevel}&question_type_dd=${questionType}&remove_used_questions=${removeUsedQuestions}`
        const res = await apiFetch(`/questions/retrieve${qs}`)
        if (!cancelled) {
          setItems(res.items || [])
          setTotal(res.total || (res.items || []).length)
        }
      } catch (e) {
        if (!cancelled) setError(e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [classId, subjectId, chapterId, questionLevel, questionType, removeUsedQuestions])

  return { items, loading, error, total, setItems }
}
