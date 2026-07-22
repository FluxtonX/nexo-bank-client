import { createBrowserClient } from '@supabase/ssr'
import { createProgressFetch } from '@/lib/nprogress'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        fetch: createProgressFetch(),
      },
    }
  )
}
