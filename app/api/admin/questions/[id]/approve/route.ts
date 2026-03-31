import { NextResponse } from 'next/server'

// POST /api/admin/questions/:id/approve
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // TODO: Update database
    // await db.questions.update(id, { status: 'approved' })
    // await db.questions.moveToProduction(id)
    
    return NextResponse.json({
      success: true,
      message: `Question ${id} approved successfully`
    })
  } catch (error) {
    console.error('Approve question error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
