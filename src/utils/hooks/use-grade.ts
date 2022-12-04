import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LocationType } from "../calculate-score";
import { Database } from "../database.types";
import supabase from "../supabase";

/** GET calculated grade */
export const getGrade = async (gradeId: number) => {
  const { data, error } = await supabase
    .from("grade")
    .select()
    .eq("grade_id", gradeId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Grade not found");
  }

  return data;
};

/** HOOK get calculated grade */
export function useGrade(
  gradeId: number,
  initialData?: Database["public"]["Tables"]["grade"]["Row"]
) {
  return useQuery(["grade", gradeId], () => getGrade(gradeId), {
    initialData: initialData,
  });
}

type PostGradeProps = {
  gradeNum: number;
  userId?: string;
  location: LocationType;
  aidAmount: number;
  schoolId: number;
};

/** POST calculated grade */
const postGrade = async ({
  gradeNum,
  userId,
  location,
  aidAmount,
  schoolId,
}: PostGradeProps) => {
  const { data, error } = await supabase
    .from("grade")
    .insert({
      grade_num: gradeNum,
      account_id: userId,
      in_out_loc: location,
      financial_aid: aidAmount,
      school_id: schoolId,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Grade not found");
  }

  return data;
};

/** HOOK post calculated grade */
export function useGradeMutation() {
  const queryClient = useQueryClient();
  return useMutation((data: PostGradeProps) => postGrade(data), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grades"] });
    },
  });
}
