import router from "next/router";

const dashboardPage = () => {
  return (
    <div className="flex flex-row">
      <div className="w-45 flex h-screen flex-col justify-between bg-green-300">
        <div className="text-3x1 flex items-center justify-between px-5 text-gray-900">
          <b>Quick Access</b>
        </div>
        {/* Start Dashboard side bar element */}
        <div className="flex flex-auto flex-col ">
          <div className="p-2 hover:text-blue-900">
            <div className="hover: flex flex-row">
              <div className="flex flex-row space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>

                <h4 className="text-bold">Dashboard</h4>
              </div>
            </div>
          </div>
          {/* End dashboard sidebar element*/}

          {/* Start Saved Colleges side bar element */}
          <div className="p-2 hover:text-blue-900">
            <div className="hover: flex flex-row">
              <div className="flex flex-row space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
                  />
                </svg>

                <h4 className="text-bold">Saved Colleges</h4>
              </div>
            </div>
          </div>
          {/* End Saved Colleges side bar element */}

          {/* Start Grade side bar element */}

          <div className="p-2 hover:text-blue-900">
            <div className="hover: flex flex-row">
              <div className="flex flex-row space-x-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                  />
                </svg>

                <h4 className="text-bold">Get Grade</h4>
              </div>
            </div>
          </div>
        </div>
        {/* End Grade side bar element */}

<<<<<<< Updated upstream
        <div className="flex flex-col">
          <button className="rounded bg-green-400 py-2">Logout</button>
=======
        <div className="flex flex-col hover:bg-gray-600">
          <button className="rounded bg-gray-500 py-2">Logout</button>
>>>>>>> Stashed changes
        </div>
      </div>
      <div className="flex flex-auto">
        <div className="flex flex-col">
          <div className="flex flex-col bg-white">
            <div className="flex flex-row space-x-3">
              <h4 className="text-bold p-1">Dashboard</h4>
            </div>
          </div>

          <div className="min-h-screen bg-red-200">
            <div className="mt-8 grid gap-10 p-4 sm:grid-cols-2 lg:grid-cols-3 ">
              <div className="flex items-center bg-white">
                <div className="text-sm">Colleges you have scores for</div>
                <div className="flex items-center pt-1">
                  <div className="text-3x1">44</div>
                </div>
              </div>
              <div className="flex items-center bg-white">
                <div className="text-sm">Colleges you have scores for</div>
                <div className="flex items-center pt-1">
                  <div className="text-3x1">44</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> // last one
  );
};

export default dashboardPage;
