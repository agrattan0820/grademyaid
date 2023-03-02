import React, { ReactNode, useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

import { FaHeart, FaLink, FaRegHeart } from "react-icons/fa";
import {
  FiRefreshCw,
  FiShare,
  FiArrowDown,
  FiArrowUp,
  FiInfo,
} from "react-icons/fi";
import { decimalAsPercent, numberWithCommas } from "../../utils/formatters";
import Header from "../../components/header";
import Button from "../../components/button";
import { useGrade } from "../../utils/hooks/use-grade";
import { Database } from "../../utils/database.types";
import { useSchool } from "../../utils/hooks/use-school";
import { useUser } from "@supabase/auth-helpers-react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import {
  getFavoriteSchoolById,
  useDeleteFavoriteSchoolMutation,
  useFavoriteSchoolMutation,
} from "../../utils/hooks/use-favorited-schools";
import { calculateStudentPrice } from "../../utils/calculate-score";
import LoadingSpinner from "../../components/loading-spinner";
import { usePopper } from "react-popper";

type StatBlockProps = {
  name: string;
  children: ReactNode;
  positive?: boolean;
  arrow?: "up" | "down";
};

const StatBlock = ({ name, children, positive, arrow }: StatBlockProps) => {
  return (
    <div className="flex items-center justify-between rounded-xl bg-emerald-50 p-4 text-sm font-bold shadow-emerald-300">
      <span>{name}</span>
      <span
        className={`${
          positive
            ? `text-emerald-500`
            : positive === false
            ? `text-rose-500`
            : ""
        } flex items-center`}
      >
        {arrow === "up" ? (
          <FiArrowUp />
        ) : arrow === "down" ? (
          <FiArrowDown />
        ) : null}
        {children}
      </span>
    </div>
  );
};

type SchoolInfoProps = {
  schoolData: any;
  financialAid: number;
  location: "in_state" | "out_of_state";
};

