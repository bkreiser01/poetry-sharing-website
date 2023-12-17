// Amalgamate routes here!
import auth from "./auth.js";
import user from "./user.js";
import home from "./home.js";
import poemRoutes from "./poems.js";
import popularRoute from "./popular.js";
import commentRoutes from "./comments.js"
import tags from "./tags.js";
import search from "./search.js"

const constructorMethod = (app) => {
   app.use("/", auth);
   app.use("/", home);
   app.use("/user", user);
   app.use("/poems", poemRoutes);
   app.use("/tags", tags);
   app.use("/popular", popularRoute);
   app.use("/", commentRoutes);
   app.use("/search", search);

   app.use("*", (req, res) => {
      res.status(404).render("error", {
         title: "Error",
         error: " 404 Not Found",
      });
   });
};

export default constructorMethod;
