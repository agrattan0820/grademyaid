import supabase from "../supabase";

type PostGradeProps = {
  gradeId: number;
  accountId: string;
};

export const saveGrade = async ({ gradeId, accountId }: PostGradeProps) => {
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
