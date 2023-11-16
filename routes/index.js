// Amalgamate routes here!
const constructorMethod = (app) => {
    app.use('*', (req, res) => {
      res.status(404).render("error",{title: "Error", error:" 404 Not Found"});
    });
  };
  
  export default constructorMethod;