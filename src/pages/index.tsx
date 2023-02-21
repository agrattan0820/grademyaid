import { useLayoutEffect, useRef, useState } from "react";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { FaArrowDown } from "react-icons/fa";
import { useForm, Controller } from "react-hook-form";
import { useSpring } from "framer-motion";
import { useUser } from "@supabase/auth-helpers-react";
import { NumericFormat } from "react-number-format";

import Header from "../components/header";
import SchoolSearch from "../components/school-search";
import { calculateScore, LocationType } from "../utils/calculate-score";
import { useGradeMutation } from "../utils/hooks/use-grade";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../utils/database.types";
import SEO from "../components/seo";

/** TYPES */
type FormValues = {
  /** School choice */
  school: {
    value: number;
    label: string;
  };
  /** Whether the aid is for in-state or out-of-state */
  location: LocationType;
  /** Amount of aid the institution provides the student */
  aidAmount: string;
};

const Homepage: NextPage = () => {
  /** Next.js router */
  const router = useRouter();
  const user = useUser();

  /** Form State */
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { isSubmitting, isSubmitSuccessful, errors },
  } = useForm<FormValues>();
  const [loading, setLoading] = useState(false);
  const schoolValue = watch("school")?.value;
  const locationValue = watch("location");
  const gradeMutation = useGradeMutation();

  const onSubmit = async (data: FormValues) => {
    // set loading state
    setLoading(true);

    // remove thousand separator and dollar sign from input
    const aidAmount = Number(data.aidAmount.replace(/[^0-9.-]+/g, ""));

    const scoreResult = await calculateScore(
      data.school.value,
      aidAmount,
      data.location
    );
    const gradeResult = await gradeMutation.mutateAsync({
      schoolId: data.school.value,
      aidAmount: aidAmount,
      location: data.location,
      gradeNum: scoreResult,
      userId: user?.id,
      schoolName: data.school.label,
    });
    console.log("Score Result:", scoreResult);
    console.log("Grade Result:", gradeResult);
    if (scoreResult === undefined || !gradeResult) {
      setLoading(false);
    } else {
      router.push(`/grade-result/${gradeResult.grade_id}`);
    }
  };

  /** Slide Refs */
  const locationRef = useRef<HTMLElement>(null);
  const aidRef = useRef<HTMLElement>(null);

  /** Animation utils */
  /** Source for slide scroll animation: https://codesandbox.io/s/kxv7r?file=/src/App.js */
  const spring = useSpring(0);

  useLayoutEffect(() => {
    spring.onChange((latest) => {
      window.scrollTo(0, latest);
    });
  }, [spring]);

  const moveTo = (to: any) => {
    spring.set(window.pageYOffset, false);
    setTimeout(() => {
      spring.set(to);
    }, 50);
  };

  return (
    <div>
      <SEO />
      <Header />
      <main>
        <section className="relative flex min-h-screen items-center justify-center bg-emerald-100">
          {/* <div className="h-80 w-80 rounded-xl bg-orange-100"></div> */}
          <div className="container mx-auto px-4">
            <h2 className="relative z-10 mx-auto mb-8 max-w-xl text-center text-5xl font-black tracking-wide lg:max-w-2xl lg:text-7xl">
              How good is your financial aid? 💸
            </h2>
            <div className="mx-auto max-w-lg">
              <Controller
                control={control}
                rules={{ required: "An institution is required" }}
                name="school"
                render={({ field: { onChange } }) => (
                  <SchoolSearch handleChange={onChange} />
                )}
              />
            </div>
            {errors?.school && (
              <div className="mx-auto mt-8 w-80 rounded-md bg-red-50 py-2 px-4 text-center">
                <p className="text-red-600">{errors.school.message}</p>
              </div>
            )}
            {schoolValue && (
              <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 transform text-center">
                <button
                  type="button"
                  onClick={() => moveTo(locationRef?.current?.offsetTop)}
                >
                  <FaArrowDown className="mx-auto animate-bounce text-2xl transition" />
                </button>
              </div>
            )}
          </div>
        </section>
        <section
          className="relative flex min-h-screen items-center justify-center bg-emerald-400"
          ref={locationRef}
        >
          <div className="container mx-auto px-4">
            <h2 className="relative z-10 mx-auto mb-6 max-w-xl text-center text-5xl font-black tracking-wide lg:max-w-3xl lg:text-7xl">
              What type of location is the aid?
            </h2>
            <div className="mx-auto text-center">
              <div className="mx-auto flex w-56 flex-col space-y-2 text-left">
                <div className="rounded-2xl border-2 border-gray-300 bg-white px-4 py-2 focus-within:border-emerald-700">
                  <label
                    htmlFor="inState"
                    className="flex items-center justify-between"
                  >
                    <span className="mr-1 text-xl">In-state</span>
                    <input
                      type="radio"
                      id="inState"
                      value="inState"
                      className="form-radio text-emerald-700 focus:ring-emerald-700"
                      {...register("location", { required: true })}
                    />
                  </label>
                </div>
                <div className=" rounded-2xl border-2 border-gray-300 bg-white px-4 py-2 focus-within:border-emerald-700">
                  <label
                    htmlFor="outState"
                    className="flex items-center justify-between"
                  >
                    <span className="mr-1 text-xl">Out-of-state</span>
                    <input
                      type="radio"
                      id="outState"
                      value="outState"
                      className="form-radio text-emerald-700 focus:ring-emerald-700"
                      {...register("location", {
                        required: "The location field is required",
                      })}
                    />
                  </label>
                </div>
              </div>
            </div>
            {errors?.location && (
              <div className="mx-auto mt-8 w-80 rounded-md bg-red-50 py-2 px-4 text-center">
                <p className="text-red-600">{errors.location.message}</p>
              </div>
            )}
            {locationValue && (
              <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 transform text-center">
                <button
                  type="button"
                  onClick={() => moveTo(aidRef?.current?.offsetTop)}
                >
                  <FaArrowDown className="mx-auto animate-bounce text-2xl transition" />
                </button>
              </div>
            )}
          </div>
        </section>
        <section
          className="relative flex min-h-screen items-center justify-center bg-emerald-500"
          ref={aidRef}
        >
          <div className="container mx-auto px-4">
            <h2 className="relative z-10 mx-auto mb-8 max-w-xl text-center text-5xl font-black tracking-wide lg:max-w-3xl lg:text-7xl">
              What was your yearly aid amount?
            </h2>
            <div className="mx-auto text-center">
              <Controller
                control={control}
                name="aidAmount"
                rules={{ required: "The aid amount field is required" }}
                render={({ field: { onChange, value } }) => (
                  <NumericFormat
                    allowNegative={false}
                    decimalScale={2}
                    onValueChange={(v) => {
                      onChange(v.formattedValue);
                    }}
                    thousandSeparator=","
                    prefix="$"
                    value={value}
                    className="form-input w-80 rounded-full border-2 border-gray-300 px-4 py-2 ring-gray-300 focus:border-emerald-700 focus:outline-none focus:ring-emerald-700"
                  />
                )}
              />
            </div>
            {errors?.aidAmount && (
              <div className="mx-auto mt-8 w-80 rounded-md bg-red-50 py-2 px-4 text-center">
                <p className="text-red-600">{errors.aidAmount.message}</p>
              </div>
            )}
            <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 transform text-center">
              {Object.values(errors)?.length > 0 ? (
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled
                  className="min-w-[180px] rounded-full bg-red-300 px-4 py-2 font-bold shadow shadow-emerald-600 transition"
                >
                  There were errors
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  className="min-w-[180px] rounded-full bg-violet-300 px-4 py-2 font-bold shadow shadow-emerald-600 transition focus-within:scale-105 hover:scale-105"
                >
                  {isSubmitting || loading ? "Loading..." : "Get your rating"}
                </button>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Homepage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const supabase = createServerSupabaseClient<Database>(context);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If the user is authenticated, ensure the profiles entry exists and is updated
  if (user) {
    try {
      await supabase.from("profiles").upsert({
        id: user.id,
        email: user?.email,
        full_name: user.user_metadata?.full_name ?? undefined,
        avatar_url: user.user_metadata?.avatar_url ?? undefined,
      });
    } catch (error) {
      console.error(error);
    }
  }

  return {
    props: {},
  };
};
