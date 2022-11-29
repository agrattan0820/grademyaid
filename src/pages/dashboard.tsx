import router from "next/router";
import {
  useSession,
  useSupabaseClient,
  Session,
} from "@supabase/auth-helpers-react";

const DashboardPage = () => {
  const supabase = useSupabaseClient();

  async function signOut() {
    const { error } = await supabase.auth.signOut();
  }

  return (
    <div className="bg-green-100">
      <div className="flex flex-row">
        <div className="w-45 flex h-screen flex-col justify-between bg-green-300">
          <div className="text-3x1 flex items-center justify-between px-5 text-gray-900">
            <b>Quick Access</b>
          </div>
          {/* Start Side Bar element */}
          <div className="flex flex-auto flex-col ">
            {/* Start dashboard sidebar element*/}
            <button className="boarder rounded py-2 hover:text-white">
              <b>Dashboard </b>
            </button>
            {/* End dashboard sidebar element*/}

            {/* Start Saved Grades side bar element */}
            <button className="boarder rounded py-2 hover:text-white">
              <b>Saved Grades</b>
            </button>
            {/* End Saved Grades side bar element*/}

            {/* Start Saved Colleges side bar element */}
            <button className="boarder rounde py-2 hover:text-white">
              <b>Saved Colleges </b>
            </button>
            {/* End Saved Colleges side bar element */}

            {/* Start Grade side bar element */}

            <button className="boarder rounded  py-2 hover:text-white">
              <b>Get Grade </b>
            </button>
            {/* End Grade side bar element */}
          </div>
          {/* End Dashboard Side Bar element */}

          <div className="flex flex-col">
            <button
              className="boarder rounded-full bg-green-400 py-2 hover:text-white"
              onClick={signOut}
            >
              <b>Logout</b>
            </button>
          </div>
        </div>
        <div className="flex flex-auto">
          <div className="flex flex-col">
            <div className="flex flex-col bg-green-100">
              <div className="flex flex-row space-x-3">
                <h4 className="text-bold p-1">Dashboard</h4>
              </div>
            </div>

            <div className="min-h-screen">
              <div className="mt-8 grid gap-10 p-4 sm:grid-cols-2 lg:grid-cols-3 ">
                <div className="flex items-center bg-green-100">
                  <div className="text-sm">Colleges you have scores for</div>
                  <div className="flex items-center pt-1">
                    <div className="text-3x1">44</div>
                  </div>
                </div>
                <div className="flex items-center bg-green-100">
                  <div className="text-sm">Colleges you have scores for</div>
                  <div className="flex items-center pt-1">
                    <div className="text-3x1">44</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
