import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Exclude static files, API routes, and the maintenance page itself
  if (
    !pathname.startsWith('/maintenance') &&
    !pathname.startsWith('/_next') &&
    !pathname.startsWith('/api') &&
    !pathname.match(/\.(.*)$/)
  ) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/system_settings?select=client_maintenance&limit=1`,
        {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
          },
          cache: 'no-store', // Bypass data cache for immediate status evaluation
        }
      )
      
      if (res.ok) {
        const data = await res.json()
        if (data && data.length > 0 && data[0].client_maintenance === true) {
          return NextResponse.redirect(new URL('/maintenance', request.url))
        }
      }
    } catch (e) {
      console.error('Northunion maintenance check failed:', e)
    }
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
