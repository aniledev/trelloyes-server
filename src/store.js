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
  {
    id: 3,
    title: "Task One",
    content: "This is card one",
  },
];

const lists = [
  {
    id: 1,
    header: "List One",
    cardIds: [1, 3],
  },
  {
    id: 2,
    header: "List Two ",
    cardIds: [2],
  },
];

module.exports = { cards, lists };
