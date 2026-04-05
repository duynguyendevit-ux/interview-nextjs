'use client'

import { useState } from 'react'

interface Project {
  id: number
  title: string
  description: string
  skills: string
  timeEstimate: string
  tier: 'beginner' | 'intermediate' | 'advanced' | 'production'
}

const PROJECTS: Project[] = [
  // Tier 1: Prompt Engineering
  { id: 1, tier: 'beginner', title: 'Personal Writing Editor', description: 'System prompt biết writing style, audience, quality standards của bạn. Input: draft → Output: polished version in your voice.', skills: 'System prompt engineering, few-shot examples', timeEstimate: '2-4 hours' },
  { id: 2, tier: 'beginner', title: 'Meeting Notes Processor', description: 'Raw meeting notes/transcripts → structured summaries với action items, decisions, open questions, owner assignments.', skills: 'Output formatting, structured extraction', timeEstimate: '2-4 hours' },
  { id: 3, tier: 'beginner', title: 'Email Drafter by Situation', description: 'Multi-mode: cold outreach, follow-up, bad news, negotiation, appreciation. Input: situation + recipient → ready-to-send email.', skills: 'Multi-mode prompting, context-dependent behavior', timeEstimate: '2-4 hours' },
  { id: 4, tier: 'beginner', title: 'Weekly Content Idea Generator', description: 'Input: niche, trends, past content → 15 ranked ideas với title, core argument, hook.', skills: 'Context engineering, ranking prompts', timeEstimate: '2-4 hours' },
  { id: 5, tier: 'beginner', title: 'Customer FAQ Auto-Responder', description: 'Feed product docs + FAQ database. Answers based ONLY on docs, says "I don\'t know" if not found.', skills: 'Grounded generation, hallucination prevention', timeEstimate: '2-4 hours' },
  { id: 6, tier: 'beginner', title: 'Study Guide Creator', description: 'Input: topic + difficulty → structured study guide với key concepts, practice questions, misconceptions.', skills: 'Educational content generation', timeEstimate: '2-4 hours' },
  { id: 7, tier: 'beginner', title: 'Resume Tailor', description: 'Input: job description + master resume → tailored resume emphasizing relevant skills.', skills: 'Comparative analysis, audience-specific rewriting', timeEstimate: '2-4 hours' },
  
  // Tier 2: API Integration
  { id: 8, tier: 'intermediate', title: 'Document Analyzer CLI', description: 'Command line tool: read PDF/text → answer questions. Example: "what are termination clauses?" on contract.', skills: 'API integration, file I/O, large context handling', timeEstimate: '4-8 hours' },
  { id: 9, tier: 'intermediate', title: 'Competitive Intelligence Tracker', description: 'Scrape competitor URLs → weekly briefing tracking content, product launches, positioning.', skills: 'Web scraping, automated analysis, recurring workflows', timeEstimate: '4-8 hours' },
  { id: 10, tier: 'intermediate', title: 'Code Review Bot', description: 'Review PRs/code files → structured feedback: security, logic errors, performance + severity + fixes.', skills: 'Structured evaluation, technical analysis', timeEstimate: '4-8 hours' },
  { id: 11, tier: 'intermediate', title: 'Multi-Format Content Repurposer', description: '1 long-form content → Twitter thread, LinkedIn post, 3 tweets, newsletter intro, video script. All platform-optimized.', skills: 'Prompt chaining, multi-format output, voice consistency', timeEstimate: '4-8 hours' },
  { id: 12, tier: 'intermediate', title: 'Invoice and Receipt Processor', description: 'Read photos/PDFs → extract vendor, amount, date, category → JSON or spreadsheet rows.', skills: 'Document extraction, structured outputs, data pipeline', timeEstimate: '4-8 hours' },
  { id: 13, tier: 'intermediate', title: 'Personal Finance Analyzer', description: 'Import bank CSV → categorize transactions, spending by category, unusual charges, monthly summary.', skills: 'Data processing, pattern recognition, CSV handling', timeEstimate: '4-8 hours' },
  { id: 14, tier: 'intermediate', title: 'Technical Documentation Generator', description: 'Point at codebase → generate docs: architecture, function descriptions, setup, API reference.', skills: 'Code analysis, documentation standards, large context', timeEstimate: '4-8 hours' },
  
  // Tier 3: Agent Architecture
  { id: 15, tier: 'advanced', title: 'Research Agent', description: 'Tools: web search + note-saving. Input: research question → structured report with citations.', skills: 'Agentic loop, tool use, multi-step reasoning', timeEstimate: '8-16 hours' },
  { id: 16, tier: 'advanced', title: 'Lead Qualification Agent', description: 'Read leads from spreadsheet → research companies → score against ICP → ranked list with reasoning.', skills: 'Business workflow automation, scoring systems, batch processing', timeEstimate: '8-16 hours' },
  { id: 17, tier: 'advanced', title: 'Daily Briefing Automation', description: 'Scheduled agent: check email, Slack, calendar, task list → one-page morning briefing.', skills: 'Multi-source data integration, scheduling, file system interaction', timeEstimate: '8-16 hours' },
  { id: 18, tier: 'advanced', title: 'Smart Expense Report Builder', description: 'Process folder of receipt images → extract data, categorize, check policy violations → formatted report.', skills: 'Image processing, batch operations, report generation', timeEstimate: '8-16 hours' },
  { id: 19, tier: 'advanced', title: 'Content Calendar Planner', description: 'Analyze past performance + research trends → 30-day calendar với topics, formats, hooks, platforms.', skills: 'Data-driven planning, trend analysis, strategic reasoning', timeEstimate: '8-16 hours' },
  { id: 20, tier: 'advanced', title: 'Multi-Agent Debate System', description: '3 agents: Researcher, Critic, Synthesizer. Produces better analysis through adversarial processes.', skills: 'Multi-agent orchestration, role specialization, adversarial processes', timeEstimate: '8-16 hours' },
  
  // Tier 4: Production-Ready
  { id: 21, tier: 'production', title: 'Client Proposal Generator', description: 'Input: project details → complete branded proposal với scope, timeline, pricing, terms, case studies.', skills: 'Template systems, brand voice encoding, document generation', timeEstimate: '16+ hours' },
  { id: 22, tier: 'production', title: 'Customer Support Agent', description: 'Full support agent: read docs, handle questions, escalate complex issues. Deploy as website widget.', skills: 'Production agent deployment, escalation logic, conversation management', timeEstimate: '16+ hours' },
  { id: 23, tier: 'production', title: 'Automated Report Pipeline', description: 'Scheduled system: pull data weekly → analyze → generate reports → email stakeholders. Runs unattended.', skills: 'End-to-end automation, data pipeline design, production reliability', timeEstimate: '16+ hours' },
  { id: 24, tier: 'production', title: 'SEO Content Engine', description: 'Input: keyword → research top content → identify gaps → generate optimized article → format for CMS.', skills: 'SEO-aware content generation, competitive analysis, CMS integration', timeEstimate: '16+ hours' },
  { id: 25, tier: 'production', title: 'AI Workflow Builder for Non-Technical Users ⭐', description: 'Meta-project: Let non-technical users create AI workflows. Plain English → working automation. This is a product people will pay for.', skills: 'Abstraction design, UX for AI systems, meta-level architecture', timeEstimate: '16+ hours' },
]

