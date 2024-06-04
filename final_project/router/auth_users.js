const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    //returns boolean
    //write code to check is the username is valid
    return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
    //returns boolean
    //write code to check if username and password match the one we have in records.
    return users.some(
        (user) => user.username === username && user.password === password
    );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    const { username, password } = req.body;

    if (!username || !password) {
        return res
            .status(400)
            .json({ message: "Username and password are required" });
    }

    if (authenticatedUser(username, password)) {
        const token = jwt.sign({ username }, "your_secret_key", {
            expiresIn: "1h",
        });
        req.session.token = token;
        return res
            .status(200)
            .json({ message: "Logged in successfully", token });
    } else {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    // return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
    const { review } = req.body;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (!review) {
        return res.status(400).json({ message: "Review content is required" });
    }

    books[isbn].reviews[req.user.username] = review;
    return res
        .status(200)
        .json({
            message: "Review added successfully",
            reviews: books[isbn].reviews,
        });
    // return res.status(300).json({message: "Yet to be implemented"});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (!books[isbn].reviews[req.user.username]) {
        return res.status(404).json({ message: "Review not found" });
    }

    delete books[isbn].reviews[req.user.username];
    return res.status(200).json({ message: "Review deleted successfully", reviews: books[isbn].reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
