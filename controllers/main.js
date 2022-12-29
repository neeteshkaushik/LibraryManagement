const fs = require("fs");
const { unlink } = require("fs").promises;
const { parse } = require("csv-parse");

//data structure to store books and magazines from respective csv file
let magazines = [];
let books = [];

async function readMagazines() {
  const parser = parse({ delimiter: ";", from_line: 2 });
  fs.createReadStream("./Magazines.csv").pipe(parser);
  for await (const row of parser) {
    const magazine = {
      title: row[0],
      isbn: row[1],
      authors: row[2],
      publishedAt: row[3],
    };
    magazines.push(magazine);
  }
}
async function readBooks() {
  const parser = parse({ delimiter: ";", from_line: 2 });
  fs.createReadStream("./Books.csv").pipe(parser);
  for await (const row of parser) {
    const book = {
      title: row[0],
      isbn: row[1],
      authors: row[2],
      description: row[3],
    };
    books.push(book);
  }
}

//fetches books and magazines and store them in respective list
(async () => {
  await readMagazines();
  await readBooks();
})();

const getBooksAndMagazines = async (req, res) => {
  res.status(200).json({ books, magazines });
};

const getBookByisbn = async (req, res) => {
  const isbn = req.params.isbn;
  const book = books.find((b) => b.isbn === isbn);
  if (!book) res.status(404).json({ msg: `No book with isbn ${isbn}` });
  else res.status(200).json({ book });
};

const getMagazineByisbn = async (req, res) => {
  const isbn = req.params.isbn;
  const magazine = magazines.find((m) => m.isbn === isbn);
  if (!magazine) res.status(404).json({ msg: `No magazine with isbn ${isbn}` });
  else res.status(200).json({ magazine });
};

const getBookAndMagzinesByAuthorEmail = async (req, res) => {
  const email = req.query.email;
  if (!email)
    return res.status(400).json({ msg: "please provide author email" });
  const booksWithAuth = books.find((b) => b.authors.includes(email));
  const magazinesWithAuth = magazines.find((m) => m.authors.includes(email));

  res
    .status(200)
    .json({ books: booksWithAuth || [], magazines: magazinesWithAuth || [] });
};

const getSortedBooksAndMagazines = async (req, res) => {
  let allItems = [...books, ...magazines];
  allItems = allItems.sort((a, b) => (b.title < a.title ? 1 : -1));

  res.status(200).json(allItems);
};

const addBook = async (req, res) => {
  try {
    await unlink("./newBooks.csv");
  } catch (error) {
    console.log(error);
  }

  const { bookToAdd } = req.body;
  if (
    !bookToAdd ||
    !bookToAdd.isbn ||
    !bookToAdd.title ||
    !bookToAdd.authors ||
    !bookToAdd.description
  )
    return res.status(400).json({ msg: "Please provide valid book to add" });

  fs.writeFileSync("./newBooks.csv", "title;isbn;authors;description\n", {
    flag: "a",
  });
  books.push(bookToAdd);
  books.forEach((b) => {
    const line =
      b.title + ";" + b.isbn + ";" + b.authors + ";" + b.description + "\n";
    fs.writeFileSync("./newBooks.csv", line, { flag: "a" });
  });

  res.status(201).send({ msg: "Book added" });
};

const addMagazine = async (req, res) => {
  try {
    await unlink("./newMagazines.csv");
  } catch (error) {
    console.log(error);
  }

  const { magazineToAdd } = req.body;
  if (
    !magazineToAdd ||
    !magazineToAdd.isbn ||
    !magazineToAdd.title ||
    !magazineToAdd.authors ||
    !magazineToAdd.publishedAt
  )
    return res
      .status(400)
      .json({ msg: "Please provide a valid magazine to add" });

  magazines.push(magazineToAdd);

  fs.writeFileSync("./newMagazines.csv", "title;isbn,authors,publishedAt\n", {
    flag: "a",
  });

  magazines.forEach((m) => {
    const line =
      m.title + ";" + m.isbn + ";" + m.authors + ";" + m.publishedAt + "\n";
    fs.writeFileSync("./newMagazines.csv", line, { flag: "a" });
  });

  res.status(201).send({ msg: "Magazine added" });
};

module.exports = {
  getBooksAndMagazines,
  getBookByisbn,
  getMagazineByisbn,
  getBookAndMagzinesByAuthorEmail,
  getSortedBooksAndMagazines,
  addBook,
  addMagazine,
};
