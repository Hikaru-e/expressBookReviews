const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
      return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  return res.status(200).json(books);
});

// Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject("Book not found");
    }
  })
  .then(book => {
    res.status(200).json(book);
  })
  .catch(error => {
    res.status(404).json({ message: error });
  });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter(book => book.author === author);

  if (booksByAuthor.length === 0) {
      return res.status(404).json({ message: "Books by this author not found" });
  }

  return res.status(200).json(booksByAuthor);
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const booksByTitle = Object.values(books).filter(book => book.title === title);

  if (booksByTitle.length === 0) {
      return res.status(404).json({ message: "Books with this title not found" });
  }

  return res.status(200).json(booksByTitle);
  // return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json(books[isbn].reviews);
  // return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
