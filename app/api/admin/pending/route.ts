import { NextResponse } from 'next/server'

// Existing 69 questions are already approved by default
// This endpoint only returns NEW pending questions for review

const pendingQuestions: any[] = [
  // Add new pending questions here
  // Example:
  // {
  //   id: 'new-1',
  //   topic: 'spring-boot',
  //   text: 'New question text?',
  //   level: 'intermediate',
  //   answer: 'Answer here',
  //   submittedBy: 'AI Agent',
  //   submittedAt: new Date().toISOString(),
  //   status: 'pending'
  // }
]

export async function GET() {
  // Return only new pending questions
  // Existing 69 questions in /api/questions/[topic] are already approved
  return NextResponse.json(pendingQuestions)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { action, questionId } = body
  
  // TODO: Update database
  // For now, just return success
  
  if (action === 'approve' || action === 'reject') {
    return NextResponse.json({ 
      success: true, 
      message: `Question ${questionId} ${action}d successfully` 
    })
  }
  
  return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 })
}
