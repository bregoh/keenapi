/**
 * @module router
 * @class none
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

router.get("/test", (req, res) => {
  res.status(200).send("Hello world");
});

router.get("/migrate", migration.start);

/**
 * Users endpoint
 */
//router.post("/user/login", User.login);
router.post("/user/login", User.login);
router.post("/user/register", User.register);
router.post("/user/get-tokens", User.refreshAccessToken);

/**
 * Book endpoints
 */
router.post("/book/add", Authentication.authenticateTokens, Book.add);
router.get("/book/view", Authentication.authenticateTokens, Book.view);
router.get(
  "/book/view/id/:id",
  Authentication.authenticateTokens,
  Book.viewById
);
router.post("/book/update/:id", Authentication.authenticateTokens, Book.update);
router.post("/book/delete/:id", Authentication.authenticateTokens, Book.delete);

/**
 * Author endpoints
 */
router.post("/author/add", Authentication.authenticateTokens, Author.add);
router.get("/author/view", Authentication.authenticateTokens, Author.view);
router.get(
  "/author/view/id/:id",
  Authentication.authenticateTokens,
  Author.viewById
);
router.post(
  "/author/update/:id",
  Authentication.authenticateTokens,
  Author.update
);
router.post(
  "/author/delete/:id",
  Authentication.authenticateTokens,
  Author.delete
);
router.post(
  "/author/upload",
  Authentication.authenticateTokens,
  Author.uploadFile
);

/**
 * @description Export router module
 */
module.exports = router;
