const exp = require("express");
const bP = require("body-parser");
const userRoutes = require("./endpoints/users");
const authRoutes = require("./endpoints/auth");
const gitRoutes = require("./endpoints/git");

const app = exp();
const { API_VERSION } = require("./config");
const allowedOrigins = ["http://localhost:3000"];

app.use(bP. urlencoded({ extended: false }));
app.use(bP.json());
app.use(function(req, res, next) {
  let origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin); // restrict it to the required domain
  }

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(`/api/${API_VERSION}`, userRoutes);
app.use(`/api/${API_VERSION}`, authRoutes);
app.use(`/api/${API_VERSION}/git`, gitRoutes);


module.exports = app;
