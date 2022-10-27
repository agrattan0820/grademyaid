const ForgotPassword = () =>{ 
    return(
        <div className="w-full max-w-xs">
            <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">Change Password</h2>
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" method="POST" action="">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Email
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username"/>
          </div>
          <div className="flex items-center justify-between">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
              Reset Password
            </button>
          </div>
        </form>
      </div>
    );
};

export default ForgotPassword; 
