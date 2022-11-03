import { supabase } from "@supabase/auth-ui-react/dist/esm/common/theming"

async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
  }

  async function signout() {
    const { error } = await supabase.auth.signOut()
  }