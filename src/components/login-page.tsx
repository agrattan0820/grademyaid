import router from "next/router";

const LoginPage = () =>{ 
    return (
        <div className="w-full max-w-xs">
        <h2>Login Page</h2>
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" method="POST" action="">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username"/>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************"/>
            <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"  onClick={() => router.push('/forgot-password')}>
              Forgot Password?
            </a>
          </div>
          <div className="flex items-center justify-between">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" 
            onClick={() => {
              //code here to login
              //loginHandler
            }
            }>
              Sign In
            </button>
            <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={() => router.push('/register-page')}>
             Sign Up
            </a>
          </div>
        </form>
      </div>
    );
 };

export default LoginPage;
