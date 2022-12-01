import { useQuery } from "@tanstack/react-query";
import supabase from "../supabase";

export const getSavedGrades = async (accountId: string) => {
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
    .eq("account_id", accountId);

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Saved grade not found");
  }
  return data;
};

export function useSavedGrades(accountId: string, initialData?: any) {
  return useQuery(
    ["saved-grades", accountId],
    () => getSavedGrades(accountId),
    {
      initialData: initialData,
    }
  );
}
