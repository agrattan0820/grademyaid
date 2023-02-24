// import router from "next/router";
// import { useQuery } from "@tanstack/react-query";
import { fetchSchoolNames, fetchSchools } from "../utils/school-queries";
import AsyncSelect from "react-select/async";
import { GroupBase, StylesConfig } from "react-select";

/** TYPES */
type Props = {
  /** onChange handler */
  handleChange: (...event: any[]) => void;
};

type SchoolOption = {
  /** Label shown within select */
  label: string;
  /** Value of option when selected */
  value: number;
};

const customStyles: StylesConfig<
  SchoolOption,
  false,
  GroupBase<SchoolOption>
> = {
  control: (provided) => ({
    ...provided,
    borderRadius: 9999,
    paddingLeft: ".25rem",
    paddingRight: ".25rem",
  }),
  menu: (provided) => ({
    ...provided,
    maxHeight: 250,
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: 250,
  }),
};

const SchoolSearch = ({ handleChange }: Props) => {
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

  return (
    <AsyncSelect
      loadOptions={handleInputChange}
      onChange={handleChange}
      defaultOptions
      instanceId={"school-search-instance"}
      placeholder="Search for a school..."
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary25: "#a7f3d0",
          primary: "#10b981",
        },
      })}
      styles={customStyles}
    />
  );
};

export default SchoolSearch;
