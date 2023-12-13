const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return false;
  } else {
    return true;
  }
}

const authenticatedUser = (username,password)=>{ 
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn =   req.params.isbn;
  let book = books[isbn];
  if(book){
      if(req.body.review){
        console.log("book: ", book)
          book.reviews.push({
            reviewedBy: req.user.username,
            description: req.body.review
          });
      }
      books[isbn] = book;
      console.log(book)
      res.send(`Review for the book with isbn ${isbn} has been added.`);
  }else{
      res.send("Unable to find the book with the given isbn.");
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn =   req.params.isbn;
  let book = books[isbn];
  if(book){
    for(let i=0; i<book.reviews.length;i++){
      if(book.reviews[i].reviewedBy == req.body.username){
        book.reviews.splice(i, 1);
      }
    }
    books[isbn] = book;
    console.log(book)
    res.send(`Review by ${req.user.username} for the book with isbn ${isbn} has been deleted.`);
  }else{
      res.send("Unable to find the book with the given isbn.");
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
