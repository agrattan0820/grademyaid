import router from "next/router";

const LoginPage = () =>{ 
    return (
      <div>
        <button className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Dashboard</button>
        <button className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Settings</button>
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-500 md:text-5xl lg:text-6xl dark:text-white content-top">Rate My Aid </h1>
      </div>
    );
 };

export default LoginPage;
