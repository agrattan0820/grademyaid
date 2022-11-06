// import router from "next/router";
// import { useQuery } from "@tanstack/react-query";
import { fetchSchoolNames } from "../utils/queries";
import Select from "react-select";
import { useState } from "react";

const SchoolSearch = () => {
  type SchoolOption = {
    label: string;
    value: number;
  };
  const [schoolNames, setSchoolNames] = useState<SchoolOption[]>([]);

  function handleInputChange(input: string) {
    fetchSchoolNames(input).then(function (result) {
      const schoolNameData = result.data.results;
      const optionsArray: SchoolOption[] = [];
      if (schoolNameData) {
        schoolNameData.forEach((school: unknown, i: number) => {
          const newObject = {
            label: schoolNameData[i]["school.name"],
            value: schoolNameData[i].id,
          };
          optionsArray.push(newObject);
        });
        setSchoolNames(optionsArray);
      }
    });
  }

  function handleSelection(selection: unknown) {
    console.log(selection);
  }

  return (
    <div>
      <Select
        options={schoolNames}
        onInputChange={handleInputChange}
        onChange={handleSelection}
      />
    </div>
  );
};

export default SchoolSearch;
