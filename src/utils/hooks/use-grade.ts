import { useQuery } from "@tanstack/react-query";
import { Database } from "../database.types";
import supabase from "../supabase";

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

export function useGrade(
  gradeId: number,
  initialData?: Database["public"]["Tables"]["grade"]["Row"]
) {
  return useQuery(["grade", gradeId], () => getGrade(gradeId), {
    initialData: initialData,
  });
}
