import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useUser } from "@supabase/auth-helpers-react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import Header from "../components/header";
import { Database } from "../utils/database.types";
import supabase from "../utils/supabase";
import Head from "next/head";

const LoginPage = () => {
  const user = useUser();
  const router = useRouter();

  /**
   * If the page rerenders and the user is logged in,
   * redirect them to the homepage
   * */
  if (user) {
    router.push("/");
  }

  return (
    <div>
      <Head>
        <title>Login - GradeMyAid</title>
      </Head>
      <Header />
      <main className="relative flex min-h-screen items-center justify-center bg-emerald-100">
        <div className="w-full max-w-xl rounded-2xl bg-white p-16 shadow-lg shadow-emerald-200">
          <Auth
            supabaseClient={supabase}
            redirectTo={
              process.env.NODE_ENV === "development"
                ? "http://localhost:3000/"
                : "https://cs1530-finance-group.vercel.app/"
            }
            appearance={{ theme: ThemeSupa }}
            theme="default"
            providers={["google"]}
          />
        </div>
      </main>
    </div>
  );
};

export default LoginPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const supabase = createServerSupabaseClient<Database>(context);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return { props: {} };
};
