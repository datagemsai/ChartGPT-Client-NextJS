import { auth } from '@/auth'
import clientPromise from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'


export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const page = Number(req.nextUrl.searchParams.get('page')) ?? 1
    const limit = Number(req.nextUrl.searchParams.get('limit')) ?? 10
    const userId = (await auth())?.user.id

    if (!userId) {
      return new NextResponse('Unauthorized', {
        status: 401
      })
    }

    const client = await clientPromise
    const db = client.db("api")

    const responses = await db.collection("responses")
      .find({ outputs: { $elemMatch: { type: 'plotly_chart' } } })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ created_at: -1 })  // newest first
      .toArray()

    // TODO Add client Response type
    const count = await db.collection("responses")
      .find({ outputs: { $elemMatch: { type: 'plotly_chart' } } })
      .count()

    return new NextResponse(JSON.stringify({
      responses,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    })
  } catch (error: any) {
    console.log(error)
    return new NextResponse(error, {
      status: 500,
    })
  }
}
