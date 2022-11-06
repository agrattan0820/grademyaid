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

  const userInput: string[] = ["new york"];

  function handleInputChange(input: string) {
    const replaced = input.split(" ").join("%20");
    userInput.push(replaced);
    userInput.shift();

    // console.log(userInput);
    // console.log(userInput[userInput.length - 1]);
  }
  const schoolNameQuery = useQuery(["inst-names"], () =>
    fetchSchoolNames(userInput[userInput.length - 1])
  );

  // const handleInputChange = (input: string) => {
  //   // eslint-disable-next-line react-hooks/rules-of-hooks
  //

  //   console.log(input);
  // };

  useEffect(() => {
    const schoolNameData = schoolNameQuery.data?.data["results"];
    const optionsArray: SchoolOption[] = [];
    if (schoolNameData) {
      schoolNameData.forEach((school: any, i: number) => {
        const newObject = {
          label: schoolNameData[i]["school.name"],
          value: schoolNameData[i].id,
        };
        // console.log(newObject);
        optionsArray.push(newObject);
      });
      setSchoolNames(optionsArray);
    }
  }, [schoolNameQuery.data?.data]);

  return (
    <div>
      <Select options={schoolNames} onInputChange={handleInputChange} />
      {/* <pre>{out}</pre> */}
    </div>
  );
};

export default SchoolSearch;
