/**
 * @module router
 * @class Routes
 * @description routes all request
 * @author E. Bright
 * @copyright Nugress GK
 * @license MIT
 * @version 1.8.0
 * @requires express
 * @requires bodyParser
 * @requires Loader
 * @exports router
 */
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const Load = require("../core/Loader");
const Authentication = require("../core/CoreAuth");
const migration = require("../model/Migration");

/**
 * @description dynamically assign instance of a class
 */
const User = Load.loadClass("User");
const Book = Load.loadClass("Book");
const Author = Load.loadClass("Author");

/**
 * @description clean all url and make the body of the request json
 */
router.use(express.static("public"));
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
/**
 * @description authenticate all request before processing
 */
//
//router.use(Authentication.authenticateTokens, (req, res, next) => {
router.use((req, res, next) => {
  /**
   * @description Log every request
   */
  console.log(`Resource requested: ${req.method} ${req.path}`);
  next();
});

/**
 * @description all routes should be added here
 */

router.get("/", (req, res) => {
  res.status(200).send("Welcome to KEEN API");
});

router.get("/migrate", migration.start);

/**
 * Users endpoint
 */

router.post("/user/login", User.login);
router.post("/user/register", User.register);
router.post("/user/get-tokens", User.refreshAccessToken);

/**
 * @description Book endpoints
 */
/**
 * Add book data
 * @description /book
 * @method POST
 */
router.post("/book", Authentication.authenticateTokens, Book.add);
/**
 * Get all books in the database
 * @description /book
 * @method GET
 */
router.get("/book", Authentication.authenticateTokens, Book.view);
/**
 * Get a specific book in the database
 * @description /book/:id
 * @method GET
 */
router.get("/book/:id", Authentication.authenticateTokens, Book.viewById);
/**
 * Update a book in the database
 * @description /book/:id
 * @method PUT
 */
router.put("/book/:id", Authentication.authenticateTokens, Book.update);
/**
 * Delete a book from the database
 * @description /book/:id
 * @method GET
 */
router.delete("/book/:id", Authentication.authenticateTokens, Book.delete);

/**
 * @description Author endpoints
 */
/**
 * Add Author's data
 * @description /author
 * @method POST
 */
router.post("/author", Authentication.authenticateTokens, Author.add);
/**
 * Get all Authors in the database
 * @description /author
 * @method GET
 */
router.get("/author", Authentication.authenticateTokens, Author.view);
/**
 * Get a specific Author in the database
 * @description /author/:id
 * @method GET
 */
router.get("/author/:id", Authentication.authenticateTokens, Author.viewById);
/**
 * Update an Author in the database
 * @description /author/:id
 * @method PUT
 */
router.put("/author/:id", Authentication.authenticateTokens, Author.update);
/**
 * Delete an Author from the database
 * @description /author/:id
 * @method GET
 */
router.delete("/author/:id", Authentication.authenticateTokens, Author.delete);
/**
 * Upload an Author's picture to the server
 * @description /book
 * @method GET
 */
router.post("/upload", Authentication.authenticateTokens, Author.uploadFile);

/**
 * @description Export router module
 */
module.exports = router;