const SchoolInfo = ({
  schoolData,
  financialAid,
  location,
}: SchoolInfoProps) => {
  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const [tooltipIsOpen, setTooltipIsOpen] = useState(false);
  const { styles, attributes } = usePopper(referenceElement, popperElement);

  const data = {
    acceptanceRate: schoolData.latest.admissions.admission_rate.overall,
    graduationRate: {
      stat: schoolData.latest.completion.consumer_rate,
      positive: schoolData.latest.completion.consumer_rate > 0.57,
    },
    medianSalaries: [
      "6_yrs_after_entry",
      "7_yrs_after_entry",
      "8_yrs_after_entry",
      "9_yrs_after_entry",
      "10_yrs_after_entry",
    ].map((year) => {
      return {
        stat: schoolData.latest.earnings[year].median,
        positive:
          schoolData.latest.earnings[year].median >
          schoolData.latest.earnings[year]?.consumer?.median_by_pred_degree,
      };
    }),
    medianDebt: schoolData.latest.aid.median_debt.completers.overall,
    netPrice: {
      stat: schoolData.latest.cost.avg_net_price.overall,
      positive:
        schoolData.latest.cost.avg_net_price.overall <
        schoolData.latest.cost.avg_net_price.consumer.median_by_pred_degree,
    },
    roomBoardOff: schoolData.latest.cost.roomboard.offcampus,
    roomBoardOn: schoolData.latest.cost.roomboard.oncampus,
    studentPopulation: schoolData.latest.student.size,
    transferRate: {
      stat: schoolData.latest.completion.transfer_rate["4yr"].full_time,
      positive:
        schoolData.latest.completion.transfer_rate["4yr"].full_time > 0.17,
    },
    tuition: schoolData.latest.cost.tuition[location],
    yourNetPrice: calculateStudentPrice(schoolData, financialAid, location),
  };

  return (
    <>
      <section className="grid gap-4 lg:grid-cols-2">
        <StatBlock
          name="Net Price Per Year"
          positive={data.netPrice.positive}
          arrow={data.netPrice.positive ? "up" : "down"}
        >
          {numberWithCommas(data.netPrice.stat, true)}
        </StatBlock>
        <StatBlock
          name="Median 10-Year Salary"
          positive={
            data.medianSalaries[data.medianSalaries.length - 1].positive
          }
          arrow={
            data.medianSalaries[data.medianSalaries.length - 1].positive
              ? "up"
              : "down"
          }
        >
          {numberWithCommas(
            data.medianSalaries[data.medianSalaries.length - 1].stat,
            true
          )}
        </StatBlock>
        <StatBlock
          name="Graduation Rate"
          positive={data.graduationRate.positive}
          arrow={data.graduationRate.positive ? "up" : "down"}
        >
          {decimalAsPercent(data.graduationRate.stat)}
        </StatBlock>
        <StatBlock
          name="Transfer Rate"
          positive={data.transferRate.positive}
          arrow={data.transferRate.positive ? "down" : "up"}
        >
          {decimalAsPercent(data.transferRate.stat)}
        </StatBlock>
        <StatBlock name="Your Location">
          {location === "in_state" ? "In-state" : "Out-of-state"}
        </StatBlock>
        <StatBlock name="Your Net Price">
          {data.yourNetPrice === 0 ? "Free 🎉" : data.yourNetPrice}
        </StatBlock>
        <div className="col-span-2 flex items-center justify-between rounded-xl bg-emerald-50 p-8 text-xl font-bold shadow-emerald-300">
          <p className="flex items-center">
            Your Price Difference{" "}
            <button
              className="ml-1.5"
              onClick={() => setTooltipIsOpen(!tooltipIsOpen)}
              ref={setReferenceElement}
            >
              <FiInfo />
            </button>
            {tooltipIsOpen && (
              <div
                className="bg-emerald-500 text-white"
                ref={setPopperElement}
                style={styles.popper}
                {...attributes.popper}
              >
                Popper element
              </div>
            )}
          </p>
          {data.yourNetPrice - data.netPrice.stat > 0 ? (
            <p className="text-rose-600">
              {numberWithCommas(data.yourNetPrice - data.netPrice.stat, true)}
            </p>
          ) : (
            <p className="text-emerald-600">
              {numberWithCommas(
                Math.abs(data.yourNetPrice - data.netPrice.stat),
                true
              )}
              💰
            </p>
          )}
        </div>
      </section>
    </>
  );
};

type PageProps = {
  grade: Database["public"]["Tables"]["grade"]["Row"];
  favoriteSchool: {
    fav_school_id: number;
    school_id: number;
    account_id: string | null;
  } | null;
};

