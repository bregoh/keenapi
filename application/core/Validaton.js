/**
 * @module Validator class for validating input data
 * @description To Perform All Crud Operations
 * @author E. Bright
 * @copyright NUGRESS GK
 * @license MIT
 * @version 1.8.0
 * @requires validatorjs
 * @exports Validator
 */

"use strict";

const Validator = require("validatorjs");
const bcrypt = require("bcrypt");

class Validaton {
  err = null;

  /**
   *
   * @param {*} data
   */
  async validateRegisterData(data) {
    let validation = new Validator(data, {
      firstname: "required",
      lastname: "required",
      email: "required|email",
    });

    if (validation.passes() === false) {
      this.err = validation.errors.all();

      return false;
    }
    return true;
  }

  /**
   *
   * @param {*} data
   */
  async validateLoginData(data) {
    let validation = new Validator(data, {
      email: "required|email",
    });

    if (validation.passes() === false) {
      this.err = {
        message: validation.errors.all(),
      };

      return false;
    }

    return true;
  }

  /**
   *
   * @param {*} data
   */
  async validateAuthorData(data) {
    let validation = new Validator(data, {
      name: "required",
    });

    if (validation.passes() === false) {
      this.err = {
        message: validation.errors.all(),
      };

      return false;
    }

    return true;
  }

  /**
   *
   * @param {*} data
   */
  async validateBookData(data) {
    let validation = new Validator(data, {
      title: "required",
      author: "required",
    });

    if (validation.passes() === false) {
      this.err = {
        message: validation.errors.all(),
      };

      return false;
    }

    return true;
  }

  /**
   *
   * @param {*} plainPassword
   * @param {*} hashedPassword
   */
  async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = new Validaton();
