import { NextResponse } from 'next/server'

// POST /api/admin/questions/:id/reject
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { reason } = body
    
    // TODO: Update database
    // await db.questions.update(id, { 
    //   status: 'rejected',
    //   rejectionReason: reason 
    // })
    
    return NextResponse.json({
      success: true,
      message: `Question ${id} rejected successfully`
    })
  } catch (error) {
    console.error('Reject question error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
