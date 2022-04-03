const mongoose = require("mongoose");
const app = require("./app");
const { API_VERSION, PORT, PORT_DB, URL_SERVER_MONGO, NAME_DB, URL_SERVER } = require("./config");

mongoose.connect(
  `mongodb://${URL_SERVER_MONGO}:${PORT_DB}/${NAME_DB}`,
  { useNewUrlParser: true },
  (err, res) => {
    if (err) {
      throw err;
    } else {
      app.listen(
        PORT,
        () => {
          console.log('··············');
          console.log('·API INICIADA·');
          console.log('··············');
          console.log(`·· URL = http://${URL_SERVER}:${PORT}/api/${API_VERSION} ··`);
        }
      )
    }
  }
);