const TIER_CONFIG = {
  beginner: { label: 'Tier 1: Prompt Engineering', color: 'from-green-500 to-emerald-600', icon: '🟢' },
  intermediate: { label: 'Tier 2: API Integration', color: 'from-yellow-500 to-amber-600', icon: '🟡' },
  advanced: { label: 'Tier 3: Agent Architecture', color: 'from-orange-500 to-red-600', icon: '🟠' },
  production: { label: 'Tier 4: Production-Ready', color: 'from-red-500 to-pink-600', icon: '🔴' },
}

export default function AIProjectsPage() {
  const [selectedTier, setSelectedTier] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProjects = PROJECTS.filter(project => {
    const matchesTier = selectedTier === 'all' || project.tier === selectedTier
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTier && matchesSearch
  })

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white pt-16 md:pl-64">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-black font-space-grotesk text-[#ff8aa7] mb-4 uppercase">
            25 AI Projects
          </h1>
          <p className="text-[#adaaaa] text-lg font-manrope max-w-3xl">
            Tested 300+ AI project ideas, filtered down to 25 that actually deliver real value. 
            Each one can be built in a weekend. Each one teaches you a skill that compounds into the next project.
          </p>
          <div className="mt-6 p-4 bg-[#ff8aa7]/10 border border-[#ff8aa7] rounded-sm">
            <p className="text-[#ff8aa7] font-bold">💡 Key Insight:</p>
            <p className="text-white mt-2">"The fastest way to learn AI is to build with AI. The second fastest way does not exist."</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-white/10 text-white px-4 py-3 rounded-sm font-manrope focus:outline-none focus:ring-2 focus:ring-[#ff8aa7] focus:border-transparent"
          />

          {/* Tier Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTier('all')}
              className={`px-4 py-2 rounded-sm font-bold text-sm transition-all ${
                selectedTier === 'all'
                  ? 'bg-[#ff8aa7] text-black'
                  : 'bg-[#1a1a1a] text-[#adaaaa] hover:text-white border border-white/10'
              }`}
            >
              All Projects ({PROJECTS.length})
            </button>
            {Object.entries(TIER_CONFIG).map(([tier, config]) => (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={`px-4 py-2 rounded-sm font-bold text-sm transition-all ${
                  selectedTier === tier
                    ? 'bg-[#ff8aa7] text-black'
                    : 'bg-[#1a1a1a] text-[#adaaaa] hover:text-white border border-white/10'
                }`}
              >
                {config.icon} {config.label.split(':')[0]} ({PROJECTS.filter(p => p.tier === tier).length})
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="space-y-8">
          {Object.entries(TIER_CONFIG).map(([tier, config]) => {
            const tierProjects = filteredProjects.filter(p => p.tier === tier)
            if (tierProjects.length === 0) return null

            return (
              <div key={tier}>
                <h2 className="text-2xl font-black font-space-grotesk mb-4 flex items-center gap-3">
                  <span className="text-3xl">{config.icon}</span>
                  <span className={`bg-gradient-to-r ${config.color} bg-clip-text text-transparent`}>
                    {config.label}
                  </span>
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {tierProjects.map((project) => (
                    <div
                      key={project.id}
                      className="bg-[#1a1a1a] border border-white/10 rounded-sm p-6 hover:border-[#ff8aa7] transition-all group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-xs font-bold text-[#ff8aa7] bg-[#ff8aa7]/10 px-2 py-1 rounded-sm">
                          #{project.id}
                        </span>
                        <span className="text-xs text-[#adaaaa]">{project.timeEstimate}</span>
                      </div>
                      <h3 className="text-lg font-bold font-space-grotesk text-white mb-2 group-hover:text-[#ff8aa7] transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm text-[#adaaaa] mb-4 line-clamp-3">
                        {project.description}
                      </p>
                      <div className="pt-4 border-t border-white/10">
                        <p className="text-xs font-bold text-[#adaaaa] mb-1">Skills Learned:</p>
                        <p className="text-xs text-white">{project.skills}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Learning Path */}
        <div className="mt-16 p-8 bg-[#1a1a1a] border border-white/10 rounded-sm">
          <h2 className="text-2xl font-black font-space-grotesk text-[#ff8aa7] mb-6">
            🎯 Your Learning Path
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-white mb-2">🟢 Mới bắt đầu?</h3>
              <p className="text-[#adaaaa] text-sm">Build projects 1-4 this weekend. Each takes 2-4 hours. By Sunday night, you have 4 working AI tools.</p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2">🟡 Đã biết prompt?</h3>
              <p className="text-[#adaaaa] text-sm">Skip to projects 8-12. These teach API integration and scripting. Build 2 this weekend.</p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2">🟠 Đã dùng API?</h3>
              <p className="text-[#adaaaa] text-sm">Jump to projects 15-18. These teach agent architecture. Build 1 this weekend and polish it next weekend.</p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2">🔴 Muốn kiếm tiền?</h3>
              <p className="text-[#adaaaa] text-sm">Study projects 21-25 and pick one that fits your niche. Build it over 2 weekends. Then start selling it.</p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-[#adaaaa] text-sm">
          <p>Source: <a href="https://x.com/eng_khairallah1/status/2040353492846755982" target="_blank" rel="noopener noreferrer" className="text-[#ff8aa7] hover:underline">@eng_khairallah1</a></p>
          <p className="mt-2">Stop watching tutorials. Pick a number. Build it this weekend.</p>
        </div>
      </div>
    </div>
  )
}
