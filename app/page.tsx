'use client'

import { useState, useEffect, useCallback, useMemo, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'

interface Question {
  id: number
  text: string
  level: 'basic' | 'intermediate' | 'advanced'
  answer: string
}

// Hoist static data outside component (rendering-hoist-jsx)
const TOPICS = [
  { id: 'algorithms', label: 'Algorithms & DS', color: '#9B59B6', icon: '🧮' },
  { id: 'spring-boot', label: 'Spring Boot', color: '#6DB33F', icon: '☕' },
  { id: 'oracle', label: 'Oracle DB', color: '#F80000', icon: '🗄️' },
  { id: 'aws', label: 'AWS Cloud', color: '#FF9900', icon: '☁️' },
  { id: 'angular', label: 'Angular', color: '#DD0031', icon: '🅰️' },
  { id: 'react', label: 'React', color: '#61DAFB', icon: '⚛️' },
  { id: 'kafka', label: 'Kafka', color: '#231F20', icon: '📨' },
  { id: 'java', label: 'Java 21', color: '#007396', icon: '☕' },
  { id: 'redis', label: 'Redis', color: '#DC382D', icon: '⚡' }
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

export default function Home() {
  const [currentTopic, setCurrentTopic] = useState('spring-boot')
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [openAnswers, setOpenAnswers] = useState<Set<number>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const PAGE_SIZE = 25

  const loadQuestions = useCallback(async (topic: string, page: number = 1) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/questions/${topic}?page=${page}&pageSize=${PAGE_SIZE}`)
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const data = await res.json()
      // Handle both old format (array) and new format (object with data/pagination)
      if (Array.isArray(data)) {
        setQuestions(data)
      } else {
        setQuestions(data.data || [])
      }
    } catch (error) {
      console.error('Error loading questions:', error)
      setQuestions([])
    } finally {
      setLoading(false)
    }
  }, [])

  // No need for client-side pagination anymore - API handles it
  const paginatedQuestions = questions
  const totalPages = Math.ceil(questions.length > 0 ? 30 / PAGE_SIZE : 1) // Will be replaced with API response

  useEffect(() => {
    loadQuestions(currentTopic, currentPage)
  }, [currentTopic, currentPage, loadQuestions])

  // Use functional setState (rerender-functional-setstate)
  const toggleAnswer = useCallback((id: number) => {
    setOpenAnswers(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }, [])

  const handleTopicChange = useCallback((topicId: string) => {
    setCurrentTopic(topicId)
    setCurrentPage(1) // Reset to page 1 when changing topics
  }, [])

  // Memoize current topic data (rerender-memo)
  const currentTopicData = useMemo(
    () => TOPICS.find(t => t.id === currentTopic),
    [currentTopic]
  )

  return (
    <div className="md:pl-64 pt-16 min-h-screen bg-[#0e0e0e]">
      {/* Topic Tabs - Mobile/Desktop */}
      <div className="sticky top-16 z-30 bg-[#0e0e0e] border-b border-white/5 px-4 sm:px-8 py-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => handleTopicChange(topic.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm font-manrope font-medium text-sm whitespace-nowrap transition-all ${
                currentTopic === topic.id
                  ? 'bg-[#ff8aa7]/10 text-[#ff8aa7] border border-[#ff8aa7]'
                  : 'bg-[#1a1a1a] text-[#adaaaa] hover:text-white hover:bg-[#20201f]'
              }`}
            >
              <span className="text-lg">{topic.icon}</span>
              {topic.label}
            </button>
          ))}
        </div>
      </div>

      <main className="p-4 sm:p-8">
        {/* Header Section */}
        <section className="mb-8 sm:mb-12">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-space-grotesk tracking-tighter text-white mb-2 uppercase">
                {currentTopicData?.label || 'Questions'}
              </h2>
              <p className="text-[#adaaaa] max-w-2xl font-manrope text-sm sm:text-base">
                Refine your technical expertise with curated interview challenges. Focus on core mechanics and best practices.
              </p>
            </div>
          </div>
        </section>

        {/* Questions List */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="inline-block w-16 h-16 border-4 border-[#ff8aa7] border-t-transparent rounded-full animate-spin" />
            </motion.div>
          ) : (
            <motion.div
              key="questions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-2"
            >
              {paginatedQuestions.map((q, i) => {
                const levelColors = LEVEL_COLORS[q.level] || LEVEL_COLORS.basic
                const isOpen = openAnswers.has(q.id)
                
                return (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    index={i}
                    levelColors={levelColors}
                    isOpen={isOpen}
                    onToggle={toggleAnswer}
                  />
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-[#1a1a1a] text-[#adaaaa] rounded-sm hover:bg-[#2c2c2c] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-manrope"
            >
              ← Previous
            </button>
            
            <div className="flex items-center gap-2">
              <span className="text-[#adaaaa] font-manrope text-sm">
                Page {currentPage} of {totalPages}
              </span>
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-[#1a1a1a] text-[#adaaaa] rounded-sm hover:bg-[#2c2c2c] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-manrope"
            >
              Next →
            </button>
          </div>
        )}

        {/* CTA Section */}
        {!loading && questions.length > 0 && <CTASection />}
      </main>
    </div>
  )
}

// Extract memoized components (rerender-memo)
const QuestionCard = memo(({ question, index, levelColors, isOpen, onToggle }: {
  question: Question
  index: number
  levelColors: typeof LEVEL_COLORS[keyof typeof LEVEL_COLORS]
  isOpen: boolean
  onToggle: (id: number) => void
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      onClick={() => onToggle(question.id)}
      className={`group relative bg-[#1a1a1a] hover:bg-[#2c2c2c]/60 hover:backdrop-blur-xl transition-all duration-300 border-l-2 ${levelColors.border} p-4 sm:p-6 cursor-pointer`}
    >
      {/* Technical Glow on hover */}
      {isOpen && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${levelColors.border.replace('border-', '')}10 0%, transparent 70%)`
          }}
        />
      )}
      
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <span className={`font-space-grotesk ${levelColors.text} font-black text-sm tracking-tighter`}>
                Q_{String(question.id).padStart(2, '0')}
              </span>
              <span className={`${levelColors.bg} ${levelColors.text} text-[10px] font-bold font-inter px-2 py-0.5 rounded-sm tracking-widest uppercase`}>
                {levelColors.label}
              </span>
            </div>
            <h3 className={`text-lg sm:text-xl font-bold font-space-grotesk mb-1 group-hover:${levelColors.text} transition-colors text-white`}>
              {question.text}
            </h3>
          </div>
          
          <button className={`w-10 h-10 flex items-center justify-center bg-[#20201f] rounded-sm group-hover:${levelColors.bg} group-hover:${levelColors.text} transition-all shrink-0`}>
            <span className="text-xl">{isOpen ? '−' : '+'}</span>
          </button>
        </div>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 bg-[#20201f] -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 rounded-sm border-t border-white/5">
                <div className="font-manrope text-sm sm:text-base text-[#adaaaa] leading-relaxed">
                  <strong className={`${levelColors.text} font-inter tracking-wide`}>Answer:</strong>
                  <div className="mt-2 text-white/90 prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown
                      components={{
                        p: ({node, ...props}) => <p className="mb-3" {...props} />,
                        strong: ({node, ...props}) => <strong className="text-[#ff8aa7] font-bold" {...props} />,
                        code: ({node, inline, ...props}: any) => 
                          inline ? 
                            <code className="bg-[#1a1a1a] px-1.5 py-0.5 rounded text-[#81ecff] font-mono text-xs" {...props} /> :
                            <code className="block bg-[#1a1a1a] p-3 rounded my-2 overflow-x-auto font-mono text-xs" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc list-inside mb-3 space-y-1" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-3 space-y-1" {...props} />,
                        li: ({node, ...props}) => <li className="ml-2" {...props} />,
                      }}
                    >
                      {question.answer.replace(/\\n/g, '\n')}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
})

QuestionCard.displayName = 'QuestionCard'

// Extract CTA section (rendering-hoist-jsx)
const CTASection = memo(() => (
  <section className="mt-16 bg-[#1a1a1a] p-8 sm:p-12 rounded-sm relative overflow-hidden">
    <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#ff8aa7]/10 to-transparent"></div>
    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
      <div>
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black font-space-grotesk tracking-tighter mb-4 uppercase text-white">
          Ready for the drill?
        </h3>
        <p className="text-[#adaaaa] font-manrope text-base sm:text-lg">
          Practice these questions under real interview conditions.
        </p>
      </div>
      <button className="px-8 sm:px-10 py-3 sm:py-4 bg-[#ff8aa7] text-black font-bold font-space-grotesk uppercase tracking-widest text-sm sm:text-lg rounded-sm hover:translate-y-[-2px] transition-transform active:scale-95 shadow-[0_0_20px_rgba(255,138,167,0.2)]">
        Start Session
      </button>
    </div>
  </section>
))

CTASection.displayName = 'CTASection'
