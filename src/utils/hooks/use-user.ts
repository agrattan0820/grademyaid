import { useQuery } from "@tanstack/react-query";
import supabase from "../supabase";

const getUser = async () => {
  const user = await supabase.auth.getUser();

  if (user.data.user?.id) {
    const { data, error } = await supabase
      .from("account")
      .select()
      .eq("id", user.data.user?.id)
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

export default function useUser() {
  return useQuery(["user"], () => getUser());
}
