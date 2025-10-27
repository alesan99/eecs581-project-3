import { createBrowserClient } from '@supabase/ssr'

/*
	Function: createClient
	Description:
		Returns a Supabase client configured for browser usage.
	Arguments: none
	Returns: Supabase client instance
*/
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}
