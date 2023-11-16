// Amalgamate routes here!
<<<<<<< HEAD
import routes from './routing.js'
import auth from './auth.js'

const constructorMethod = (app) => {
  app.use('/', routes);
  app.use('/', auth);

  app.use('*', (req, res) => {
    res.status(404).render("error",{
      title: "Error", error:" 404 Not Found"
    });
  });
};
  
export default constructorMethod;
=======
import poemRoutes from "./poems.js"

const constructorMethod = (app) => {
   app.use('/poems',  poemRoutes);
};
>>>>>>> 73d3344 (preliminary data functions and routing for poems)
