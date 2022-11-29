import { useQuery } from "@tanstack/react-query";
import { fetchSchoolById } from "../queries";

export function useSchool(schoolId: number, initialData?: any) {
  return useQuery(["school", schoolId], () => fetchSchoolById(schoolId), {
    initialData: initialData,
  });
}
