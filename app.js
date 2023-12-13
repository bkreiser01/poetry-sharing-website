import express from "express";
const app = express();
import session from 'express-session';
import configRoutes from './routes/index.js';
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import exphbs from 'express-handlebars';
import middlewares from './middlewares/index.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const staticDir = express.static(__dirname + "/public");

app.use(
  session({
    name: 'AuthState',
    secret: "M6Mn#APSxDX#MNaWqSD#StafG",
    saveUninitialized: false,
    resave: false,
    cookie: {maxAge: 60000}
  })
);

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  // If the user posts to the server with a property called _method, rewrite the request's method
  // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
  // rewritten in this middleware to a PUT route
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }

  // let the next middleware run:
  next();
};

app.use("/public", staticDir);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);

app.engine(
  "handlebars",
  exphbs.engine({ defaultLayout: "default", partialsDir: ["views/partials/"] })
);
app.set("view engine", "handlebars");

app.use(
  session({
    name: 'AuthState',
    secret: "M6Mn#APSxDX#MNaWqSD#StafG",
    saveUninitialized: false,
    resave: false,
    cookie: {maxAge: 60000}
  })
);
// Add the middlewares
Object.values(middlewares).forEach((middleware) => {
  app.use(middleware);
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost/:3000');
});
