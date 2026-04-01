'use client'

import { useState, useEffect, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PendingQuestion {
  id: string
  topic: string
  text: string
  level: 'basic' | 'intermediate' | 'advanced'
  answer: string
  submittedBy: string
  submittedAt: string
  status: 'pending' | 'approved' | 'rejected'
}

const TOPICS = [
  { id: 'spring-boot', label: 'Spring Boot', color: '#6DB33F', icon: '☕' },
  { id: 'oracle', label: 'Oracle DB', color: '#F80000', icon: '🗄️' },
  { id: 'aws', label: 'AWS Cloud', color: '#FF9900', icon: '☁️' },
  { id: 'angular', label: 'Angular', color: '#DD0031', icon: '🅰️' },
  { id: 'kafka', label: 'Kafka', color: '#231F20', icon: '📨' },
  { id: 'java', label: 'Java 21', color: '#007396', icon: '☕' }
] as const

const LEVEL_COLORS = {
  basic: { 
    bg: 'bg-[#81ecff]/10', 
    text: 'text-[#81ecff]', 
    border: 'border-[#81ecff]',
    label: 'BEGINNER'
  },
  intermediate: { 
    bg: 'bg-[#feb300]/10', 
    text: 'text-[#feb300]', 
    border: 'border-[#feb300]',
    label: 'INTERMEDIATE'
  },
  advanced: { 
    bg: 'bg-[#ff8aa7]/10', 
    text: 'text-[#ff8aa7]', 
    border: 'border-[#ff8aa7]',
    label: 'ADVANCED'
  }
} as const

// Mock data - replace with API call
const MOCK_PENDING: PendingQuestion[] = []

export default function AdminPage() {
  const [questions, setQuestions] = useState<PendingQuestion[]>([])
  const [selectedTopic, setSelectedTopic] = useState<string>('all')
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  const [previewQuestion, setPreviewQuestion] = useState<PendingQuestion | null>(null)
  const [loading, setLoading] = useState(true)

  // Load pending questions from API
  useEffect(() => {
    loadPendingQuestions()
  }, [])

  const loadPendingQuestions = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/pending')
      const data = await res.json()
      // Ensure data is array
      if (Array.isArray(data)) {
        setQuestions(data)
      } else if (data.success === false) {
        console.error('API error:', data.message)
        setQuestions([])
      } else {
        setQuestions([])
      }
    } catch (error) {
      console.error('Error loading pending questions:', error)
      setQuestions([])
    } finally {
      setLoading(false)
    }
  }

  const filteredQuestions = questions.filter(q => {
    if (selectedTopic !== 'all' && q.topic !== selectedTopic) return false
    if (selectedLevel !== 'all' && q.level !== selectedLevel) return false
    return q.status === 'pending'
  })

  const handleApprove = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/admin/questions/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      const data = await res.json()
      
      if (res.ok && data.success) {
        setQuestions(prev => prev.filter(q => q.id !== id))
        setPreviewQuestion(null)
      } else {
        console.error('Failed to approve:', data.error)
      }
    } catch (error) {
      console.error('Error approving question:', error)
    }
  }, [])

  const handleReject = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/admin/questions/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      const data = await res.json()
      
      if (res.ok && data.success) {
        setQuestions(prev => prev.filter(q => q.id !== id))
        setPreviewQuestion(null)
      } else {
        console.error('Failed to reject:', data.error)
      }
    } catch (error) {
      console.error('Error rejecting question:', error)
    }
  }, [])

  const handlePreview = useCallback((question: PendingQuestion) => {
    setPreviewQuestion(question)
  }, [])

  return (
    <div className="md:pl-64 pt-16 min-h-screen bg-[#0e0e0e] text-[#adaaaa]">
      <div className="max-w-7xl mx-auto p-4 sm:p-8">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl font-space-grotesk font-bold text-white tracking-tighter mb-2">
            Review Queue
          </h1>
          <p className="text-[#adaaaa] font-manrope">
            {filteredQuestions.length} technical questions awaiting moderation from User submissions and AI generation.
          </p>
        </header>

        {/* Filters */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Topic Filter */}
          <div className="relative group">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#adaaaa] text-lg pointer-events-none">
              📁
            </span>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full bg-[#1a1a1a] border-none focus:ring-1 focus:ring-[#ff8aa7]/40 text-sm py-3 pl-10 pr-4 rounded-sm text-[#adaaaa] appearance-none cursor-pointer font-manrope"
            >
              <option value="all">Topic: All</option>
              {TOPICS.map(topic => (
                <option key={topic.id} value={topic.id}>
                  {topic.label}
                </option>
              ))}
            </select>
          </div>

          {/* Level Filter */}
          <div className="relative group">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#adaaaa] text-lg pointer-events-none">
              📊
            </span>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full bg-[#1a1a1a] border-none focus:ring-1 focus:ring-[#ff8aa7]/40 text-sm py-3 pl-10 pr-4 rounded-sm text-[#adaaaa] appearance-none cursor-pointer font-manrope"
            >
              <option value="all">Level: All</option>
              <option value="basic">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-center justify-end">
            <button 
              onClick={() => {
                setSelectedTopic('all')
                setSelectedLevel('all')
              }}
              className="flex items-center gap-2 text-xs font-inter uppercase tracking-widest text-[#ff8aa7] hover:text-[#ff6c95] transition-colors group"
            >
              Clear Filters
              <span className="text-sm group-hover:rotate-90 transition-transform">✕</span>
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-16 h-16 border-4 border-[#ff8aa7] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl font-bold font-space-grotesk text-[#adaaaa]">
                No pending questions
              </p>
              <p className="text-sm text-[#adaaaa] mt-2">
                All questions have been reviewed
              </p>
            </div>
          ) : (
            filteredQuestions.map((question, index) => (
              <QuestionCard
                key={question.id}
                question={question}
                index={index}
                onApprove={handleApprove}
                onReject={handleReject}
                onPreview={handlePreview}
              />
            ))
          )}
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewQuestion && (
          <PreviewModal
            question={previewQuestion}
            onClose={() => setPreviewQuestion(null)}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

const QuestionCard = memo(({ question, index, onApprove, onReject, onPreview }: {
  question: PendingQuestion
  index: number
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onPreview: (question: PendingQuestion) => void
}) => {
  const levelColors = LEVEL_COLORS[question.level]
  const topic = TOPICS.find(t => t.id === question.topic)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-[#1a1a1a] p-6 border-l-2 border-[#ff8aa7] relative group"
    >
      {/* Technical Glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${levelColors.border.replace('border-', '')}10 0%, transparent 70%)`
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{topic?.icon}</span>
            <div>
              <h3 className="text-lg font-bold font-space-grotesk text-white">
                {question.text}
              </h3>
              <p className="text-xs text-[#adaaaa] font-inter mt-1">
                Submitted by {question.submittedBy} • {new Date(question.submittedAt).toLocaleString()}
              </p>
            </div>
          </div>
          <span className={`${levelColors.bg} ${levelColors.text} text-[10px] font-bold font-inter px-2 py-1 rounded-sm tracking-widest uppercase shrink-0`}>
            {levelColors.label}
          </span>
        </div>

        {/* Answer Preview */}
        <div className="bg-[#20201f] p-4 rounded-sm mb-4">
          <p className="text-sm text-[#adaaaa] font-manrope line-clamp-2">
            {question.answer}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => onPreview(question)}
            className="flex-1 px-4 py-2 bg-[#20201f] text-white font-bold font-space-grotesk uppercase tracking-wider text-sm rounded-sm hover:bg-[#2c2c2c] transition-all"
          >
            Preview
          </button>
          <button
            onClick={() => onApprove(question.id)}
            className="flex-1 px-4 py-2 bg-[#81ecff]/10 text-[#81ecff] font-bold font-space-grotesk uppercase tracking-wider text-sm rounded-sm hover:bg-[#81ecff]/20 transition-all"
          >
            ✓ Approve
          </button>
          <button
            onClick={() => onReject(question.id)}
            className="flex-1 px-4 py-2 bg-[#ff8aa7]/10 text-[#ff8aa7] font-bold font-space-grotesk uppercase tracking-wider text-sm rounded-sm hover:bg-[#ff8aa7]/20 transition-all"
          >
            ✗ Reject
          </button>
        </div>
      </div>
    </motion.div>
  )
})

QuestionCard.displayName = 'QuestionCard'

const PreviewModal = memo(({ question, onClose, onApprove, onReject }: {
  question: PendingQuestion
  onClose: () => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
}) => {
  const levelColors = LEVEL_COLORS[question.level]
  const topic = TOPICS.find(t => t.id === question.topic)

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-3xl bg-[#1a1a1a] rounded-sm z-50 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{topic?.icon}</span>
            <div>
              <h2 className="text-2xl font-black font-space-grotesk text-white uppercase">
                Preview Question
              </h2>
              <p className="text-xs text-[#adaaaa] font-inter uppercase tracking-widest mt-1">
                {topic?.label} • {levelColors.label}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-[#20201f] rounded-sm hover:bg-[#2c2c2c] transition-all text-white text-xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Question */}
            <div>
              <label className="block text-xs font-bold font-inter uppercase tracking-widest text-[#adaaaa] mb-2">
                Question
              </label>
              <p className="text-xl font-bold font-space-grotesk text-white">
                {question.text}
              </p>
            </div>

            {/* Answer */}
            <div>
              <label className="block text-xs font-bold font-inter uppercase tracking-widest text-[#adaaaa] mb-2">
                Answer
              </label>
              <div className="bg-[#20201f] p-4 rounded-sm">
                <p className="text-base text-white font-manrope leading-relaxed">
                  {question.answer}
                </p>
              </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold font-inter uppercase tracking-widest text-[#adaaaa] mb-2">
                  Submitted By
                </label>
                <p className="text-sm text-white font-manrope">{question.submittedBy}</p>
              </div>
              <div>
                <label className="block text-xs font-bold font-inter uppercase tracking-widest text-[#adaaaa] mb-2">
                  Submitted At
                </label>
                <p className="text-sm text-white font-manrope">
                  {new Date(question.submittedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-white/5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-[#20201f] text-white font-bold font-space-grotesk uppercase tracking-wider text-sm rounded-sm hover:bg-[#2c2c2c] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => onReject(question.id)}
            className="flex-1 px-6 py-3 bg-[#ff8aa7]/10 text-[#ff8aa7] font-bold font-space-grotesk uppercase tracking-wider text-sm rounded-sm hover:bg-[#ff8aa7]/20 transition-all"
          >
            ✗ Reject
          </button>
          <button
            onClick={() => onApprove(question.id)}
            className="flex-1 px-6 py-3 bg-[#81ecff] text-black font-bold font-space-grotesk uppercase tracking-wider text-sm rounded-sm hover:bg-[#81ecff]/90 transition-all shadow-[0_0_20px_rgba(129,236,255,0.3)]"
          >
            ✓ Approve
          </button>
        </div>
      </motion.div>
    </>
  )
})

PreviewModal.displayName = 'PreviewModal'
