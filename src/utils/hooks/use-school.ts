import { useQuery } from "@tanstack/react-query";
import { fetchSchoolById } from "../school-queries";

/** HOOK get school from College Scorecard API */
export function useSchool(schoolId: number) {
  return useQuery(["school", schoolId], () => fetchSchoolById(schoolId));
}
