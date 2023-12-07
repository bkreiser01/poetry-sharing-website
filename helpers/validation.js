import { ObjectId } from "mongodb";
import validUrl from "valid-url";

const exportedMethods = {
   checkBool(bool, varName) {
      if (typeof bool === "undefined")
         throw new Error(`Error: You must provide a ${varName}`);
      if (typeof bool !== "boolean") {
         throw new Error(`${varName} must be a Boolean`);
      }
      return bool;
   },

   checkDate(date, varName) {
      if (!date) throw new Error(`Error: You must provide a ${varName}`);
      if (typeof date !== "object")
         throw new Error(`Error: ${varName} must be a date object`);
      if (!date instanceof Date)
         throw new Error(`Error: ${varName} must be a date object`);
      return date;
   },

   checkUrl(url, varName) {
      if (!url) throw new Error(`Error: You must provide a ${varName}`);
      url = this.checkString(url, varName);
      if (validUrl.isWebUri(url) === undefined) {
         throw new Error(`Error: ${varName} must be a valid url`);
      }
      return url;
   },

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

   checkNumber(num, varName) {
      if (typeof num === "undefined")
         throw new Error(`Error: You must provide a ${varName}`);
      if (typeof num !== "number")
         throw new Error(`Error: ${varName} must be a number`);
      if (isNaN(num)) {
         throw new Error(`Error: ${varName} is NaN`);
      }
      return num;
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

   checkDateString(date, varName) {
      date = this.checkString(date, varName);
      if (isNaN(new Date(date)))
         throw new Error(`Error: ${varName} is not a valid Date`);
      return date;
   },
};

export default exportedMethods;

console.log(exportedMethods.checkTaggedPoem({poemId: "", tagIds: ""}))