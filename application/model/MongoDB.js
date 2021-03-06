/**
 * @class MonDB
 * @description To Perform All Crud Operations
 * @author E. Bright
 * @copyright NUGRESS GK
 * @license MIT
 * @version 1.8.0
 * @requires mongodb
 * @requires appConfig
 * @requires dotenv
 * @exports MonDB
 */

const { MongoClient, ObjectID } = require("mongodb");
const config = require("../config/appConfig");

class MonDB {
  //db variable to a connected database
  db = null;
  response = null;
  output = []; // get the info for mongodb collection creation
  ObjectID = ObjectID;
  /**
   * MonDB constructor
   */
  constructor() {
    // connection string
    let uri = null;

    // connection options
    const connectionOptions = {
      poolSize: 20,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    let { database } = config.MongoDB.connection;
    uri =
      process.env.MONGO_URI ||
      `mongodb://localhost:27017/?w=majority&ignoreUndefined=true`;

    const client = new MongoClient(uri, connectionOptions);

    client.connect(async (err) => {
      if (err) return console.log("failed to connect to mongodb server", err);

      console.log("connected successfully to mongodb server");

      this.db = client.db(database);
    });
  }

  /**
   * @function createCollection
   * @param {String} name
   * @param {Object} options
   * @returns {null}
   */
  async createCollection(name, options = {}) {
    try {
      this.db.createCollection(name, options);
      console.log(name, " collection created");
      this.output.push({
        message: `${name} collection created`,
      });
    } catch (err) {
      console.log("failed to create collection");
    }
  }

  /**
   * @function add
   * @param {String} schema
   * @param {Object} data
   * @param {CallableFunction} callback
   * @returns {Promise}
   */
  async add(schema, data = {}, callback) {
    this.db.collection(schema).insertOne(data, async (err, result) => {
      callback(err, result);
    });
  }

  /**
   * @function delete
   * @param {String} schema
   * @param {Object} data
   * @param {CallableFunction} callback
   * @returns {Promise}
   */
  async delete(schema, data = {}, callback) {
    this.db.collection(schema).deleteOne(data, async (err, result) => {
      callback(err, result);
    });
  }

  /**
   * @function update
   * @param {String} schema
   * @param {Object} where
   * @param {Object} data
   * @param {CallableFunction} callback
   * @returns {Promise}
   */
  async update(schema, where = {}, data = {}, callback) {
    this.db
      .collection(schema)
      .updateOne(where, { $set: data }, async (err, result) => {
        callback(err, result);
      });
  }

  /**
   * @function get
   * @param {String} schema
   * @param {Object} data
   * @returns {Object}
   */
  async get(schema, data = {}) {
    this.response = this.db.collection(schema).find(data);

    return this;
  }

  /**
   * @function result
   * @description get query result into object array
   * @returns {Object}
   */
  async result() {
    let output = [];
    await this.response.forEach((doc) => output.push(doc));
    return output;
  }
}

module.exports = new MonDB();
