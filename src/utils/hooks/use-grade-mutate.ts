import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LocationType } from "../calculate-score";
import supabase from "../supabase";

type PostGradeProps = {
  gradeNum: number;
  userId?: number;
  location: LocationType;
  aidAmount: number;
  schoolId: number;
};
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

export function useGradeMutation() {
  const queryClient = useQueryClient();
  return useMutation((data: PostGradeProps) => postGrade(data), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grades"] });
    },
  });
}
