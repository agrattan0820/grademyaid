import React, { useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import {
  FaBookmark,
  FaHeart,
  FaLink,
  FaRegBookmark,
  FaRegHeart,
} from "react-icons/fa";
import { FiRefreshCw, FiShare } from "react-icons/fi";
import { numberWithCommas } from "../../utils/formatters";
import Header from "../../components/header";
import Button from "../../components/button";
import { useGrade, getGrade } from "../../utils/hooks/use-grade";
import { Database } from "../../utils/database.types";
import { useSchool } from "../../utils/hooks/use-school";
import { fetchSchoolById } from "../../utils/queries";
import {
  saveGrade,
  deleteSavedGrade,
} from "../../utils/hooks/use-saved-grades";
import { useUser } from "@supabase/auth-helpers-react";
import { getSavedGradeById } from "../../utils/hooks/use-saved-grade-id";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import {
  deleteFavoritedSchool,
  favoriteSchool,
  getFavoriteSchoolById,
} from "../../utils/hooks/use-favorited-schools";
import { calculateStudentPrice } from "../../utils/calculate-score";

type SchoolInfoProps = {
  name: string;
  city: string;
  state: string;
  tuition: number;
  net_price: number;
  grade_net_price: number;
  median_6_salary: number;
  median_7_salary: number;
  median_8_salary: number;
  median_9_salary: number;
  median_10_salary: number;
  graduation_rate: string;
  transfer_rate: string;
  acceptance_rate: string;
  location: "in_state" | "out_of_state";
  median_debt: number;
  student_population: number, 
  roomboard_off: number,
  roomboard_on: number,

};

const SchoolInfo = ({
  name,
  city,
  state,
  tuition,
  net_price,
  grade_net_price,
  median_6_salary,
  median_7_salary,
  median_8_salary,
  median_9_salary,
  median_10_salary,
  graduation_rate,
  transfer_rate,
  acceptance_rate,
  location,
  median_debt, 
  student_population, 
  roomboard_off,
  roomboard_on,

  
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
        <li className="flex justify-between">
          <p className="font-bold">Tuition Per Year</p>
          <p>${numberWithCommas(tuition)}</p>
        </li>
        <li className="flex justify-between">
          <p className="font-bold">Net Price Per Year</p>
          <p>${numberWithCommas(net_price)}</p>
        </li>
        <li className="flex justify-between">
          <p className="font-bold">Undergrad Student Population</p>
          <p>{numberWithCommas(student_population)}</p>
        </li>
        <li className="flex justify-between">
          <p className="font-bold">Room/Board Per Year</p>
          <p>${numberWithCommas(roomboard_on)}</p>
        </li>
        <li className="flex justify-between">
          <p className="font-bold">Average 10y Salary</p>
          <p>${numberWithCommas(median_10_salary)}</p>
        </li>
        <details className="mb-2">
            <summary className="hover:underline cursor-pointer font-bold text-xs text-black-500 text-sky-500">
              More Info
            </summary>
            <p className="text-sm text-black-500">
             Average 9 year salary: ${numberWithCommas(median_9_salary)}
             <br />
             Average 8 year salary: ${numberWithCommas(median_8_salary)}
             <br />
             Average 7 year salary: ${numberWithCommas(median_7_salary)} 
             <br/>
             Average 6 year salary: ${numberWithCommas(median_6_salary)}
            </p>
          </details>
        <li className="flex justify-between">
          <p className="font-bold ">Median Debt</p>
          <p className="">${numberWithCommas(median_debt)}</p>
        </li>
        <li className="flex justify-between">
          <p className="font-bold">Acceptance Rate</p>
          <p>{acceptance_rate}</p>
        </li>
        <li className="flex justify-between">
          <p className="font-bold">Transfer Rate</p>
          <p>{transfer_rate}</p>
        </li>
        <li className="flex justify-between">
          <p className="font-bold">Graduation Rate</p>
          <p>{graduation_rate}</p>
        </li>
        <li className="flex justify-between">
          <p className="font-bold">Your Location</p>
          <p>{location === "in_state" ? "In-state" : "Out-of-state"}</p>
        </li>
        <li className="flex justify-between">
          <p className="font-bold">Your Net Price</p>
          <p>${numberWithCommas(grade_net_price)}</p>
        </li>
        <li className="flex justify-between">
          <p className="font-bold">Price Difference</p>
         {grade_net_price - net_price > 0 ? <p className="font-bold text-red-600">${numberWithCommas(grade_net_price - net_price)}</p> : <p className="font-bold text-green-700">${numberWithCommas(Math.abs(grade_net_price - net_price))}</p>}
        </li>
        <details>
            <summary className="hover:underline cursor-pointer font-bold text-xs text-black-500 text-sky-500 ">
            What is price difference?
            </summary>
            <p className="text-sm text-black-500 ">
              Price difference is the aveage net tuition - your net tuition.
              <br />
              Green means you would save more than an average student
              <br />
              Red means you would spend more than an average student
            </p>
          </details>
      </ul>
    </section>
  );
};

type PageProps = {
  grade: Database["public"]["Tables"]["grade"]["Row"];
  // TODO: Type school response
  school: any;
  saveGrade: {
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
  favoriteSchool: {
    fav_school_id: number;
    school_id: number;
    account_id: string | null;
  } | null;
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
  const [favoriteWarning, setFavoriteWarning] = useState(false);
  const [isSaved, setIsSaved] = useState(!!props.saveGrade);
  const [isFavorited, setIsFavorited] = useState(!!props.favoriteSchool);


  const user = useUser();

  // Grade fetching
  const { gradeId: routerGradeId } = router.query;
  const gradeId = Number.parseInt(routerGradeId as string);
  const grade = useGrade(gradeId, props.grade);
  const location =
    props?.grade?.in_out_loc === "inState" ? "in_state" : "out_of_state";

  // School fetching
  const schoolId = props.grade?.school_id;
  const school = useSchool(schoolId, props.school);
  const schoolData = props.school && props.school?.results[0];

  /**  Function for share button that either copies the link to clipboard or activates the mobile share if available */
  const onShareClick = () => {
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

  const onSaveGradeClick = async (userId: string, gradeId: number) => {
    const gradeExistsAlready = await getSavedGradeById(gradeId, userId);
    if (gradeExistsAlready) {
      console.log("Unsaving Grade");
      await deleteSavedGrade(gradeId, userId);
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

  /** If User is not defined show a warning when pressing the save grade button */
  const showSaveLoginWarning = () => {
    setSaveWarning(true);
    setTimeout(() => {
      setSaveWarning(false);
    }, 2000);
  };

  const onFavoriteSchoolClick = async (userId: string, schoolId: number) => {
    const favoritedSchoolAlready = await getFavoriteSchoolById(
      schoolId,
      userId
    );

    if (favoritedSchoolAlready) {
      console.log("Unfavoriting School");
      await deleteFavoritedSchool(schoolId, userId);
      setIsFavorited(false);
    } else {
      console.log("Favoriting School");
      await favoriteSchool({
        schoolId: schoolId,
        accountId: userId,
      });
      setIsFavorited(true);
    }
  };

  /** If User is not defined show a warning when pressing the favorite school button */
  const showFavoriteLoginWarning = () => {
    setFavoriteWarning(true);
    setTimeout(() => {
      setFavoriteWarning(false);
    }, 2000);
  };

 
  
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
              name={schoolData.school.name }
              city={schoolData.school.city}
              state={schoolData.school.state}
              tuition={schoolData.latest.cost.tuition[location]}
              median_6_salary={schoolData.latest.earnings["6_yrs_after_entry"].median}
              median_7_salary={schoolData.latest.earnings["7_yrs_after_entry"].mean_earnings}
              median_8_salary={schoolData.latest.earnings["8_yrs_after_entry"].median_earnings}
              median_9_salary={schoolData.latest.earnings["9_yrs_after_entry"].mean_earnings}
              median_10_salary={schoolData.latest.earnings["10_yrs_after_entry"].median}
              student_population={schoolData.latest.student.size}
              net_price={schoolData.latest.cost.avg_net_price.overall}
              roomboard_off = {schoolData.latest.cost.roomboard.offcampus}
              roomboard_on = {schoolData.latest.cost.roomboard.oncampus}
              median_debt={schoolData.latest.aid.median_debt.completers.overall}
              grade_net_price={calculateStudentPrice(
                schoolData,
                props.grade?.financial_aid as number,
                location
              )}
              graduation_rate={
                (schoolData.latest.completion.consumer_rate * 100).toFixed(2) +
                "%"
              }
              transfer_rate={
                (
                  schoolData.latest.completion.transfer_rate["4yr"].full_time *
                  100
                ).toFixed(2) + "%"
              }
              acceptance_rate={(schoolData.latest.admissions.admission_rate.overall*
                100
              ).toFixed(2) + "%"}
              location={location}
            />
          ) : (
            <div>Loading...</div>
          )}
        </div>
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex space-x-4">
            <div className="relative z-10">
              <Button
                color="sky"
                label="Save Grade"
                icon={isSaved ? <FaBookmark /> : <FaRegBookmark />}
                onClick={() =>
                  user
                    ? onSaveGradeClick(user?.id, gradeId)
                    : showSaveLoginWarning()
                }
              />
              <div
                // Role alert and aria-live announce to screen readers
                role="alert"
                aria-live="polite"
                className={`share-popup pointer-events-none absolute top-0 left-1/2 z-10 w-56 max-w-3xl origin-center rounded-md bg-sky-300 px-4 py-2 text-center text-sm font-bold ${
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
                color="rose"
                label="Favorite School"
                icon={isFavorited ? <FaHeart /> : <FaRegHeart />}
                onClick={() =>
                  user
                    ? onFavoriteSchoolClick(user?.id, schoolData.id)
                    : showFavoriteLoginWarning()
                }
              />
              <div
                // Role alert and aria-live announce to screen readers
                role="alert"
                aria-live="polite"
                className={`share-popup pointer-events-none absolute top-0 left-1/2 z-10 w-64 max-w-3xl origin-center rounded-md bg-rose-300 px-4 py-2 text-center text-sm font-bold ${
                  favoriteWarning && "animate-popup"
                }`}
              >
                <p
                  className={`${
                    !favoriteWarning && "hidden"
                  } flex items-center justify-center`}
                >
                  Login first to favorite a school!
                </p>
              </div>
            </div>
            <div className="relative z-10">
              <Button
                onClick={onShareClick}
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
  const supabase = createServerSupabaseClient<Database>(context);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { gradeId } = context.query;

  const { data: grade } = await supabase
    .from("grade")
    .select()
    .eq("grade_id", Number.parseInt(gradeId as string))
    .single();

  if (grade) {
    const schoolResponse = await fetchSchoolById(grade?.school_id);
    const school = schoolResponse.data;

    const { data: saveGrade } = await supabase
      .from("saved_grades")
      .select(
        `
      grade_id,
      grade (
        school_id,
        grade_num,
        financial_aid,
        in_out_loc
      )`
      )
      .eq("account_id", session?.user.id)
      .eq("grade_id", grade.grade_id)
      .single();

    const { data: favoriteSchool } = await supabase
      .from("favorited_schools")
      .select()
      .eq("school_id", grade?.school_id)
      .eq("account_id", session?.user.id)
      .single();

    return { props: { grade, school, saveGrade, favoriteSchool } };
  }
  return { props: {} };
};
