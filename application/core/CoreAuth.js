/**
 * @class Authentication
 * @description Handles API Key and user authentication
 * @author E. Bright
 * @copyright Nugress GK
 * @license MIT
 * @version 1.8.0
 * @requires crypto
 * @requires coreController
 * @requires dotenv
 * @exports Authentication
 */

"use strict";

const crypto = require("crypto");
const jwt = require("jsonwebtoken");
require("dotenv").config();

class Authentication {
  classToken = process.env.JWT_SK || "525b0cfeef8417cd5901b7874ce28fa73f96b59f";

  /**
   * @function authenticateTokens
   * @description Get the token, check if its already validated, else send for validation
   * @param {Array} req
   * @param {Array} res
   * @param {Callback} next
   * @returns {Object}
   */
  authenticateTokens = async (req, res, next) => {
    let token = "";

    /**
     * @description Authentication key is passed in the header
     */
    if (
      req.headers.authorization !== undefined ||
      req.headers.Authorization !== undefined
    ) {
      let tmpKey = req.headers.authorization;
      let tmpArray = tmpKey.split(" ");
      if (tmpArray[0].toLowerCase() !== "bearer") {
        res.status(401).send({ message: "Malformed header" });
      }
      token = tmpArray[1];
      let isValid = await this.validateToken(token);

      if (isValid.length === 0) {
        return res.status(400).send({ message: "bad request" });
      }
      //console.log(isValid);
      //req.body.user = isValid;
      next();
    } else if (req.query.api !== undefined) {
      /**
       * @description Authentication key is passed in the url
       */
      token = req.query.api;
      let isValid = await this.validateToken(token);

      if (isValid.length === 0) {
        return res.status(400).send({ message: "bad request" });
      }

      //req.body.user = isValid;
      next();
    } else {
      /**
       * @description Authentication Key is missing
       */
      return res.status(400).send({ message: "bad request" });
    }
  };

  /**
   * @function generateTokens
   * @description generate tokens based on users information
   * @param {Object} data
   * @param {Object} options
   * @returns {String} tokens
   */
  generateTokens = async (data, options = {}) => {
    return await jwt.sign(data, this.classToken, options);
  };

  /**
   * @function validateToken
   * @description check if the token sent by client is valid
   * @param {String} token
   * @returns true or []
   */
  validateToken = async (token) => {
    try {
      return await jwt.verify(token, this.classToken);
    } catch (err) {
      return [];
    }
  };
}
module.exports = new Authentication();
