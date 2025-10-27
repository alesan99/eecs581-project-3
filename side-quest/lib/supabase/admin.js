import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,  // supabase project URL
    process.env.SUPABASE_SERVICE_ROLE_KEY, //  Admin role key
    {
      auth: {
        autoRefreshToken: false,  // don't refresh token automatically
        persistSession: false  // do not persist session in storage
      }
    }
  )
}
