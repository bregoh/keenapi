"use strict";
/**
 * @class ErrorHandler
 * @description Handles every error on the App
 * @author E. Bright
 * @copyright Nugress GK
 * @license MIT
 * @version 1.8.0
 * @exports Object
 */
class ErrorHandler {
  /**
   * @function auth
   * @param {Object} req
   * @param {Object} res
   * @param {Callback} next
   * @param {Integer} status
   * @returns {Object}
   */
  auth = (req, res, next, status) => {
    res.status(status).json({
      message: err,
    });
  };

  /**
   * @function routeError
   * @param {Object} req
   * @param {Object} res
   * @param {Object} next
   * @returns {Object}
   */
  routeError = (req, res, next) => {
    const err = new Error(`${req.url} Not Found`);
    err.status = 404;
    res.status(404).json({ message: "invalid route" });
    next(err);
  };

  /**
   * @function failError
   * @param {Object} err
   * @param {Object} req
   * @param {Object} res
   * @returns {Object}
   */
  failError = (err, req, res) => {
    res.status(err.status || 500).json({
      error: {
        message: err.message,
      },
    });
  };
}

module.exports = new ErrorHandler();
