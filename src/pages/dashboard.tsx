import router from "next/router";
import {
  useSession,
  useSupabaseClient,
  Session,
} from "@supabase/auth-helpers-react";
import { useState } from "react";
import { type } from "os";

const DashboardPage = () => {
  const supabase = useSupabaseClient();

  type pageTypes = "dashboard" | "grades" | "colleges";

  const [pageName, setPageName] = useState<pageTypes>("dashboard");

  async function signOut() {
    const { error } = await supabase.auth.signOut();
  }

  async function selectDashboard() {
    setPageName("dashboard");
  }

  async function selectGrades() {
    setPageName("grades");
  }

  async function selectColleges() {
    setPageName("colleges");
  }

  async function selectGetGrade() {
    router.push(`/`);
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
            <button
              className="boarder rounded py-2 hover:text-white"
              onClick={selectDashboard}
            >
              <b>Dashboard </b>
            </button>
            {/* End dashboard sidebar element*/}

            {/* Start Saved Grades side bar element */}
            <button
              className="boarder rounded py-2 hover:text-white"
              onClick={selectGrades}
            >
              <b>Saved Grades</b>
            </button>
            {/* End Saved Grades side bar element*/}

            {/* Start Saved Colleges side bar element */}
            <button
              className="boarder rounde py-2 hover:text-white"
              onClick={selectColleges}
            >
              <b>Saved Colleges </b>
            </button>
            {/* End Saved Colleges side bar element */}

            {/* Start Grade side bar element */}

            <button
              className="boarder rounded  py-2 hover:text-white"
              onClick={selectGetGrade}
            >
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
        <div>
          {
            // === compares types as well as the value
            pageName === "dashboard" && (
              <div>Hello this is the Dashboard Page</div>
            )
          }

          {
            // === compares types as well as the value
            pageName === "grades" && (
              <div>Hello this is the Saved Grade Page </div>
            )
          }

          {
            // === compares types as well as the value
            pageName === "colleges" && (
              <div>Hello this is the Saved College Page</div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
