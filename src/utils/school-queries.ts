import axios from "axios";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const collegeScorecardURL =
  "https://api.data.gov/ed/collegescorecard/v1/schools.json";

/** GET: Schools */
export const fetchSchools = () =>
  axios.get(collegeScorecardURL, {
    params: {
      per_page: 20,
      fields: "id,school.name",
      api_key: process.env.NEXT_PUBLIC_COLLEGE_SCORECARD_API_KEY,
      "school.degrees_awarded.predominant": [2, 3],
    },
  });

/** GET: School By Id */
export const fetchSchoolById = (schoolId: number) =>
  axios.get(collegeScorecardURL, {
    params: {
      id: schoolId,
      api_key: process.env.NEXT_PUBLIC_COLLEGE_SCORECARD_API_KEY,
    },
  });

/** GET: Schools according to search input */
export const fetchSchoolNames = (input: string) =>
  axios.get(collegeScorecardURL + `?&school.name=${input}`, {
    params: {
      per_page: 20,
      fields: "id,school.name",
      api_key: process.env.NEXT_PUBLIC_COLLEGE_SCORECARD_API_KEY,
    },
  });
