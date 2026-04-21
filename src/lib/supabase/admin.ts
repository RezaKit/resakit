import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

/**
 * Client admin Supabase (utilise la service_role key).
 * À utiliser UNIQUEMENT côté serveur dans les API routes.
 * Contourne les politiques RLS — à manier avec précaution.
 */
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
