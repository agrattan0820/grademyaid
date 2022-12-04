import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LocationType } from "../calculate-score";
import supabase from "../supabase";


type PostGradeProps = {
    gradeId: number;
    accountId: number;
  };

export const saveGrade = async ({
    gradeId,
    accountId,
  }: PostGradeProps) => {
    const { data, error } = await supabase
      .from("saved_grades")
      .insert({
        grade_id: gradeId,
        account_id: accountId,
      })
      .select()
      .single();
  
    if (error) {
      console.log("error heree!!!!!", error)
      throw new Error(error.message);
    }
  
    if (!data) {
      throw new Error("Grade not found");
    }
    return data;
  };