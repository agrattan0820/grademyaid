import { useQuery } from "@tanstack/react-query";
import supabase from "../supabase";

/** GET calculated grade */
export const getUserGrades = async (accountId: string) => {
  const { data, error } = await supabase
    .from("grade")
    .select()
    .eq("account_id", accountId);

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Grade not found");
  }

  return data;
};

/** HOOK get calculated grade */
export function useUserGrades(accountId: string) {
  return useQuery(["grades", accountId], () => getUserGrades(accountId));
}
