const express = require("express");
// to configure a route for this, we can create a route using the express.Router method
const cardRouter = express.Router();

// make the GET /card and POST /card endpoints
cardRouter
  .route("/card")
  .get((req, res) => {
    /* code not shown */
  })
  .post((req, res) => {
    /* code not shown */
  });
