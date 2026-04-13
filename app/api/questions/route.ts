import { NextResponse } from 'next/server'

const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || 'cfut_lM8H8ovGsWlqRH053kIXKByELmXpDPaipdtW1hnd22c54421'
const ACCOUNT_ID = 'f3b5b742250edde80a1553605e279760'
const DATABASE_ID = 'c6ec7a6b-8d5f-4c38-8aff-c0d1983d54ed'

export async function GET() {
  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sql: 'SELECT id, topic, text as question, answer, level as difficulty FROM approved_questions ORDER BY id DESC'
        }),
      }
    )

    const data = await response.json()
    
    if (data.success && data.result && data.result[0]) {
      return NextResponse.json({
        questions: data.result[0].results
      })
    }

    return NextResponse.json({ questions: [] })
  } catch (error) {
    console.error('Failed to fetch questions:', error)
    return NextResponse.json({ questions: [] }, { status: 500 })
  }
}
