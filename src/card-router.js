const express = require("express");
const { v4: uuid } = require("uuid");
const logger = require("./logger");
const { cards, lists } = require("./store");
// to configure a route for this, we can create a route using the express.Router method
const cardRouter = express.Router();
// specific that we will need a JSON body parser
const bodyParser = express.json();

//MIDDLE WARE
app.use(express.json());

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
    const { id } = req.params;
    const card = cards.find((c) => c.id == id);

    // make sure we found a card
    if (!card) {
      logger.error(`Card with id ${id} not found.`);
      return res.status(404).send("Card Not Found");
    }

    res.json(card);
  })
  .delete((req, res) => {
    const { id } = req.params;

    const cardIndex = cards.findIndex((c) => c.id == id);

    // and index of -1 means that there is no match; it does not exist in the array
    if (cardIndex === -1) {
      logger.error(`Card with id ${id} not found.`);
      return res.status(404).send("Not found");
    }

    //remove card from lists
    //assume cardIds are not duplicated in the cardIds array
    lists.forEach((list) => {
      const cardIds = list.cardIds.filter((cid) => cid !== id);
      list.cardIds = cardIds;
    });

    cards.splice(cardIndex, 1);

    logger.info(`Card with id ${id} deleted.`);

    res.status(204).end();
  });

module.exports = cardRouter;
