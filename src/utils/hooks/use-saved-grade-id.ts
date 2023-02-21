import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import supabase from "../supabase";

/** GET saved grade by id */
export const getSavedGradeById = async (gradeId: number, accountId: string) => {
  const { data, error } = await supabase
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
    .eq("account_id", accountId)
    .eq("grade_id", gradeId)
    .single();

  // If the error isn't that there are no rows returned, throw an error
  if (error && error.code !== "PGRST116") {
    throw new Error(error.message);
  }

  return data;
};

/** HOOK get saved grade by id */
export function useSavedGradeById(
  gradeId: number,
  accountId: string,
  options?: Omit<
    UseQueryOptions<unknown, unknown, unknown, (string | number)[]>,
    "initialData" | "queryFn" | "queryKey"
  >
) {
  return useQuery(
    ["saved-grade", gradeId, accountId],
    () => getSavedGradeById(gradeId, accountId),
    options
  );
}
