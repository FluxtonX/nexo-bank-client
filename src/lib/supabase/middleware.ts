import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with cross-browser cookies.
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || 
                      request.nextUrl.pathname.startsWith('/register') || 
                      request.nextUrl.pathname.startsWith('/forgot-password') || 
                      request.nextUrl.pathname.startsWith('/reset-password');
                      
  // All these routes need to be protected. For now let's just protect a few basic user ones based on the plan.
  // We can just protect all routes starting with /dashboard, /portfolio, /deposit, /exchange, etc.
  // Or better, let's create a list of protected base paths.
  const protectedRoutes = [
    '/dashboard',
    '/deposit',
    '/exchange',
    '/portfolio',
    '/wallets',
    '/withdraw',
    '/settings',
    '/transactions',
    '/account-restricted',
    '/notifications',
    '/price-alerts',
    '/referral',
    '/statements',
    '/support',
    '/help-support',
    '/ui-completion'
  ];

  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));

  if (!user && isProtectedRoute) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If user is logged in and trying to access a protected route, ensure they are email verified
  if (user && isProtectedRoute) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('email_verified, last_ip')
      .eq('id', user.id)
      .single()

    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'Unknown';
    
    // Update last_ip if it has changed or is missing
    if (ipAddress !== 'Unknown' && profile?.last_ip !== ipAddress) {
      await supabase.from('profiles').update({ 
        last_ip: ipAddress,
        last_login: new Date().toISOString()
      }).eq('id', user.id);
    }

    if (!profile?.email_verified) {
      const url = request.nextUrl.clone()
      url.pathname = '/verify-email'
      url.searchParams.set('email', user.email || '')
      return NextResponse.redirect(url)
    }
  }

  if (user && isAuthRoute) {
    // User is logged in, redirect away from auth pages
    // Exception: /verify-email can be accessed if they need to verify
    if (request.nextUrl.pathname.startsWith('/verify-email')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('email_verified')
        .eq('id', user.id)
        .single()
      
      // If already verified, redirect to dashboard
      if (profile?.email_verified) {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
      }
      // Otherwise allow access to verify-email
      return supabaseResponse
    }

    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  return supabaseResponse
}
