import { useQuery } from "@tanstack/react-query";
import type { NextPage } from "next";
import Head from "next/head";
import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'



const Home: NextPage = () => {
  const session = useSession()
  const supabase = useSupabaseClient()

  return (
<div className="flex items-center justify-center min-h-screen bg-gray-100">
      {!session ? (
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="default"
          providers={['google', 'facebook']} //adds google
        />
      ) : (
        <p>Account goes here after email validation</p>
      )}
    </div>
  );
};



export default Home;
