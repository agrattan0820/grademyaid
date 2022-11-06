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

  const userInput: string[] = ["pitt"];

  function handleInputChange(input: string) {
    const replaced = input.split(" ").join("%20");
    userInput.push(replaced);
    userInput.shift();
    const query = fetchSchoolNames(userInput[userInput.length - 1]);
    query.then(function (result) {
      const schoolNameData = result.data.results;
      const optionsArray: SchoolOption[] = [];
      if (schoolNameData) {
        schoolNameData.forEach((school: any, i: number) => {
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

  return (
    <div>
      <Select options={schoolNames} onInputChange={handleInputChange} />
      {/* <pre>{out}</pre> */}
    </div>
  );
};

export default SchoolSearch;
