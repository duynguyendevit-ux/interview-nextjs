import { NextResponse } from 'next/server'

const WORKER_API = 'https://interview-questions-api.dyan79.workers.dev/api/questions'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ topic: string }> }
) {
  try {
    const { topic } = await params
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '25')
    
    // Fetch all questions from Worker
    const response = await fetch(WORKER_API)
    const data = await response.json()
    
    // Filter by topic
    const topicQuestions = data.questions.filter((q: any) => 
      q.topic.toLowerCase().includes(topic.toLowerCase())
    )
    
    // Paginate
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedQuestions = topicQuestions.slice(start, end)
    
    return NextResponse.json({
      data: paginatedQuestions,
      pagination: {
        page,
        pageSize,
        total: topicQuestions.length,
        totalPages: Math.ceil(topicQuestions.length / pageSize)
      }
    })
  } catch (error) {
    console.error('Failed to fetch questions:', error)
    return NextResponse.json({ data: [], pagination: { page: 1, pageSize: 25, total: 0, totalPages: 0 } })
  }
}
