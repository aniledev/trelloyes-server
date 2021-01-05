// IMPORT AND CONFIGURE REQUIRED LIBRARIES AND SECURITY PACKAGES
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const winston = require("winston");
const { v4: uuid } = require("uuid");
const { NODE_ENV, PORT } = require("./config");

const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "dev";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: "info.log" })],
});

if (NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

//STANDARD MIDDLEWARE
app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(express.json());

//ADD AUTHORIZATION HEADER AND API TOKEN MIDDLEWARE
app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get("Authorization");

  if (!authToken || authToken.split(" ")[1] !== apiToken) {
    logger.error(`Unauthorized request to path: ${req.path}`);
    return res.status(401).json({ error: "Unauthorized request" });
  }
  // move to the next middleware
  next();
});

//STORE DATA IN PLACE OF DATABASE
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
const lists = [
  {
    id: 1,
    header: "List One",
    cardIds: [1],
  },
  {
    id: 2,
    header: "List One",
    cardIds: [2],
  },
];

//ROUTES
app.get("/card", (req, res) => {
  res.json(cards);
});

app.get("/card/:id", (req, res) => {
  const { id } = req.params;
  const card = cards.find((c) => c.id == id);

  // make sure we found a card
  if (!card) {
    logger.error(`Card with id ${id} not found.`);
    return res.status(404).send("Card Not Found");
  }

  res.json(card);
});

app.get("/list", (req, res) => {
  res.json(lists);
});

app.get("/list/:id", (req, res) => {
  const { id } = req.params;
  const list = lists.find((li) => li.id == id);

  // make sure we found a list
  if (!list) {
    logger.error(`List with id ${id} not found.`);
    return res.status(404).send("List Not Found");
  }

  res.json(list);
});

app.post("/card", (req, res) => {
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

app.delete("/list/:id", (req, res) => {
  const { id } = req.params;

  const listIndex = lists.findIndex((li) => li.id == id);

  if (listIndex === -1) {
    logger.error(`List with id ${id} not found.`);
    return res.status(404).send("Not Found");
  }

  lists.splice(listIndex, 1);

  logger.info(`List with id ${id} deleted.`);
  res.status(204).end();
});

// CATCH ANY THROWN ERRORS AND THEN DEFINE THE ERROR AND KEEP THE APPLICATION RUNNING;
//STILL MIDDLEWARE
app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

//PIPELINE ENDS
module.exports = app;
