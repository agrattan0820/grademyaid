import { User } from "@supabase/supabase-js";
import supabase from "../supabase";

export async function upsertProfile(user: User) {
  try {
    const { data, error } = await supabase.from("profiles").upsert({
      id: user.id,
      email: user?.email,
      full_name: user.user_metadata?.full_name ?? undefined,
      avatar_url: user.user_metadata?.avatar_url ?? undefined,
    });
    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}
