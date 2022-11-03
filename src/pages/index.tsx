import type { NextPage } from "next";
import Head from "next/head";
import LoginPage from "../../components/login-page";
import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'



const Home: NextPage = () => {

  const session = useSession()
  const supabase = useSupabaseClient()

  return (
    <div className="container" style={{ padding: '50px 0 100px 0' }}>
      {!session ? (
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="dark"
        />
      ) : (
        <p>Account goes here after email validation</p>
      )}
    </div>
  );
};

export default Home;
