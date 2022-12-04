import { useQuery } from "@tanstack/react-query";
import supabase from "../supabase";

/** GET favorite schools */
export const getFavoritedSchools = async (accountId: string) => {
  const { data, error } = await supabase
    .from("favorited_schools")
    .select("*")
    .eq("account_id", accountId);

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Saved grade not found");
  }
  return data;
};

/** HOOK get favorite schools */
export function useFavoritedSchools(accountId: string, initialData?: any) {
  return useQuery(
    ["favorited-schools", accountId],
    () => getFavoritedSchools(accountId),
    {
      initialData: initialData,
    }
  );
}

type FavoriteSchoolProps = {
  schoolId: number;
  accountId: string;
};

/** POST favorite school */
export const favoriteSchool = async ({
  schoolId,
  accountId,
}: FavoriteSchoolProps) => {
  const { data, error } = await supabase
    .from("favorited_schools")
    .insert({
      school_id: schoolId,
      account_id: accountId,
    })
    .select()
    .single();

  if (error) {
    console.log("Error", error);
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("School not favorited");
  }
  return data;
};

/** DELETE saved grade by id */
export const deleteFavoritedSchool = async (
  schoolId: number,
  accountId: string
) => {
  const { data, error } = await supabase
    .from("favorited_schools")
    .delete()
    .eq("account_id", accountId)
    .eq("school_id", schoolId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
