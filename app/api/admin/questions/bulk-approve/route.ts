import { NextResponse } from 'next/server'

// POST /api/admin/questions/bulk-approve
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { questionIds } = body
    
    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid question IDs' },
        { status: 400 }
      )
    }
    
    // TODO: Bulk update database
    // await db.questions.updateMany(questionIds, { status: 'approved' })
    // await db.questions.moveToProduction(questionIds)
    
    return NextResponse.json({
      success: true,
      message: `${questionIds.length} questions approved successfully`,
      count: questionIds.length
    })
  } catch (error) {
    console.error('Bulk approve error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
