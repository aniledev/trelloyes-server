const express = require("express");
const { v4: uuid } = require("uuid");
// to configure a route for this, we can create a route using the express.Router method
const cardRouter = express.Router();
// specific that we will need a JSON body parser
const bodyParser = express.json();

//MIDDLE WARE
app.use(express.json());

const cards = [
  {
    id: 1,
    title: "Task One",
    content: "This is card one",
  },
  {
    id: 2,
    title: "Task One",
    content: "This is card one",
  },
];

// make the GET /card and POST /card endpoints
cardRouter
  .route("/card")
  .get((req, res) => {
    res.json(cards);
  })
  .post((req, res) => {
    // get the data from the body
    const { title, content } = req.body;

    //validate that both the title and content exist
    if (!title) {
      logger.error(`Title is required`);
      return res.status(400).send("Invalid data");
    }

    if (!content) {
      logger.error(`Content is required`);
      return res.status(400).send("Invalid data");
    }

    // if title and content both exist, generate an ID and push a card object into the array
    const id = uuid();

    const card = {
      id,
      title,
      content,
    };

    cards.push(card);

    logger.info(`Card with id ${id} created`);

    res.status(201).location(`http://localhost:8000/card/${id}`).json(card);
  });

// make the GET /card/:id and DELETE /card/:id endpoints
cardRouter
  .route("/card/:id")
  .get((req, res) => {
    // move implementation logic into here
  })
  .delete((req, res) => {
    // move implementation logic into here
  });

module.exports = cardRouter;
