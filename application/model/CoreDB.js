/**
 * @module DB class for MySQL entries
 * @description To Perform All Crud Operations
 * @author E. Bright
 * @copyright NUGRESS GK
 * @license MIT
 * @version 1.8.0
 * @requires mysql
 * @requires dotenv
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
   * @param DB string
   * @returns promise
   */
  sql_createDB = (DB) => {
    let query = `CREATE DATABASE ${DB}`;
    return this.run(query);
  };

  /**
   * @function sql_select_all
   * @description "select all from a table"
   * @param {string} table
   * @returns promise
   */
  sql_select_all = (table) => {
    let query = `SELECT * FROM ${table}`;
    return this.run(query);
  };

  /**
   * @function sql_query
   * @description "Performs a custom query"
   * @param {string} query_statement
   * @returns promise
   */
  sql_query = (query) => {
    return this.run(query);
  };

  /**
   * @function sql_insert
   * @description "inserts a new row"
   * @param {string} table_name
   * @param {Array} data
   * @returns promise
   */
  sql_insert = (table, data) => {
    let query = "INSERT INTO " + table + " SET ?";
    let insData = data;
    let ins = true;
    return this.run(query, insData, ins);
  };

  /**
   * @function sql_insert_many
   * @description "inserts multiple rows"
   * @param {string} table
   * @param {Array} data
   * @return "promise"
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
   * @description "deletes a row from a table"
   * @param {string} table
   * @param {Array} condition
   * @returns promise
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
   * @description "updates a table"
   * @param {String} table
   * @param {Array} data
   * @param {Array} condition
   * @returns promise
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
   * @description "Process all queries to the DB"
   * @param {String} query
   * @param {Array} "Data for insert queries"
   * @param {boolean} "is request for insert or other query"
   * @returns promise
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
