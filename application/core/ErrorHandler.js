"use strict";

class ErrorHandler {
  auth = (req, res, next, status) => {
    res.status(status).json({
      message: err,
    });
  };

  routeError = (req, res, next) => {
    const err = new Error(`${req.url} Not Found`);
    err.status = 404;
    res.status(404).json({ message: "invalid route" });
    next(err);
  };

  failError = (err, req, res) => {
    res.status(err.status || 500).json({
      error: {
        message: err.message,
      },
    });
  };
}

module.exports = new ErrorHandler();
