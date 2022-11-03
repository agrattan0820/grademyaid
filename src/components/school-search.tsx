// import router from "next/router";
import { useQuery } from "@tanstack/react-query";
import { fetchSchoolNames } from "../utils/queries";
import Select from "react-select";
import { useEffect, useState } from "react";

const SchoolSearch = () => {
  type SchoolOption = {
    label: string;
    value: number;
  };
  const [schoolNames, setSchoolNames] = useState<SchoolOption[]>([]);

  const schoolNameQuery = useQuery({
    queryKey: ["inst-names"],
    queryFn: fetchSchoolNames,
  });

  // const out = JSON.stringify(schoolNameData, null, 2);
  useEffect(() => {
    const schoolNameData = schoolNameQuery.data?.data["results"];
    // console.log(schoolNameData);
    const optionsArray: SchoolOption[] = [];
    if (schoolNameData) {
      // console.log(schoolNameData);
      schoolNameData.forEach((school: any, i: number) => {
        // console.log(schoolNameData["school.name"]);
        const newObject = {
          label: schoolNameData[i]["school.name"],
          value: schoolNameData[i].id,
        };
        // console.log(newObject);
        optionsArray.push(newObject);
      });
      setSchoolNames(optionsArray);
    }
  }, [schoolNameQuery]);

  return (
    <div>
      <Select options={schoolNames} />
      {/* <pre>{out}</pre> */}
    </div>
  );
};

export default SchoolSearch;
