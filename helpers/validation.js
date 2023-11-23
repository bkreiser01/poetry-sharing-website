import { ObjectId } from "mongodb";

const exportedMethods = {
  checkId(id, varName) {
    if (!id) throw new Error(`Error: You must provide a ${varName}`);
    if (typeof id !== "string")
      throw new Error(`Error: ${varName} must be a string`);
    id = id.trim();
    if (id.length === 0)
      throw new Error(
        `Error: ${varName} cannot be an empty string or just spaces`
      );
    if (!ObjectId.isValid(id))
      throw new Error(`Error: ${varName} invalid ObjectId`);
    return id;
  },

  checkString(strVal, varName) {
    if (!strVal) throw new Error(`Error: You must supply a ${varName}!`);
    if (typeof strVal !== "string")
      throw new Error(`Error: ${varName} must be a string!`);
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw new Error(
        `Error: ${varName} cannot be an empty string or string with just spaces`
      );
    if (!isNaN(strVal))
      throw new Error(
        `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`
      );
    return strVal;
  },

  checkStringArray(arr, varName) {
    //We will allow an empty array for this,
    //if it's not empty, we will make sure all tags are strings
    if (!arr || !Array.isArray(arr))
      throw new Error(`You must provide an array of ${varName}`);
    for (let i in arr) {
      if (typeof arr[i] !== "string" || arr[i].trim().length === 0) {
        throw new Error(
          `One or more elements in ${varName} array is not a string or is an empty string`
        );
      }
      arr[i] = arr[i].trim();
    }

    return arr;
  },
};

export default exportedMethods;
