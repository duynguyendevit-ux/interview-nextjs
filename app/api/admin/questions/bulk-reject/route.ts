import { NextResponse } from 'next/server'

// POST /api/admin/questions/bulk-reject
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { questionIds, reason } = body
    
    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid question IDs' },
        { status: 400 }
      )
    }
    
    // TODO: Bulk update database
    // await db.questions.updateMany(questionIds, { 
    //   status: 'rejected',
    //   rejectionReason: reason 
    // })
    
    return NextResponse.json({
      success: true,
      message: `${questionIds.length} questions rejected successfully`,
      count: questionIds.length
    })
  } catch (error) {
    console.error('Bulk reject error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
