import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "./database.types";

const supabase = createBrowserSupabaseClient<Database>();

export default supabase;