const GradeResultPage: NextPage<PageProps> = (props) => {
  const router = useRouter();
  const [copying, setCopying] = useState(false);
  const [favoriteWarning, setFavoriteWarning] = useState(false);
  const [isFavorited, setIsFavorited] = useState(!!props.favoriteSchool);

  const user = useUser();

  // Grade fetching
  const { gradeId: routerGradeId } = router.query;
  const gradeId = Number.parseInt(routerGradeId as string);
  const grade = useGrade(gradeId, props.grade);
  const favoriteMutation = useFavoriteSchoolMutation();
  const deleteFavoriteMutation = useDeleteFavoriteSchoolMutation();
  const location =
    props?.grade?.in_out_loc === "inState" ? "in_state" : "out_of_state";

  // School fetching
  const schoolId = props.grade?.school_id;
  const school = useSchool(schoolId);
  const schoolData =
    !school.isLoading && school.data?.data && school?.data.data?.results[0];

  console.log(schoolData);

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

  const onFavoriteSchoolClick = async (userId: string, schoolId: number) => {
    const favoritedSchoolAlready = await getFavoriteSchoolById(
      schoolId,
      userId
    );

    if (favoritedSchoolAlready) {
      console.log("Unfavoriting School");
      await deleteFavoriteMutation.mutateAsync({ schoolId, accountId: userId });
      setIsFavorited(false);
    } else {
      console.log("Favoriting School");
      await favoriteMutation.mutateAsync({
        schoolId: schoolId,
        accountId: userId,
        schoolName: schoolData.school.name,
        schoolUrl: schoolData.school.school_url,
        schoolPriceCalculator: schoolData.school.price_calculator_url,
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
        <title>Grade Result - GradeMyAid</title>
      </Head>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-center space-y-12 bg-emerald-200 px-8 pt-32 pb-28">
        <div className="flex h-full flex-col-reverse items-stretch justify-center md:flex-row md:space-x-8">
          <motion.section
            transition={{ delay: 0.4 }}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex min-w-full flex-col items-center justify-center rounded-2xl bg-emerald-50 p-8 shadow-lg shadow-emerald-300 md:min-w-[20rem]"
          >
            <p className="font-bold">Your grade:</p>
            {!grade.isLoading ? (
              <p
                className={`text-9xl font-bold leading-tight xl:text-[12rem] ${
                  grade.data?.grade_num !== undefined &&
                  grade.data?.grade_num <= 3
                    ? "text-rose-500"
                    : ""
                }
                ${
                  grade.data?.grade_num !== undefined &&
                  grade.data?.grade_num >= 7
                    ? "text-emerald-500"
                    : ""
                }
                `}
              >
                {grade.data?.grade_num}
              </p>
            ) : (
              <p className="text-9xl font-bold leading-none xl:text-[12rem]">
                {" "}
              </p>
            )}
            <p className="-mt-8 font-bold">out of 10</p>
          </motion.section>

          <section className="mb-8 w-full max-w-xl md:mb-0">
            <div className="mb-2 md:mb-4">
              <h2 className="mb-0.5 text-4xl font-bold leading-tight md:text-5xl md:leading-tight">
                {props.grade.school_name}
              </h2>
              {schoolData && (
                <p>
                  {schoolData.school.city}, {schoolData.school.state}
                </p>
              )}
            </div>
            {schoolData ? (
              <SchoolInfo
                schoolData={schoolData}
                financialAid={props.grade.financial_aid}
                location={location}
              />
            ) : (
              <div className="flex h-64 w-full items-center justify-center lg:w-[36rem]">
                <LoadingSpinner />
              </div>
            )}
          </section>
        </div>
        <div className="flex w-full flex-col items-center justify-center space-y-2">
          <div className="flex w-full flex-wrap items-center justify-center gap-4 py-2">
            <div className="relative z-10">
              <Button
                color="rose"
                onClick={() =>
                  user
                    ? onFavoriteSchoolClick(user?.id, schoolData.id)
                    : showFavoriteLoginWarning()
                }
              >
                <span className="mr-2">
                  {isFavorited ? <FaHeart /> : <FaRegHeart />}
                </span>
                <span>Favorite School</span>
              </Button>
              <div
                // Role alert and aria-live announce to screen readers
                role="alert"
                aria-live="polite"
                className={`share-popup pointer-events-none absolute top-0 left-1/2 z-10 h-0 w-64 max-w-3xl origin-center rounded-md bg-rose-300  text-center text-sm font-bold ${
                  favoriteWarning && "animate-popup h-auto px-4 py-2"
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
              <Button onClick={onShareClick} color="violet">
                <span className="mr-2">
                  <FiShare />
                </span>
                <span>Share Grade</span>
              </Button>
              <div
                // Role alert and aria-live announce to screen readers
                role="alert"
                aria-live="polite"
                className={`share-popup pointer-events-none absolute top-0 left-1/2 z-0 h-0 w-56 max-w-3xl origin-center rounded-md bg-violet-300  text-center text-sm font-bold ${
                  copying && "animate-popup h-auto px-4 py-2"
                }`}
              >
                <p className={`${!copying && "hidden"} flex items-center`}>
                  URL Copied to Clipboard <FaLink className="ml-2" />
                </p>
              </div>
            </div>
          </div>
          <Button color="emerald" onClick={() => router.push("/")}>
            <span className="mr-2">
              <FiRefreshCw />
            </span>
            <span>Do Another Grade</span>
          </Button>
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
    const { data: favoriteSchool } = await supabase
      .from("favorited_schools")
      .select()
      .eq("school_id", grade?.school_id)
      .eq("account_id", session?.user.id)
      .single();

    return { props: { grade, favoriteSchool } };
  }
  return { props: {} };
};
