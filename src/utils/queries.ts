import axios from "axios";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const collegeScorecardURL =
  "https://api.data.gov/ed/collegescorecard/v1/schools.json";

/** GET: Schools */
export const fetchSchools = () =>
  axios.get(collegeScorecardURL, {
    params: {
      "school.degrees_awarded.predominant": "2,3",
      fields: "id,school.name,2020.student.size",
      api_key: process.env.NEXT_PUBLIC_COLLEGE_SCORECARD_API_KEY,
    },
  });

export const fetchSchoolNames = (input: string) =>
  axios.get(
    `https://api.data.gov/ed/collegescorecard/v1/schools.json?&school.name=${input}`,
    {
      params: {
        per_page: 20,
        fields: "id,school.name",
        api_key: process.env.NEXT_PUBLIC_COLLEGE_SCORECARD_API_KEY,
      },
    }
  );
