// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

// .env.local veya Vercel environment variables içine ekleyin
const SANITY_WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  try {
    const { body, isValidSignature } = await parseBody<{
      _type: string
      slug?: { current: string }
    }>(req, SANITY_WEBHOOK_SECRET)

    if (!isValidSignature) {
      const message = 'Invalid signature'
      return new Response(JSON.stringify({ message, isValidSignature, body }), { status: 401 })
    }

    if (!body?._type) {
      return new Response('Bad Request', { status: 400 })
    }

    // İlgili sayfaların cache'ini temizle
    // Portföy sayfasını her zaman güncelle
    revalidatePath('/portfoy')

    // Eğer bir ilan güncellendiyse, onun detay sayfasını da güncelle
    if (body.slug?.current) {
      revalidatePath(`/ilan/${body.slug.current}`)
    }

    return NextResponse.json({
      status: 200,
      revalidated: true,
      now: Date.now(),
      body,
    })
  } catch (err: any) {
    console.error('Error in revalidate:', err)
    return new Response(err.message, { status: 500 })
  }
}
