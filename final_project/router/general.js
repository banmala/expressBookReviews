const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if(book){
    return res.send(JSON.stringify(book));
  }else{
    return res.send("Book not found");
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const all_books = books;
  const result =  [];
  for(const key in all_books){
    if(all_books[key].author == author){
      result.push(all_books[key])
    }
  }
  if(result.length>0){
    return res.send(JSON.stringify(result));
  }else{
    return res.send("Book not found");
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const all_books = books;
  const result =  [];
  for(const key in all_books){
    if(all_books[key].title == title){
      result.push(all_books[key])
    }
  }
  if(result.length>0){
    return res.send(JSON.stringify(result));
  }else{
    return res.send("Book not found");
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const all_books = books;
  const book = all_books[isbn];
  return res.send(book.reviews);
});

module.exports.general = public_users;
