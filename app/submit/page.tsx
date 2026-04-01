'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

const TOPICS = [
  { id: 'algorithms', label: 'Algorithms & DS' },
  { id: 'spring-boot', label: 'Spring Boot' },
  { id: 'oracle', label: 'Oracle DB' },
  { id: 'aws', label: 'AWS Cloud' },
  { id: 'angular', label: 'Angular' },
  { id: 'react', label: 'React' },
  { id: 'kafka', label: 'Kafka' },
  { id: 'java', label: 'Java 21' },
  { id: 'redis', label: 'Redis' },
]

const LEVELS = [
  { id: 'basic', label: 'Basic' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
]

export default function SubmitPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [formData, setFormData] = useState({
    topic: '',
    level: '',
    question: '',
    answer: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const response = await fetch('/api/questions/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: formData.topic,
          text: formData.question,
          level: formData.level,
          answer: formData.answer,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit question')
      }

      setSuccess(true)
      setFormData({ topic: '', level: '', question: '', answer: '' })
      
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } catch (err) {
      setError('Failed to submit question. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#1a1a1a] rounded-sm p-8 border border-white/5 text-center">
          <h2 className="text-2xl font-bold text-white mb-4 font-space-grotesk">
            Authentication Required
          </h2>
          <p className="text-[#adaaaa] mb-6">
            Please sign in to submit questions
          </p>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-3 bg-[#ff8aa7] text-black font-bold rounded-sm hover:brightness-110 transition-all"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] pt-24 pb-12 px-4 md:pl-64">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2 font-space-grotesk">
            Submit Question
          </h1>
          <p className="text-[#adaaaa] font-manrope">
            Contribute to the interview question bank
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-sm">
            <p className="text-green-400 font-manrope">
              ✓ Question submitted successfully! Redirecting...
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-sm">
            <p className="text-red-400 font-manrope">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Topic Selection */}
          <div>
            <label className="block text-white font-bold mb-2 font-space-grotesk">
              Topic *
            </label>
            <select
              required
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-sm px-4 py-3 text-white font-manrope focus:border-[#ff8aa7] focus:outline-none transition-colors"
            >
              <option value="">Select a topic</option>
              {TOPICS.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.label}
                </option>
              ))}
            </select>
          </div>

          {/* Level Selection */}
          <div>
            <label className="block text-white font-bold mb-2 font-space-grotesk">
              Difficulty Level *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {LEVELS.map((level) => (
                <button
                  key={level.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, level: level.id })}
                  className={`py-3 px-4 rounded-sm font-bold font-manrope transition-all ${
                    formData.level === level.id
                      ? 'bg-[#ff8aa7] text-black'
                      : 'bg-[#1a1a1a] text-[#adaaaa] border border-white/10 hover:border-[#ff8aa7]'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Question */}
          <div>
            <label className="block text-white font-bold mb-2 font-space-grotesk">
              Question *
            </label>
            <textarea
              required
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="Enter your interview question..."
              rows={3}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-sm px-4 py-3 text-white font-manrope focus:border-[#ff8aa7] focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Answer */}
          <div>
            <label className="block text-white font-bold mb-2 font-space-grotesk">
              Answer *
            </label>
            <textarea
              required
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              placeholder="Provide a detailed answer..."
              rows={10}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-sm px-4 py-3 text-white font-manrope focus:border-[#ff8aa7] focus:outline-none transition-colors resize-none"
            />
            <p className="text-xs text-[#adaaaa] mt-2 font-manrope">
              Tip: Use \n for line breaks in your answer
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-4 bg-gradient-to-r from-[#ff8aa7] to-[#ff6c95] text-black font-bold rounded-sm hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,138,167,0.3)] disabled:opacity-50 disabled:cursor-not-allowed font-space-grotesk"
            >
              {submitting ? 'Submitting...' : 'Submit Question'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="px-8 py-4 bg-[#1a1a1a] text-[#adaaaa] font-bold rounded-sm border border-white/10 hover:border-[#ff8aa7] hover:text-white transition-all font-space-grotesk"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
