import { NextResponse } from 'next/server'

// POST /api/questions/submit - Submit new question for review
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { topic, text, level, answer, submittedBy } = body
    
    // Validation
    if (!topic || !text || !level || !answer) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    if (!['basic', 'intermediate', 'advanced'].includes(level)) {
      return NextResponse.json(
        { success: false, message: 'Invalid level' },
        { status: 400 }
      )
    }
    
    // Generate unique ID
    const questionId = `pending-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const newQuestion = {
      id: questionId,
      topic,
      text,
      level,
      answer,
      submittedBy: submittedBy || 'Anonymous',
      submittedAt: new Date().toISOString(),
      status: 'pending'
    }
    
    // TODO: Save to database (for now, just return success)
    // In production: await db.questions.insert(newQuestion)
    
    return NextResponse.json({
      success: true,
      message: 'Question submitted successfully! It will be reviewed by admin.',
      questionId
    })
  } catch (error) {
    console.error('Submit question error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
