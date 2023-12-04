import { users } from '../config/mongoCollections.js'
import validation from '../helpers/validation.js'
import bcrypt from 'bcryptjs';
const saltRounds = 16;

const exportedMethods = {
    async registerUser (
        username,
        email,
        password,
        privacy
    ) {
        // All fields must be supplied
        if (!username || !email || !password || !privacy) {
            throw new Error("All fields must be supplied!")
        }
        
        // Validate all inputs
        username = validation.checkUsername(username)
        email = validation.checkEmail(email)
        password = validation.checkPassword(password)
        privacy = validation.checkPrivacy(privacy)

        // Username or Email should not already be in use
        let userCollection = await users();
        let userWithUsername = await userCollection.findOne({ username: username });
        let userWithEmail = await userCollection.findOne({ email: email });

        if (userWithUsername) {
            throw new Error(`'${username}' is already in use`);
        } else if (userWithEmail) {
            throw new Error(`'${email}' is already in use`);
        }

        // Password must be hashed
        password = await bcrypt.hash(password, saltRounds)

        let newUser = {
            username: username,
            email: email,
            hashedPassword: password,
            timeAccountMade: new Date().toUTCString()
        }

        return newUser
    }
}
export default exportedMethods;

console.log(await exportedMethods.registerUser(
    "bkreiser",
    "bkreiser@duck.com",
    "Password@123",
    "public"
))