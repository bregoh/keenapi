/**
 * @class Validator
 * @description validating input data
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
   * @function validateRegisterData
   * @param {Object} data
   * @returns {Boolean}
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
   * @function validateLoginData
   * @param {Object} data
   * @returns {Boolean}
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
   * @function validateAuthorData
   * @param {Object} data
   * @returns {Boolean}
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
   * @function validateBookData
   * @param {Object} data
   * @returns {Boolean}
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
   * @function validatePassword
   * @param {String} plainPassword
   * @param {String} hashedPassword
   */
  async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = new Validaton();
