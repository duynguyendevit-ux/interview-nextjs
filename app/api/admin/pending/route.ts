import { NextResponse } from 'next/server'

// Proxy to Cloudflare Worker D1 API
const WORKER_API = 'https://interview-questions-api.dyan79.workers.dev'

export async function GET() {
  try {
    const response = await fetch(`${WORKER_API}/api/admin/pending`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Fetch pending questions error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch pending questions' },
      { status: 500 }
    )
  }
}
