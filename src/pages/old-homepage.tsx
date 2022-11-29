import { useQuery } from "@tanstack/react-query";
import type { NextPage } from "next";
import Head from "next/head";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import {
  useSession,
  useSupabaseClient,
  Session,
} from "@supabase/auth-helpers-react";
import { fetchSchools } from "../utils/queries";
import Account from "../components/Account";
import Link from "next/link";

const Home: NextPage = () => {
  const session = useSession();
  const supabase = useSupabaseClient();

  const schoolQuery = useQuery({
    queryKey: ["schools"],
    queryFn: fetchSchools,
  });

  async function signOut() {
    const { error } = await supabase.auth.signOut();
  }

  // currently have homepage defined in this file, but will move to separate file once we know how to pass supabaseClient to other files
  const HomePage = ({ session }: { session: Session }) => {
    return (
      <div>
        <h1 className="content-top mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-500 dark:text-white md:text-5xl lg:text-6xl">
          grademyaid{" "}
        </h1>
        <button className="mr-2 mb-2 rounded-full border border-gray-200 bg-white py-2.5 px-5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">
          Dashboard
        </button>
        <button className="mr-2 mb-2 rounded-full border border-gray-200 bg-white py-2.5 px-5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">
          Settings
        </button>
        <Link href="/">
          <button className="mr-2 mb-2 rounded-full border border-gray-200 bg-white py-2.5 px-5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">
            Homepage
          </button>
        </Link>
        <button
          className="mr-2 mb-2 rounded-full border border-gray-200 bg-white py-2.5 px-5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
          onClick={signOut}
        >
          Logout
        </button>
        <Account session={session} />
      </div>
    );
  };

  // currently have login page defined in this file, but will move to separate file once we know how to pass supabaseClient to other files
  const LoginPage = () => {
    return (
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        theme="default"
        providers={["google", "facebook"]} //specify google,facebook sso
        socialLayout="horizontal"
      />
    );
  };

  return (
    <div>
      <Head>
        <title>grademyaid</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
          {!session ? ( //if not logged in
            <LoginPage />
          ) : (
            //if logged in
            <HomePage session={session} />
          )}
        </div>
        <pre>{JSON.stringify(schoolQuery, null, 2)}</pre>
      </main>
    </div>
  );
};

export default Home;