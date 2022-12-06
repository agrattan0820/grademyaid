import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import supabase from "../supabase";

/** GET saved grades */
export const getSavedGrades = async (accountId: string) => {
  const { data, error } = await supabase
    .from("saved_grades")
    .select(`grade_id, grade(*)`)
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
export function useSavedGrades(accountId: string) {
  return useQuery(["saved-grades"], () => getSavedGrades(accountId));
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

/** HOOK post save grade */
export function useSaveGradeMutation() {
  const queryClient = useQueryClient();
  return useMutation((data: SaveGradeProps) => saveGrade(data), {
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["saved-grades"],
      });
    },
  });
}

type DeleteSaveGradeProps = {
  gradeId: number;
  accountId: string;
};

/** DELETE saved grade by id */
export const deleteSavedGrade = async ({
  gradeId,
  accountId,
}: DeleteSaveGradeProps) => {
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

/** HOOK delete save grade */
export function useDeleteSaveGradeMutation() {
  const queryClient = useQueryClient();
  return useMutation((data: DeleteSaveGradeProps) => deleteSavedGrade(data), {
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["saved-grades"],
      });
    },
  });
}
