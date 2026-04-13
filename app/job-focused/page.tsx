'use client'

import { useState, useEffect } from 'react'

interface Question {
  id: number
  question: string
  answer: string
  topic: string
  difficulty?: string
}

interface JobRequirement {
  title: string
  topics: string[]
  description: string
}

const JOB_REQUIREMENTS: JobRequirement[] = [
  {
    title: 'Java & Spring Framework',
    topics: ['spring-boot', 'java', 'java21'],
    description: '3+ years experience with Spring Boot, Spring Security, Spring Data'
  },
  {
    title: 'API Design & Security',
    topics: ['spring-boot', 'java'],
    description: 'OpenAPI, OAuth2, JWT, RESTful APIs'
  },
  {
    title: 'Database Systems',
    topics: ['oracle'],
    description: 'Oracle, PostgreSQL, SQL optimization'
  },
  {
    title: 'Frontend Development',
    topics: ['angular', 'react'],
    description: 'Angular, modern web frameworks'
  },
  {
    title: 'Cloud & DevOps',
    topics: ['aws'],
    description: 'AWS, OpenShift, CI/CD pipelines'
  },
  {
    title: 'Microservices & Messaging',
    topics: ['kafka', 'redis'],
    description: 'Kafka, Redis, distributed systems'
  }
]

export default function JobFocusedPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRequirement, setSelectedRequirement] = useState<string | null>(null)
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null)

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/questions')
      const data = await response.json()
      setQuestions(data.questions || [])
    } catch (error) {
      console.error('Failed to fetch questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getQuestionsByRequirement = (requirement: JobRequirement) => {
    return questions.filter(q => 
      requirement.topics.some(topic => 
        q.topic.toLowerCase().includes(topic.toLowerCase())
      )
    )
  }

  const getTotalQuestions = () => {
    const allTopics = JOB_REQUIREMENTS.flatMap(r => r.topics)
    return questions.filter(q => 
      allTopics.some(topic => 
        q.topic.toLowerCase().includes(topic.toLowerCase())
      )
    ).length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] text-white pt-16 md:pl-64">
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff8aa7] mx-auto mb-4"></div>
            <p className="text-[#adaaaa]">Loading questions...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white pt-16 md:pl-64">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black font-space-grotesk text-[#ff8aa7] mb-4 uppercase">
            Job-Focused Interview Prep
          </h1>
          <p className="text-[#adaaaa] text-lg mb-6">
            Full Stack Java Engineer @ mesoneer - Questions organized by job requirements
          </p>
          <div className="flex items-center gap-4 text-sm">
            <div className="px-4 py-2 bg-[#ff8aa7]/10 border border-[#ff8aa7] rounded-sm">
              <span className="text-[#ff8aa7] font-bold">{getTotalQuestions()}</span>
              <span className="text-[#adaaaa] ml-2">Total Questions</span>
            </div>
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-sm">
              <span className="text-white font-bold">{JOB_REQUIREMENTS.length}</span>
              <span className="text-[#adaaaa] ml-2">Requirements</span>
            </div>
          </div>
        </div>

        {/* Job Requirements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {JOB_REQUIREMENTS.map((requirement, index) => {
            const reqQuestions = getQuestionsByRequirement(requirement)
            const isSelected = selectedRequirement === requirement.title
            
            return (
              <button
                key={index}
                onClick={() => setSelectedRequirement(isSelected ? null : requirement.title)}
                className={`p-6 rounded-sm border transition-all text-left ${
                  isSelected
                    ? 'bg-[#ff8aa7]/10 border-[#ff8aa7]'
                    : 'bg-[#1a1a1a] border-white/10 hover:border-[#ff8aa7]/50'
                }`}
              >
                <h3 className="text-xl font-bold font-space-grotesk text-white mb-2">
                  {requirement.title}
                </h3>
                <p className="text-sm text-[#adaaaa] mb-4">
                  {requirement.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {requirement.topics.map((topic, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-white/5 border border-white/10 rounded-sm text-xs text-[#adaaaa]"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                  <span className="text-2xl font-bold text-[#ff8aa7]">
                    {reqQuestions.length}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Questions List */}
        {selectedRequirement && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-space-grotesk text-white mb-6">
              {selectedRequirement} Questions
            </h2>
            {getQuestionsByRequirement(
              JOB_REQUIREMENTS.find(r => r.title === selectedRequirement)!
            ).map((question) => (
              <div
                key={question.id}
                className="bg-[#1a1a1a] border border-white/10 rounded-sm overflow-hidden hover:border-[#ff8aa7]/50 transition-all"
              >
                <button
                  onClick={() => setExpandedQuestion(expandedQuestion === question.id ? null : question.id)}
                  className="w-full p-6 text-left flex items-start justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2 py-1 bg-[#ff8aa7]/10 border border-[#ff8aa7] rounded-sm text-xs text-[#ff8aa7] font-bold">
                        {question.topic}
                      </span>
                      {question.difficulty && (
                        <span className="px-2 py-1 bg-white/5 border border-white/10 rounded-sm text-xs text-[#adaaaa]">
                          {question.difficulty}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white font-space-grotesk">
                      {question.question}
                    </h3>
                  </div>
                  <span className="text-2xl text-[#adaaaa]">
                    {expandedQuestion === question.id ? '−' : '+'}
                  </span>
                </button>
                
                {expandedQuestion === question.id && (
                  <div className="px-6 pb-6 border-t border-white/10">
                    <div className="pt-6 prose prose-invert max-w-none">
                      <div className="text-[#adaaaa] whitespace-pre-wrap">
                        {question.answer}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!selectedRequirement && (
          <div className="text-center py-12">
            <p className="text-[#adaaaa] text-lg">
              👆 Select a requirement above to view related questions
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
