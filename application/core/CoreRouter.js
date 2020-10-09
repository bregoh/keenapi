/**
 * @class CoreRouter
 * @description Handles every request on the App
 * @author E. Bright
 * @copyright Nugress GK
 * @license MIT
 * @version 1.8.0
 * @requires appRoute
 * @exports CoreRouter
 */

"use strict";

const appRoutes = require("../config/appRoute");
const ErrorHandler = require("./ErrorHandler");

class CoreRouter {
  /**
   * @function init
   * @description Initialize the router to receive and dispatch requests
   * @param none
   * @returns none
   */
  init = () => {
    /**
     * @description Every request must pass through the version 1 (v1)
     */
    app.use("/", appRoutes);

    /**
     * @description Return a 404 if the request path is not found
     */
    app.use(ErrorHandler.routeError);

    /**
     * @description Send error to requestor
     */
    app.use(ErrorHandler.failError);
  };
}

module.exports = new CoreRouter();
