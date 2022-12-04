import { useQuery } from "@tanstack/react-query";
import supabase from "../supabase";

/** GET saved grades */
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

/** HOOK get saved grades */
export function useSavedGrades(accountId: string, initialData?: any) {
  return useQuery(
    ["saved-grades", accountId],
    () => getSavedGrades(accountId),
    {
      initialData: initialData,
    }
  );
}

type SaveGradeProps = {
  gradeId: number;
  accountId: string;
};

/** POST save grade */
export const saveGrade = async ({ gradeId, accountId }: SaveGradeProps) => {
  const { data, error } = await supabase
    .from("saved_grades")
    .insert({
      grade_id: gradeId,
      account_id: accountId,
    })
    .select()
    .single();

  if (error) {
    console.log("Error", error);
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Grade not saved");
  }
  return data;
};

/** DELETE saved grade by id */
export const deleteSavedGrade = async (gradeId: number, accountId: string) => {
  const { data, error } = await supabase
    .from("saved_grades")
    .delete()
    .eq("account_id", accountId)
    .eq("grade_id", gradeId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
