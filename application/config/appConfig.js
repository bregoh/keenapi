/**
 * @module appConfig
 * @class none
 * @description configures the server and app variables
 * @author E. Bright
 * @copyright Nugress GK
 * @license MIT
 * @version 1.8.0
 * @requires dotenv
 * @exports config
 */
require("dotenv").config();

let env = process.env.NODE_ENV;

if (env !== "development" || env === undefined) {
  env = "production";
}

const development = {
  title: "Keen Eye API",
  BASE_URL: "",
  PORT: process.env.PORT || 3005,
  DB: {
    connectionLimit: 10,
    host: process.env.TEST_DB_HOST,
    user: process.env.TEST_DB_USER,
    password: "",
    database: process.env.TEST_DB_NAME,
  },
  MongoDB: {
    useCluster: false,
    connection: {
      database: process.env.MongoDB_DATABASE,
    },
  },
};

const production = {
  title: "Keen Eye API",
  BASE_URL: "",
  PORT: process.env.PORT || 4001,
  DB: {
    connectionLimit: 100000,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
  },
  MongoDB: {
    connection: {
      database: process.env.MongoDB_DATABASE,
    },
  },
};

const config = {
  development,
  production,
};

module.exports = config[env];
