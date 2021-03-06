/**
 * @class DB
 * @description To Perform All Crud Operations
 * @author E. Bright
 * @copyright NUGRESS GK
 * @license MIT
 * @version 1.8.0
 * @requires mysql
 * @requires dotenv
 * @requires appConfig
 * @exports DB
 */
const mysql = require("mysql");
const config = require("../config/appConfig");

class DB {
  start() {
    this.pool = mysql.createPool(config.DB);
  }

  /**
   * @function sql_createDB
   * @description create a database
   * @param {String} string
   * @returns {Promise}
   */
  sql_createDB = (DB) => {
    let query = `CREATE DATABASE ${DB}`;
    return this.run(query);
  };

  /**
   * @function sql_select_all
   * @description select all from a table
   * @param {String} table
   * @returns {Promise}
   */
  sql_select_all = (table) => {
    let query = `SELECT * FROM ${table}`;
    return this.run(query);
  };

  /**
   * @function sql_query
   * @description Performs a custom query
   * @param {String} query_statement
   * @returns {Promise}
   */
  sql_query = (query) => {
    return this.run(query);
  };

  /**
   * @function sql_insert
   * @description inserts a new row
   * @param {String} table_name
   * @param {Object} data
   * @returns {Promise}
   */
  sql_insert = (table, data) => {
    let query = "INSERT INTO " + table + " SET ?";
    let insData = data;
    let ins = true;
    return this.run(query, insData, ins);
  };

  /**
   * @function sql_insert_many
   * @description inserts multiple rows
   * @param {String} table
   * @param {Object} data
   * @return {Promise}
   */
  sql_insert_many = (table, data) => {
    let column = [];
    let value = [];
    let objValue = [];

    for (let j = 0; j < data.length; j++) {
      for (let x in data[j]) {
        if (!column.includes(x)) {
          column.push(x);
        }

        objValue.push(data[j][x]);
      }

      value.push(objValue);
      objValue = [];
    }

    let col = `(${column.toString()})`;

    let query = `INSERT INTO ${table} ${col} VALUES ?`;
    let insData = [value];
    let ins = true;
    return this.run(query, insData, ins);
  };

  /**
   * @function sql_delete
   * @description deletes a row from a table
   * @param {String} table
   * @param {Object} condition
   * @returns {Promise}
   */
  sql_delete = (table, condition) => {
    let column = "",
      tempCondition = "";

    for (column in condition) {
      tempCondition += `${column} = ${condition[column]} AND `;
    }

    tempCondition = tempCondition.replace(/AND\s*$/, "");

    let query = `DELETE FROM ${table} WHERE ${tempCondition}`;
    return this.run(query);
  };

  /**
   * @function sql_update
   * @description updates a table
   * @param {String} table
   * @param {Array} data
   * @param {Array} condition
   * @returns {Promise}
   */
  sql_update = (table, data, condition) => {
    let column = "",
      tempQuery = "",
      tempCondition = "";
    for (column in data) {
      //console.log(typeof data[column]);
      tempQuery += `${column} = ${data[column]}, `;
    }

    tempQuery = tempQuery.replace(/,\s*$/, "");

    for (column in condition) {
      //console.log(typeof condition[column]);
      tempCondition += `${column} = ${condition[column]} AND `;
    }

    tempCondition = tempCondition.replace(/AND\s*$/, "");

    let query = `UPDATE ${table} SET ${tempQuery} WHERE ${tempCondition}`;
    return this.run(query);
  };

  /**
   * @function run
   * @description Process all queries to the DB
   * @param {String} query
   * @param {Object} insData
   * @param {Boolean} ins
   * @returns {Promise}
   */
  run = (query, insData = "", ins = false) => {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, connection) => {
        if (err) throw new Error(`Connection Failed ${err}`);

        if (!ins) {
          connection.query(query, (err, res) => {
            if (err) reject(new Error(`Execution error: ${err}`));

            resolve(res);
          });

          connection.release();
        } else {
          connection.query(query, insData, (err, res) => {
            if (err) reject(new Error(`Execution error: ${err}`));

            resolve(res);
          });

          connection.release();
        }
      });
    });
  };
}

module.exports = new DB();
