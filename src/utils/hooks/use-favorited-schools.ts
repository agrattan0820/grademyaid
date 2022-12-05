import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import supabase from "../supabase";

/** GET favorite schools */
export const getFavoritedSchools = async (accountId: string) => {
  const { data, error } = await supabase
    .from("favorited_schools")
    .select()
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
  return useQuery(["favorited-schools"], () => getFavoritedSchools(accountId), {
    initialData: initialData,
  });
}

type FavoriteSchoolProps = {
  schoolId: number;
  accountId: string;
  schoolName: string;
  schoolUrl: string;
};

/** GET favorite school */
export const getFavoriteSchoolById = async (
  schoolId: number,
  accountId: string
) => {
  const { data, error } = await supabase
    .from("favorited_schools")
    .select()
    .eq("school_id", schoolId)
    .eq("account_id", accountId)
    .single();

  // If the error isn't that there are no rows returned, throw an error
  if (error && error.code !== "PGRST116") {
    throw new Error(error.message);
  }

  return data;
};

/** POST favorite school */
export const favoriteSchool = async ({
  schoolId,
  accountId,
  schoolName,
  schoolUrl,
}: FavoriteSchoolProps) => {
  const { data, error } = await supabase
    .from("favorited_schools")
    .insert({
      school_id: schoolId,
      account_id: accountId,
      school_name: schoolName,
      school_url: schoolUrl,
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

/** HOOK post calculated grade */
export function useFavoriteSchoolMutation() {
  const queryClient = useQueryClient();
  return useMutation((data: FavoriteSchoolProps) => favoriteSchool(data), {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorited_schools"],
      });
    },
  });
}

type DeleteFavoriteSchoolProps = {
  schoolId: number;
  accountId: string;
};

/** DELETE saved grade by id */
export const deleteFavoritedSchool = async ({
  schoolId,
  accountId,
}: DeleteFavoriteSchoolProps) => {
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

/** HOOK post calculated grade */
export function useDeleteFavoriteSchoolMutation() {
  const queryClient = useQueryClient();
  return useMutation(
    (data: DeleteFavoriteSchoolProps) => deleteFavoritedSchool(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["favorited_schools"],
        });
      },
    }
  );
}
