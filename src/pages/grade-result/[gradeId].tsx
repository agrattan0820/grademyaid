import React, { useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { FaHeart, FaLink, FaRegHeart } from "react-icons/fa";
import { FiRefreshCw, FiShare } from "react-icons/fi";
import { numberWithCommas } from "../../utils/formatters";
import Header from "../../components/header";
import Button from "../../components/button";
import { useGrade, getGrade } from "../../utils/hooks/use-grade";
import { Database } from "../../utils/database.types";
import { useSchool } from "../../utils/hooks/use-school";
import { fetchSchoolById } from "../../utils/queries";
import { saveGrade } from "../../utils/hooks/use-save-grade-mutation";
import { useUser } from "@supabase/auth-helpers-react";
import {
  deleteSavedGradeById,
  getSavedGradeById,
} from "../../utils/hooks/use-saved-grade-id";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

type SchoolInfoProps = {
  name: string;
  city: string;
  state: string;
  net_price: number;
  median_10_salary: number;
  average_loan: number;
};

const SchoolInfo = ({
  name,
  city,
  state,
  net_price,
  median_10_salary,
  average_loan,
}: SchoolInfoProps) => {
  return (
    <section className="mb-8 max-w-xl md:mb-0">
      <div className="mb-2 md:mb-8">
        <h2 className="mb-1 text-4xl font-bold leading-tight md:text-5xl md:leading-tight">
          {name}
        </h2>
        <p>
          {city}, {state}
        </p>
      </div>
      <ul>
        <li className="flex justify-between md:text-lg">
          <p className="font-bold">Average net price per year</p>
          <p>${numberWithCommas(net_price)}</p>
        </li>
        <li className="flex justify-between md:text-lg">
          <p className="font-bold">Average loan amount</p>
          <p>${numberWithCommas(average_loan)}</p>
        </li>
        <li className="flex justify-between md:text-lg">
          <p className="font-bold">Median 10 year salary</p>
          <p>${numberWithCommas(median_10_salary)}</p>
        </li>
      </ul>
    </section>
  );
};

type PageProps = {
  grade: Database["public"]["Tables"]["grade"]["Row"];
  // TODO: Type school response
  school: any;
  savedGrade: {
    grade_id: number;
  } & {
    grade:
      | ({
          school_id: number;
        } & {
          grade_num: number | null;
        } & {
          financial_aid: number | null;
        } & {
          in_out_loc: string | null;
        })
      | ({
          school_id: number;
        } & {
          grade_num: number | null;
        } & {
          financial_aid: number | null;
        } & {
          in_out_loc: string | null;
        })[]
      | null;
  };
};

const GradeResultPage: NextPage<PageProps> = (props) => {
  /**
   * Tasks
   * - Save grade to Supabase database
   * - Pull in grade from data, Zustand?
   * - Show info on the school
   * - Show share button
   * - Show save button
   */
  const router = useRouter();
  const [copying, setCopying] = useState(false);
  const [saveWarning, setSaveWarning] = useState(false);
  const [isSaved, setIsSaved] = useState(!!props.savedGrade);

  const user = useUser();

  // Grade fetching
  const { gradeId: routerGradeId } = router.query;
  const gradeId = Number.parseInt(routerGradeId as string);

  const grade = useGrade(gradeId, props.grade);

  // School fetching
  const schoolId = props.grade.school_id;
  const school = useSchool(schoolId, props.school);

  /**  Function for share button that either copies the link to clipboard or activates the mobile share if available */
  const shareLink = () => {
    console.log("clicked!");
    if (navigator.share) {
      navigator
        .share({
          title: `GradeMyAid Rating`,
          url: typeof window !== "undefined" ? window.location.href : "",
        })
        .then(() => {
          console.log(`Thanks for sharing!`);
        })
        .catch(console.error);
    } else {
      const cb = navigator.clipboard;
      if (copying) {
        setCopying(false);
      }
      cb.writeText(typeof window !== "undefined" ? window.location.href : "")
        .then(() => {
          setCopying(true);
        })
        .catch(console.error);
    }
  };

  // function to save the grade to the database:
  const saveGradeHelper = async (userId: string, gradeId: number) => {
    const gradeExistsAlready = await getSavedGradeById(gradeId, userId);

    if (gradeExistsAlready) {
      console.log("Unsaving Grade");
      await deleteSavedGradeById(gradeId, userId);
      setIsSaved(false);
    } else {
      console.log("Saving Grade");
      await saveGrade({
        gradeId: gradeId,
        accountId: userId,
      });
      setIsSaved(true);
    }
  };

  const showLoginWarning = () => {
    setSaveWarning(true);
    setTimeout(() => {
      setSaveWarning(false);
    }, 2000);
  };

  const schoolData = props.school && props.school?.results[0];

  return (
    <div>
      <Head>
        <title>GradeMyAid</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-center space-y-16 bg-emerald-200 px-8 py-28">
        <div className="flex flex-col-reverse items-center justify-center md:flex-row md:space-x-8">
          <section className="flex h-96 min-w-full flex-col items-center justify-center rounded-2xl bg-emerald-50 p-8 shadow-lg shadow-emerald-300 md:min-w-[20rem]">
            <p className="font-bold">Your grade:</p>
            {!grade.isLoading ? (
              <p className="text-9xl font-bold leading-tight xl:text-[12rem]">
                {grade.data?.grade_num}
              </p>
            ) : (
              <p className="text-9xl font-bold leading-none xl:text-[12rem]">
                {" "}
              </p>
            )}
            <p className="-mt-8 font-bold">out of 10</p>
          </section>
          {schoolData ? (
            <SchoolInfo
              name={schoolData.school.name}
              city={schoolData.school.city}
              state={schoolData.school.state}
              median_10_salary={
                schoolData.latest.earnings["10_yrs_after_entry"].median
              }
              net_price={schoolData.latest.cost.avg_net_price.overall}
              average_loan={schoolData.latest.aid.loan_principal}
            />
          ) : (
            <div>Loading...</div>
          )}
        </div>
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex space-x-4">
            <div className="relative z-10">
              <Button
                color="rose"
                label="Save Grade"
                icon={isSaved ? <FaHeart /> : <FaRegHeart />}
                onClick={() =>
                  user && gradeId
                    ? saveGradeHelper(user?.id, gradeId)
                    : showLoginWarning()
                }
              />
              <div
                // Role alert and aria-live announce to screen readers
                role="alert"
                aria-live="polite"
                className={`share-popup pointer-events-none absolute top-0 left-1/2 z-10 w-56 max-w-3xl origin-center rounded-md bg-rose-300 px-4 py-2 text-center text-sm font-bold ${
                  saveWarning && "animate-popup"
                }`}
              >
                <p
                  className={`${
                    !saveWarning && "hidden"
                  } flex items-center justify-center`}
                >
                  Login first to save a grade!
                </p>
              </div>
            </div>
            <div className="relative z-10">
              <Button
                onClick={shareLink}
                color="violet"
                label="Share Grade"
                icon={<FiShare />}
              />
              <div
                // Role alert and aria-live announce to screen readers
                role="alert"
                aria-live="polite"
                className={`share-popup pointer-events-none absolute top-0 left-1/2 z-10 w-56 max-w-3xl origin-center rounded-md bg-violet-300 px-4 py-2 text-center text-sm font-bold ${
                  copying && "animate-popup"
                }`}
              >
                <p className={`${!copying && "hidden"} flex items-center`}>
                  URL Copied to Clipboard <FaLink className="ml-2" />
                </p>
              </div>
            </div>
          </div>
          <Button
            color="emerald"
            label="Do Another Grade"
            icon={<FiRefreshCw />}
            onClick={() => router.push("/")}
          />
        </div>
      </main>
    </div>
  );
};

export default GradeResultPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const supabase = createServerSupabaseClient(context);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { gradeId } = context.query;
  const grade = await getGrade(Number.parseInt(gradeId as string));

  const schoolResponse = await fetchSchoolById(grade.school_id);
  const school = schoolResponse.data;

  const saveGrade = session?.user.id
    ? await getSavedGradeById(grade.grade_id, session?.user.id)
    : null;

  return { props: { grade, school, saveGrade } };
};
