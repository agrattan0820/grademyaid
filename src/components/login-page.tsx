import { useSupabaseClient } from "@supabase/auth-helpers-react";
import router from "next/router";

const LoginPage = () => {
  const handleOnLogout = async () => {
    //  await useSupabaseClient.auth.signOut();
    router.push("/");
  };

  return (
    <div>
      <button className="mr-2 mb-2 rounded-full border border-gray-200 bg-white py-2.5 px-5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">
        Dashboard
      </button>
      <button className="mr-2 mb-2 rounded-full border border-gray-200 bg-white py-2.5 px-5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">
        Settings
      </button>
      <button
        className="mr-2 mb-2 rounded-full border border-gray-200 bg-white py-2.5 px-5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
        onClick={handleOnLogout}
      >
        Logout
      </button>
      <h1 className="content-top mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-500 dark:text-white md:text-5xl lg:text-6xl">
        Rate My Aid{" "}
      </h1>
    </div>
  );
};

export default LoginPage;
