/**
 * @class Loader
 * @description Load Classes dynamically with just the class name
 * @author E. Bright
 * @copyright Nugress GK
 * @license MIT
 * @version 1.8.0
 * @exports Loader
 */

"use strict";

class Loader {
  /**
   * @function loadClass
   * @description get a valid class name and returns an instance of it
   * @param {String} classname
   * @returns {ObjectConstructor} of any available class
   */
  loadClass(classname) {
    if (classname === "") {
      throw new Error("Class Name is empty");
    }

    try {
      const instanceOfClass = require(`../controller/${classname}_Class`);

      return new instanceOfClass();
    } catch (err) {
      throw new Error(`${classname}_Class not found: ${err} `);
    }
  }
}

module.exports = new Loader();
