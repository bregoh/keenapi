/**
 * @module user
 * @class USer_Class
 * @description Handles userAuthentication
 * @author E. Bright
 * @copyright Nugress GK
 * @license MIT
 * @version 1.8.0
 * @requires
 * @exports user
 */

"use strict";

const mdb = require("../model/MongoDB");
const bcrypt = require("bcrypt");
const validaton = require("../core/Validaton");
const auth = require("../core/CoreAuth");
const cache = require("../core/Cache");

class User_Class {
  /**
   *
   * @param {*} req
   * @param {*} res
   */
  login = async (req, res) => {
    let { email, password } = req.body;
    let result = await (await mdb.get("users", { email: `${email}` })).result();

    if (result.length === 0) {
      return res.status(400).json({
        type: "login_error",
        message: "email or password is incorrect",
      });
    }

    let { _id, firstname, lastname } = result[0];

    let isPasswordValid = await validaton.validatePassword(
      password,
      result[0].password
    );

    if (!isPasswordValid) {
      return res.status(400).json({
        type: "login_error",
        message: "email or password is incorrect",
      });
    }

    let user = {
      id: _id,
      name: email,
    };

    let token = await auth.generateTokens(user, { expiresIn: "2h" });

    // if (token.message === false) {
    //   console.log("token not generated");
    //   return res.status(400).json({
    //     type: "login_error",
    //     message: "email or password is incorrect",
    //   });
    // }

    cache.setCacheData(email, user, 10800);

    res.json({
      status: "success",
      data: {
        firstname: firstname,
        lastname: lastname,
        email: email,
      },
      access_token: token,
    });
  };
  /**
   *
   * @param {*} req
   * @param {*} res
   */
  register = async (req, res) => {
    // deconstructed request body
    let { firstname, lastname, email, password } = req.body;

    let data = {
      firstname: firstname,
      lastname: lastname,
      email: email,
    };

    // validate the data sent
    let isValid = await validaton.validateRegisterData(data);

    // respond to invalid data
    if (!isValid) {
      let err = await validaton.err;

      // respond with an error message
      return res.status(400).json({
        type: "form_error",
        message: err,
      });
    }

    // check if the email has been used for registration
    let isRegistered = await this.isRegistered(email);

    if (isRegistered) {
      // respond with an error message
      return res.status(400).json({
        type: "registered_user",
        message: `${email} is already registered`,
      });
    }

    // create a hashed password
    let hashedPassword = await bcrypt.hash(password, 10);
    data.password = hashedPassword;

    // get the current date and time in string format
    data.date = Date.now().toString();

    try {
      // add to database
      await mdb.add("users", data, (err, result) => {
        if (err) return res.status(401).json({ message: err.message });

        res.status(200).json({
          lastInsertID: result.insertedId,
          status: true,
        });
      });
    } catch (err) {
      res.status(400).json({
        type: "registration_error",
        message: "failed to save data",
      });
    }
  };

  /**
   *
   * @param {*} email
   */
  isRegistered = async (email) => {
    let result = await (await mdb.get("users", { email: `${email}` })).result();

    if (result.length !== 0) {
      return true;
    }

    return false;
  };

  /**
   *
   * @param {*} req
   * @param {*} res
   */
  refreshAccessToken = async (req, res) => {
    let key = req.body.email;
    let result = await cache.getCacheData(key);

    if (result === undefined) {
      return res.status(400).json({
        type: "login_error",
        message: "invalid request",
      });
    }

    let user = {
      id: result._id,
      email: result.email,
    };

    let token = await auth.generateTokens(user, { expiresIn: "2h" });

    res.json({
      status: "success",
      access_token: token,
    });
  };
}

module.exports = User_Class;
