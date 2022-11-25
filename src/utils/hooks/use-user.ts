import { useQuery } from "@tanstack/react-query";
import supabase from "../supabase";

const getUser = async (userId: string | undefined) => {
  if (userId) {
    const { data, error } = await supabase
      .from("account")
      .select()
      .eq("id", userId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error("User not found");
    }

    return data;
  }

  return undefined;
};

export default async function useUser() {
  const user = await supabase.auth.getUser();
  return useQuery(["user"], () => getUser(user?.data.user?.id), {
    enabled: !!user.data.user?.id,
  });
}
