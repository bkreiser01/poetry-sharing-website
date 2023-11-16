// Amalgamate routes here!
import routes from './routing.js'

const constructorMethod = (app) => {
  app.use('/', routes);

  app.use('*', (req, res) => {
    res.status(404).render("error",{title: "Error", error:" 404 Not Found"});
  });
};
  
export default constructorMethod;