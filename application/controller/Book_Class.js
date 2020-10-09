/**
 * @module book
 * @class Book_Class
 * @description Handles userAuthentication
 * @author E. Bright
 * @copyright Nugress GK
 * @license MIT
 * @version 1.8.0
 * @requires
 * @exports book
 */

"use strict";

const mdb = require("../model/MongoDB");
const validaton = require("../core/Validaton");

class Book_Class {
  add = async (req, res) => {
    let { title, author, description } = req.body;

    let data = {
      title: title,
      author: author,
    };

    let isValid = validaton.validateBookData(data);

    if (!isValid) {
      return res.status(400).json({
        message: validaton.err,
      });
    }

    if (description === undefined) description = "null";

    data.description = description;
    data.date = Date.now().toString();

    try {
      // add to database
      await mdb.add("book", data, (err, result) => {
        if (err) return res.status(401).json({ message: err.message });

        res.status(200).json({
          lastInsertID: result.insertedId,
          status: true,
        });
      });
    } catch (err) {
      res.status(400).json({
        type: "error",
        message: "failed to save data",
      });
    }
  };

  delete = async (req, res) => {
    let id = req.params.id || req.body.id;

    if (id === undefined) {
      id = req.body.id;
    }

    id = mdb.ObjectID(id);

    await mdb.delete("book", { _id: id }, (err, result) => {
      if (err) return res.status(401).json({ message: err.message });

      res.status(200).json({
        message: "deleted",
        status: true,
      });
    });
  };

  update = async (req, res) => {
    let id = req.params.id || req.body.id;
    let title = req.body.title;
    let description = req.body.description;
    let author = req.body.author;

    let data = {};

    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (author !== undefined) data.author = author;

    if (Object.entries(data).length === 0)
      return res.status(400).json({ message: "no fields to update" });

    id = mdb.ObjectID(id);

    await mdb.update("book", { _id: id }, data, (err, result) => {
      if (err) return res.status(401).json({ message: err.message });

      res.status(200).json({
        message: "updated",
        status: true,
      });
    });
  };

  view = async (req, res) => {
    let result = await (await mdb.get("book")).result();

    res.status(200).json(result);
  };

  viewById = async (req, res) => {
    let id = req.params.id || req.body.id;
    let data = {};

    if (id == undefined)
      return res.status(404).json({
        message: "book not specified, id not specified",
      });

    data._id = await mdb.ObjectID(id);

    let result = await (await mdb.get("book", data)).result();

    res.status(200).json(result);
  };
}

module.exports = Book_Class;
