"use strict";

/**
 * @class Geolocation
 * @description Handles geolocation for every IP that accessed the API
 * @author E. Bright
 * @copyright Nugress GK
 * @license MIT
 * @version 1.8.0
 * @requires appRoute
 * @exports CoreRouter
 */

const http = require("http");
let unserialize = require("locutus/php/var/unserialize"); // npm i locutus

class Geolocation {
  info = (ip) => {
    return new Promise((resolve, reject) => {
      let isCached = JCache.get(ip);

      if (isCached !== undefined) {
        console.log("cache found");
        resolve(isCached);
      } else {
        http.get("http://www.geoplugin.net/php.gp?ip=" + ip, (res) => {
          res.on("data", (response) => {
            let buf = Buffer.from(response);

            let data = buf.toString();
            data = unserialize(data);

            JCache.set(ip, data, 3000);
            resolve(data);
          });
        });
      }
    });
  };
}

module.exports = new Geolocation();
