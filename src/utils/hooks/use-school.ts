import { useQuery } from "@tanstack/react-query";
import { fetchSchoolById } from "../queries";

/** HOOK get school from College Scorecard API */
export function useSchool(schoolId: number, initialData?: any) {
  return useQuery(["school", schoolId], () => fetchSchoolById(schoolId), {
    initialData: initialData,
  });
}
