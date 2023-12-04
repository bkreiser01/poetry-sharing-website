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

  checkDateString(date, varName) {
    date = this.checkString(date, varName);
    if (isNaN(new Date(date)))
      throw new Error(`Error: ${varName} is not a valid Date`);
    return date;
  },

  checkUsername(username) {
    username = this.checkString(username)

    // Usernames should be between 3-50 chars
    if (username.length < 3 || username.length > 50) {
      throw new Error("Username must be between 3-50 characters long")
    }
    return username
  },

  checkEmail(email) {
    email = this.checkString(email)

    // Regex to validate an email
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      throw new Error ('Email is not a valid email address')
    }
    return email
  },

  checkPassword(password) {
    password = this.checkString(password)

    /**
     * Password Reqs
     * 1) At least one lowercase letter
     * 2) At least one uppercase letter
     * 3) At least one number
     * 4) At least one special character @$!%*?&
     */
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
      throw new Error('Email is not a valid email address')
    }

    return password
  },

  checkPrivacy(privacy) {
    privacy = this.checkString(privacy)

    // Privacy is either public or private
    if (privacy != "public" && privacy != "private") {
      throw new Error("Privacy must be public or private")
    }
    return privacy
  },
};

export default exportedMethods;
