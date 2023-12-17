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
      const missingKeys = keys.filter((key) => !objKeys.includes(key));
      return missingKeys;
   },
   /**
    * Validate the username
    *
    * @param {string} username
    * @returns the valid username string
    */
   checkUsername(username) {
      username = validationMethods.checkString(username, "username");

      // Usernames should be between 3-50 chars
      if (username.length < 3 || username.length > 50) {
         throw new Error("Username must be between 3-50 characters long");
      }
      return username;
   },

   /**
    * Validate the email address
    *
    * @param {string} email
    * @returns the valid email address string
    */
   checkEmail(email) {
      email = validationMethods.checkString(email, "email");

      // Regex to validate an email
      if (!/^\S+@\S+\.\S+$/.test(email)) {
         throw new Error("Email is not a valid email address");
      }
      return email;
   },

   /**
    * Validate the password
    *
    * @param {string} password
    * @returns the valid password string
    */
   checkPassword(password) {
      password = validationMethods.checkString(password, "password");

    /**
     * Password Reqs
     * 1) At least one lowercase letter
     * 2) At least one uppercase letter
     * 3) At least one number
     * 4) At least one special character @$!%*?&
     */
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
      throw new Error('Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character')
    }

      return password;
   },

   /**
    * Validate the privacy
    *
    * @param {string} privacy
    * @returns the valid privacy string
    */
   checkPrivacy(privacy) {
      privacy = validationMethods.checkString(privacy, "privacy setting");

      // Privacy is either public or private
      if (privacy != "public" && privacy != "private") {
         throw new Error("Privacy must be public or private");
      }
      return privacy;
   },
   /**
    * Validate the register fields
    *
    * @param {Object} obj - the user object to validate, validationMethods does not include the ObjectId
    * @returns the validated register fields
    */
   checkRegisterFields(obj) {
      // User objects must have the 4 needed keys
      if (
         validationMethods.checkObjKeys(obj, [
            "username",
            "email",
            "password",
            "privacy",
         ]).length != 0
      ) {
         throw new Error("Missing required fields");
      }

      // Validate the fields
      obj.username = validationMethods.checkUsername(obj.username);
      obj.email = validationMethods.checkEmail(obj.email);
      obj.password = validationMethods.checkPassword(obj.password);
      obj.privacy = validationMethods.checkPrivacy(obj.privacy);

      return obj;
   },

   /**
    * Validate the login fields
    *
    * @param {Object} obj - the login fields to validate
    * @returns the validated login fields
    */
   checkLoginFields(obj) {
      // User objects must have the 2 needed keys
      if (
         validationMethods.checkObjKeys(obj, ["username", "password"]).length !=
         0
      ) {
         throw new Error("Missing required fields");
      }

      // Validate the fields
      try {
         obj.username = validationMethods.checkUsername(obj.username);
         obj.password = validationMethods.checkPassword(obj.password);
      } catch (e) {
         throw new Error("Invalid username or password");
      }

      return obj;
   },

   /**
    * Validate the title
    *
    * @param {string} title
    * @returns the validated title string
    */
   checkTitle(title) {
      if (typeof title !== "string")
         throw new Error(`Error: Title must be a string!`);
      title = title.trim();

      // Title should be between 0-1000 chars
      if (title === "") return title;
      if (title.length > 1000) {
         throw new Error("Title must be 1000 characters or less");
      }
      return title;
   },

   /**
    * Validate body
    * @param {string} body
    * @returns validated body string
    */
   checkBody(body) {
      body = validationMethods.checkString(body, "body");

      // Title should be between 1-100,000 chars
      if (body.length > 100000) {
         throw new Error("Body must be 100,000 characters or less");
      }
      return body;
   },

   /**
    * Validate a url
    * @param {string} linkStr
    * @returns validated url string
    */
   checkUrl(linkStr) {
      linkStr = this.checkString(linkStr, "link");
      try {
         const url = new URL(linkStr);
         return linkStr;
      } catch (e) {
         throw new Error(`Link must be a valid url`);
      }
   },

   /**
    * Validate a selected tag
    * @param {string} tagStr
    * @returns validated selected tag
    */
      checkTag(tagStr) {
         try {
            tagStr = validationMethods.checkString(tagStr, "tag");
         } catch (e) {
            throw new Error(`You must select a tag`)
         }
         return tagStr;
      },
};

export default validationMethods;
