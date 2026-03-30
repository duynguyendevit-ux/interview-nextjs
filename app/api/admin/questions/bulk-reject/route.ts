import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

export async function POST(request: Request) {
  // Check authentication
  const session = await getServerSession()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const body = await request.json()
  const { questionIds, reason } = body
  
  if (!Array.isArray(questionIds) || questionIds.length === 0) {
    return NextResponse.json(
      { error: 'Invalid request: questionIds array required' },
      { status: 400 }
    )
  }
  
  try {
    // TODO: Bulk reject in database
    // Example:
    // await db.questions.updateMany({
    //   where: { id: { in: questionIds } },
    //   data: { 
    //     status: 'rejected',
    //     rejectedBy: session.user.id,
    //     rejectedAt: new Date(),
    //     rejectionReason: reason
    //   }
    // })
    
    return NextResponse.json({
      success: true,
      message: `${questionIds.length} questions rejected successfully`,
      data: {
        count: questionIds.length,
        questionIds,
        rejectedBy: session.user.id,
        rejectedAt: new Date().toISOString(),
        reason: reason || null
      }
    })
  } catch (error) {
    console.error('Error bulk rejecting questions:', error)
    return NextResponse.json(
      { error: 'Failed to reject questions' },
      { status: 500 }
    )
  }
}
