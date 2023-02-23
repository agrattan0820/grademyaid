import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState } from "react";
import Head from "next/head";
import Header from "../components/header";
import { FaUser } from "react-icons/fa";
import Image from "next/image";
import {
  createServerSupabaseClient,
  Session,
  User,
} from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, NextPage } from "next";
import { Database } from "../utils/database.types";
import Button from "../components/button";
import Link from "next/link";
import { numberWithCommas } from "../utils/formatters";
import { useFavoritedSchools } from "../utils/hooks/use-favorited-schools";
import { useUserGrades } from "../utils/hooks/use-grades";

type SavedGradeListingProps = {
  grade: number;
  link: string;
  school: string;
  aidAmount: number;
  location: "inState" | "outState";
};

const GradeListing = ({
  grade,
  link,
  school,
  aidAmount,
  location,
}: SavedGradeListingProps) => {
  return (
    <Link href={link}>
      <div className="relative mx-auto flex min-h-[8rem] w-full cursor-pointer flex-col items-center justify-center rounded-2xl bg-white px-12 py-4 shadow shadow-emerald-200 ring-emerald-200 transition hover:ring-4 md:w-96 md:px-20">
        <div
          className={`absolute -top-4 -left-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400 ${
            grade <= 3 ? "bg-rose-500" : ""
          } md:-top-8 md:-left-8 md:h-24 md:w-24`}
        >
          <p className="text-2xl font-bold text-black md:text-4xl">{grade}</p>
        </div>
        <div className="w-full text-left">
          <h3 className="mb-2 text-xl font-bold leading-none">{school}</h3>
          <div className="flex justify-between">
            <p className="text-sm">Aid Amount:</p>
            <p className="text-sm">${numberWithCommas(aidAmount)}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm">Location:</p>
            <p className="text-sm">
              {location === "inState" ? "In-state" : "Out-of-state"}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

type FavoritedSchoolListingProps = {
  name: string;
  websiteLink: string;
  priceCalculatorLink: string;
};

const FavoritedSchoolListing = ({
  name,
  websiteLink,
  priceCalculatorLink,
}: FavoritedSchoolListingProps) => {
  return (
    <div className="relative mx-auto flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-2xl bg-white px-6 shadow shadow-emerald-200 ring-emerald-200 transition hover:ring-4 md:w-96 md:px-12">
      <div className="w-full text-left">
        <h3 className="mb-2 text-xl font-bold leading-none">{name}</h3>
        <div className="flex space-x-2">
          <a href={websiteLink} target="_blank" rel="noreferrer">
            <Button
              color="emerald"
              label="Website"
              size="small"
              height="full"
            />
          </a>
          <a href={priceCalculatorLink} target="_blank" rel="noreferrer">
            <Button
              color="emerald"
              label="Price Calculator"
              size="small"
              outline
            />
          </a>
        </div>
      </div>
    </div>
  );
};

type DashboardPageProps = {
  initialSession: Session;
  user: User;
};

const DashboardPage: NextPage<DashboardPageProps> = (props) => {
  const supabase = useSupabaseClient<Database>();
  const router = useRouter();

  type pageTypes = "account" | "grades" | "colleges";

  const [pageName, setPageName] = useState<pageTypes>(
    (router.query.page as pageTypes) ?? "account"
  );

  const userGrades = useUserGrades(props.user.id);
  const favoritedSchools = useFavoritedSchools(props.user.id);

  async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error.message, error);
    }

    router.push("/");
  }

  async function selectAccount() {
    setPageName("account");
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
    <div>
      <Head>
        <title>Dashboard - GradeMyAid</title>
      </Head>
      <Header />
      <main className="min-h-screen bg-green-100">
        <div className="container mx-auto py-28 px-4 text-center">
          <div className="mx-auto mb-4 space-y-1">
            {props.user?.user_metadata.avatar_url ? (
              <Image
                width={96}
                height={96}
                src={props.user?.user_metadata.avatar_url}
                alt={`Avatar image for the user ${props.user?.email}`}
                className="rounded-full"
              />
            ) : (
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-700">
                <FaUser color="white" size={40} />
              </div>
            )}
            <h2 className="text-xl font-bold">
              {props.user?.user_metadata.full_name ?? props.user?.email}
            </h2>
          </div>
          <div className="flex items-center justify-center">
            {/* Start Side Bar element */}
            <div className="flex flex-wrap items-center justify-center gap-4 rounded-full bg-emerald-300 px-4 py-2">
              {/* Start Account sidebar element*/}
              <button
                className={`rounded-full p-2 text-sm font-bold transition hover:ring-2 hover:ring-emerald-200 md:text-base ${
                  pageName === "account" && "bg-emerald-200"
                }`}
                onClick={selectAccount}
              >
                User Account
              </button>
              {/* End dashboard sidebar element*/}

              {/* Start Saved Grades side bar element */}
              <button
                className={`rounded-full p-2 text-sm font-bold transition hover:ring-2 hover:ring-emerald-200 md:text-base ${
                  pageName === "grades" && "bg-emerald-200"
                }`}
                onClick={selectGrades}
              >
                Grades
              </button>
              {/* End Saved Grades side bar element*/}

              {/* Start Saved Colleges side bar element */}
              <button
                className={`rounded-full p-2 text-sm font-bold transition hover:ring-2 hover:ring-emerald-200 md:text-base ${
                  pageName === "colleges" && "bg-emerald-200"
                }`}
                onClick={selectColleges}
              >
                Saved Colleges
              </button>
              {/* End Saved Colleges side bar element */}

              {/* Start Grade side bar element */}

              <button
                className={`rounded-full p-2 text-sm transition hover:ring-2 hover:ring-emerald-200 md:text-base`}
                onClick={selectGetGrade}
              >
                <b>Get Grade </b>
              </button>
              {/* End Grade side bar element */}
            </div>
          </div>
          <div className="mt-16">
            {
              // === compares types as well as the value
              pageName === "account" && (
                <div className="mx-auto flex h-48 w-full flex-col items-center justify-center space-y-4 rounded-2xl bg-white p-8 shadow shadow-emerald-200 md:w-96">
                  {props.user.user_metadata.full_name && (
                    <div className="flex w-full justify-between">
                      <p className="font-bold">Name:</p>
                      <p>{props.user.user_metadata.full_name}</p>
                    </div>
                  )}
                  <div className="flex w-full justify-between">
                    <p className="font-bold">Email:</p>
                    <p>{props.user.email}</p>
                  </div>
                  <div>
                    <Button color="rose" label="Logout" onClick={signOut} />
                  </div>
                </div>
              )
            }

            {
              // === compares types as well as the value
              pageName === "grades" && (
                <div className="mx-auto grid max-w-5xl gap-16 lg:grid-cols-2">
                  {!userGrades.isLoading && (
                    <>
                      {userGrades.data?.map((grade, i) => (
                        <GradeListing
                          key={i}
                          grade={grade.grade_num}
                          aidAmount={grade?.financial_aid}
                          school={grade?.school_name ?? ""}
                          link={`/grade-result/${grade.grade_id}`}
                          location={grade?.in_out_loc as "inState" | "outState"}
                        />
                      ))}
                    </>
                  )}
                </div>
              )
            }

            {
              // === compares types as well as the value
              pageName === "colleges" && (
                <div className="mx-auto grid max-w-5xl gap-16 lg:grid-cols-2">
                  {!favoritedSchools.isLoading && (
                    <>
                      {favoritedSchools.data?.map((school, i) => (
                        <FavoritedSchoolListing
                          key={i}
                          name={school.school_name ?? ""}
                          websiteLink={"https://" + school.school_url ?? ""}
                          priceCalculatorLink={
                            school.school_price_calculator
                              ? "https://" + school.school_price_calculator
                              : ""
                          }
                        />
                      ))}
                    </>
                  )}
                </div>
              )
            }
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient<Database>(context);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  return {
    props: {
      initialSession: session,
      user: session.user,
    },
  };
};
