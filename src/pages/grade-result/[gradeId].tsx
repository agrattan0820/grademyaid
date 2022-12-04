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

type SchoolInfoProps = {
  name: string;
  city: string;
  state: string;
  tuition: number;
  net_price: number;
  median_10_salary: number;
  graduation_rate: string;
  transfer_rate: string;
};

const SchoolInfo = ({
  name,
  city,
  state,
  tuition,
  net_price,
  median_10_salary,
  graduation_rate,
  transfer_rate,
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
          <p className="font-bold">Tuition per year</p>
          <p>${numberWithCommas(tuition)}</p>
        </li>
        <li className="flex justify-between md:text-lg">
          <p className="font-bold">Average net price per year</p>
          <p>${numberWithCommas(net_price)}</p>
        </li>
        <li className="flex justify-between md:text-lg">
          <p className="font-bold">Median 10 year salary</p>
          <p>${numberWithCommas(median_10_salary)}</p>
        </li>
        <li className="flex justify-between md:text-lg">
          <p className="font-bold">Graduation Rate</p>
          <p>{graduation_rate}</p>
        </li>
        <li className="flex justify-between md:text-lg">
          <p className="font-bold">Transfer Rate</p>
          <p>{transfer_rate}</p>
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
  const [favoriteWarning, setFavoriteWarning] = useState(false);
  const [isSaved, setIsSaved] = useState(!!props.savedGrade);
  const [isFavorited, setIsFavorited] = useState(!!props.savedGrade);

  const user = useUser();

  // Grade fetching
  const { gradeId: routerGradeId } = router.query;
  const gradeId = Number.parseInt(routerGradeId as string);
  const grade = useGrade(gradeId, props.grade);
  const location =
    props.grade.in_out_loc === "inState" ? "in_state" : "out_of_state";

  // School fetching
  const schoolId = props.grade.school_id;
  const school = useSchool(schoolId, props.school);
  const schoolData = props.school && props.school?.results[0];

  /**  Function for share button that either copies the link to clipboard or activates the mobile share if available */
  const onShareClick = () => {
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

  /** If User is not defined show a warning when pressing the favorite shchool button */
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
              name={schoolData.school.name}
              city={schoolData.school.city}
              state={schoolData.school.state}
              tuition={schoolData.latest.cost.tuition[location]}
              median_10_salary={
                schoolData.latest.earnings["10_yrs_after_entry"].median
              }
              net_price={schoolData.latest.cost.avg_net_price.overall}
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
  const favoriteSchool = session?.user.id
    ? await getFavoriteSchoolById(school.id, session?.user.id)
    : null;

  return { props: { grade, school, saveGrade, favoriteSchool } };
};
