import { NextResponse } from 'next/server'

// Proxy to Cloudflare Worker D1 API
const WORKER_API = 'https://interview-questions-api.dyan79.workers.dev'

// GET /api/auth/me - Verify token
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization')
    
    const response = await fetch(`${WORKER_API}/api/auth/me`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader || '',
      },
    })
    
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Verify token error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
