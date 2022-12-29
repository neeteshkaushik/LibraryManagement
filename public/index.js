console.log("Index.js called");
const isbnButton = document.getElementById("isbnBtn");
const bookDiv = document.getElementById("book");
const isbnInput = document.getElementById("isbn");

const isbnButtonCallBack = async (e) => {
  e.preventDefault();
  //   console.log(e.target);
  const isbn = isbnInput.value;
  //   console.log(isbn);
  const response = await fetch(`/api/v1/library/book/${isbn}`);
  const data = await response.json();
  const { book } = data;
  let element;
  if (!book) {
    const { msg } = data;
    element = `<h1>${msg}</h1>`;
  } else {
    element = `<h1>${book.title}</h1>
    <p>isbn : ${book.isbn}</p>
    <p>Authors : ${book.authors}</p>
    <h2>Description of book</h2>
    <p>${book.description}</p>`;
  }
  bookDiv.innerHTML = element;
};

isbnButton.addEventListener("click", isbnButtonCallBack);
