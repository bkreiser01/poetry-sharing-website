import { ObjectId } from "mongodb";
import publicValidation from "../public/js/validation.js";
import validUrl from "valid-url";

const exportedMethods = {
   // Import the validation methods from public/js/validation.js
   ...publicValidation,

   checkId(id, varName) {
      // TODO: Check if object is in a collection
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

   checkStringArray(arr, varName) {
      //We will allow an empty array for this,
      //if it's not empty, we will make sure all tags are strings
      if (!arr || !Array.isArray(arr)) {
         throw new Error(`You must provide an array of ${varName}`);
      }
      for (let i in arr) {
         if (typeof arr[i] !== "string" || arr[i].trim().length === 0) {
            throw new Error(
               `One or more elements in ${varName} array is not a string or is an empty string`
            );
         }
      }
      return bool;
   },

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

  /**
   * Validate the taggedPoem object
   * 
   * @param {Object} tp 
   */
  checkTaggedPoem(obj) {
    // tagged poems must have 2 keys
    if (Object.keys(obj).length != 3) {
      throw new Error('A taggedPoem object must have 2 keys')
    }

    // tagged poems must have the following keys
    //    poemId, tagIds
    let missingKeys = this.checkObjKeys(obj, ["_id", "poemId", "tagIds"])
    if (missingKeys.length != 0) {
      throw new Error(`The taggedPoem object is missing the key(s) ${missingKeys}`)
    }

    // TODO: the object ID's inside the tagged poems should all be validated
    return obj
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

   /**
    * Checks if a tagString is valid (no spaces), also makes it lowercase
    *
    * @param {string} strVal
    * @param {string} varName
    */
   checkTagString(strVal, varName) {
      strVal = exportedMethods.checkString(strVal, varName);
      strVal = strVal.toLowerCase();
      if (/\s/g.test(strVal)) {
         throw new Error(`Error: ${varName} must not have white space`);
      }
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
