import { NextResponse } from 'next/server'

// Proxy to Cloudflare Worker D1 API
const WORKER_API = 'https://interview-questions-api.dyan79.workers.dev'

// POST /api/questions/submit - Submit new question for review
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const response = await fetch(`${WORKER_API}/api/questions/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Submit question error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
