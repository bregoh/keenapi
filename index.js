/**
 * @module index
 * @class none
 * @description server start up file
 * @author E. Bright
 * @copyright Nugress GK
 * @license MIT
 * @version 1.8.0
 * @requires express
 * @requires config
 * @requires cors
 * @requires helmet
 * @requires coreRouter
 */

"use strict";

// packages
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

// Application modules
const config = require("./application/config/appConfig");
const coreRouter = require("./application/core/CoreRouter");
const cache = require("./application/core/Cache");

global.app = express();
let server = null;

app.use(helmet());
app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

cache.start();
coreRouter.init();

server = app.listen(config.PORT, () => {
  console.log(`API server started at: ${config.PORT}`);
});
