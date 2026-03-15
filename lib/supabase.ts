import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://qtqvxpdcxxrseibtqtpo.supabase.co"
const supabaseKey = "sb_publishable_JmEZtv_NRzmxKQRFmtgGyQ_lxSrJQJV"

export const supabase = createClient(supabaseUrl, supabaseKey)