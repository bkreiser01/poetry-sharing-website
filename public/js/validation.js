/**
 *  Public Validation Methods for the client.
 *  These methods are also imported by the server side validation methods so the code is common
 */

const validationMethods = {
  
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
  /**
   * Validate keys in an object
   * 
   * @param {Object} obj 
   * @param {Array} keys 
   * @returns an array of all the keys from 'keys' that are not in 'obj'
   */
  checkObjKeys(obj, keys) {
    const objKeys = Object.keys(obj);
    const missingKeys = keys.filter(key => !objKeys.includes(key));
    return missingKeys;
  },
  /**
   * Validate the username
   * 
   * @param {string} username
   * @returns the valid username string
   */
  checkUsername(username) {
    username = this.checkString(username)

    // Usernames should be between 3-50 chars
    if (username.length < 3 || username.length > 50) {
      throw new Error("Username must be between 3-50 characters long")
    }
    return username
  },

  /**
   * Validate the email address
   * 
   * @param {string} email 
   * @returns the valid email address string
   */
  checkEmail(email) {
    email = this.checkString(email)

    // Regex to validate an email
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      throw new Error ('Email is not a valid email address')
    }
    return email
  },

  /**
   * Validate the password
   * 
   * @param {string} password 
   * @returns the valid password string
   */
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
      throw new Error('Password is not a valid password')
    }

    return password
  },

  /**
   * Validate the privacy
   * 
   * @param {string} privacy 
   * @returns the valid privacy string
   */
  checkPrivacy(privacy) {
    privacy = this.checkString(privacy)

    // Privacy is either public or private
    if (privacy != "public" && privacy != "private") {
      throw new Error("Privacy must be public or private")
    }
    return privacy
  },
  /**
   * Validate the register fields
   * 
   * @param {Object} obj - the user object to validate, this does not include the ObjectId
   * @returns the validated register fields
   */
  checkRegisterFields(obj) {

    // User objects must have the 4 needed keys
    if (this.checkObjKeys(obj, ["username", "email", "password", "privacy"]).length != 0) {
      throw new Error("Missing required fields")
    }

    // Validate the fields
    obj.username = this.checkUsername(obj.username)
    obj.email = this.checkEmail(obj.email)
    obj.password = this.checkPassword(obj.password)
    obj.privacy = this.checkPrivacy(obj.privacy)

    return obj
  },

  /**
   * Validate the login fields
   * 
   * @param {Object} obj - the login fields to validate
   * @returns the validated login fields
   */
  checkLoginFields(obj) {
    // User objects must have the 2 needed keys
    if (this.checkObjKeys(obj, ["username", "password"]).length != 0) {
      throw new Error("Missing required fields")
    }

    // Validate the fields
    try {
      obj.username = this.checkUsername(obj.username)
      obj.password = this.checkPassword(obj.password)
    } catch (e) {
      throw new Error("Invalid login fields provided")
    }

    return obj
  },
}

export default validationMethods