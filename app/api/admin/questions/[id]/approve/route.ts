import { NextResponse } from 'next/server'

// Proxy to Cloudflare Worker D1 API
const WORKER_API = 'https://interview-questions-api.dyan79.workers.dev'

// POST /api/admin/questions/:id/approve
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const response = await fetch(`${WORKER_API}/api/admin/questions/${id}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Approve question error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
