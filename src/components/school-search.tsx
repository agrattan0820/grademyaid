// import router from "next/router";
// import { useQuery } from "@tanstack/react-query";
import {
  fetchSchoolNames,
  fetchSchoolById,
  fetchSchools,
} from "../utils/queries";
import AsyncSelect from "react-select/async";
import { SingleValue } from "react-select";

const SchoolSearch = () => {
  type SchoolOption = {
    label: string;
    value: number;
  };

  async function handleInputChange(input: string) {
    let result;
    if (!input) {
      result = await fetchSchools();
    } else {
      result = await fetchSchoolNames(input);
    }
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
    }
    return optionsArray;
  }

  function handleSelection(selection: SingleValue<SchoolOption>) {
    if (selection) {
      fetchSchoolById(selection["value"]).then(function (result) {
        const idData = result.data.results[0];
        console.log(idData);
      });
    }
  }

  return (
    <div>
      <AsyncSelect
        loadOptions={handleInputChange}
        onChange={handleSelection}
        defaultOptions
        instanceId={"school-search-instance"}
      />
    </div>
  );
};

export default SchoolSearch;
