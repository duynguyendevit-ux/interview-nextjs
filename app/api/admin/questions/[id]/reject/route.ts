import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  // Check authentication
  const session = await getServerSession()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Get rejection reason from body (optional)
  const body = await request.json().catch(() => ({}))
  const { reason } = body
  
  try {
    // TODO: Update database - mark question as rejected
    // Example:
    // await db.questions.update({
    //   where: { id },
    //   data: { 
    //     status: 'rejected',
    //     rejectedBy: session.user.id,
    //     rejectedAt: new Date(),
    //     rejectionReason: reason
    //   }
    // })
    
    // For now, just return success
    return NextResponse.json({
      success: true,
      message: `Question ${id} rejected successfully`,
      data: {
        id,
        status: 'rejected',
        rejectedBy: session.user.id,
        rejectedAt: new Date().toISOString(),
        reason: reason || null
      }
    })
  } catch (error) {
    console.error('Error rejecting question:', error)
    return NextResponse.json(
      { error: 'Failed to reject question' },
      { status: 500 }
    )
  }
}
