// import router from "next/router";
import { useQuery } from "@tanstack/react-query";
import { fetchSchoolNames } from "../utils/queries";
import AsyncSelect from "react-select/async";

const SchoolSearch = () => {
  const schoolNameQuery = useQuery({
    queryKey: ["inst-names"],
    queryFn: fetchSchoolNames,
  });

  const schoolNameData = schoolNameQuery.data?.data;
  const out = JSON.stringify(schoolNameData, null, 2);

  return (
    <div>
      <AsyncSelect />
      <pre>{out}</pre>
    </div>
  );
};

export default SchoolSearch;
