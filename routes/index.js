// Amalgamate routes here!
import routes from './routing.js'
import auth from './authentication.js'

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