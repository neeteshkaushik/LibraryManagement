const express = require("express");
const {
  getBooksAndMagazines,
  getBookByisbn,
  getMagazineByisbn,
  getBookAndMagzinesByAuthorEmail,
  getSortedBooksAndMagazines,
  addBook,
  addMagazine,
} = require("../controllers/main");
const router = express.Router();

router.route("/").get(getBooksAndMagazines);
router.route("/booksMagsAuthor").get(getBookAndMagzinesByAuthorEmail);
router.route("/book/:isbn").get(getBookByisbn);
router.route("/magazine/:isbn").get(getMagazineByisbn);
router.route("/sorted").get(getSortedBooksAndMagazines);
router.route("/addBook").post(addBook);
router.route("/addMagazine").post(addMagazine);

module.exports = router;
