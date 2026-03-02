import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // Nutze den Service-Role Key für Backend-Syncs!

export const supabase = createClient(supabaseUrl, supabaseKey)