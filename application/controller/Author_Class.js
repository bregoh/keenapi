/**
 * @module user
 * @class USer_Class
 * @description Handles userAuthentication
 * @author E. Bright
 * @copyright Nugress GK
 * @license MIT
 * @version 1.8.0
 * @requires
 * @exports user
 */

"use strict";

// libraries
const sharp = require("sharp");
const formidable = require("formidable");
const Emitter = require("events");

// App module
const mdb = require("../model/MongoDB");
const validaton = require("../core/Validaton");

class Author_Class {
  event = new Emitter();

  /**
   *
   * @param {*} req
   * @param {*} res
   */
  add = async (req, res) => {
    let { name, bio, image } = req.body;

    let data = {
      name: name,
    };

    let isValid = validaton.validateAuthorData(data);

    if (!isValid) {
      return res.status(400).json({
        message: validaton.err,
      });
    }

    if (bio === undefined) bio = "null";
    if (image === undefined) image = "null";

    data.bio = bio;
    data.image = image;
    data.date = Date.now().toString();

    try {
      // add to database
      await mdb.add("author", data, (err, result) => {
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

  /**
   *
   * @param {*} req
   * @param {*} res
   */
  delete = async (req, res) => {
    let id = req.params.id || req.body.id;

    if (id === undefined) {
      id = req.body.id;
    }

    id = mdb.ObjectID(id);

    await mdb.delete("author", { _id: id }, (err, result) => {
      if (err) return res.status(401).json({ message: err.message });

      res.status(200).json({
        message: "deleted",
        status: true,
      });
    });
  };

  /**
   *
   * @param {*} req
   * @param {*} res
   */
  update = async (req, res) => {
    let id = req.params.id || req.body.id;
    let name = req.body.name;
    let bio = req.body.bio;
    let image = req.body.image;

    let data = {};

    if (name !== undefined) data.name = name;
    if (bio !== undefined) data.bio = bio;
    if (image !== undefined) data.image = image;

    if (Object.entries(data).length === 0)
      return res.status(400).json({ message: "no fields to update" });

    id = mdb.ObjectID(id);

    await mdb.update("author", { _id: id }, data, (err, result) => {
      if (err) return res.status(401).json({ message: err.message });

      res.status(200).json({
        message: "updated",
        status: true,
      });
    });
  };

  /**
   *
   * @param {*} req
   * @param {*} res
   */
  view = async (req, res) => {
    let result = await (await mdb.get("author")).result();

    res.status(200).json(result);
  };

  /**
   *
   * @param {*} req
   * @param {*} res
   */
  viewById = async (req, res) => {
    let id = req.params.id || req.body.id;
    let data = {};

    if (id == undefined)
      return res.staus(404).json({
        message: "author not found, id not specified",
      });

    data._id = mdb.ObjectID(id);

    let result = await (await mdb.get("author", data)).result();

    res.status(200).json(result);
  };

  uploadFile = async (req, res) => {
    // start the event emitter
    this.startEmitter(res);

    // set the formidable object
    // formidable library is used to proces form-data values
    const form = formidable({ multiples: true });

    // parse form-data values
    form.parse(req, async (err, fields, files) => {
      let imgName = files.image.name;
      let imgPath = files.image.path;
      let newImage = "public/uploads/" + imgName;

      let id = fields.id;

      if (id === undefined || id === "") {
        return res.status(400).json({ message: "id not specified" });
      }

      if (err) return res.status(400).json({ message: "malformed form data" });

      sharp(imgPath)
        .resize({
          width: 300,
          height: 300,
        })
        .toFile(newImage, async (err, info) => {
          if (err)
            return res.status(400).json({ message: "unable to save file" });

          this.event.emit("saved", {
            id: id,
            uploadedPath: newImage,
          });
        });
    });
  };

  startEmitter = (res) => {
    try {
      this.event.once("failed", () => {
        res.status(400).json({ message: "unable to save file" });
      });

      this.event.once("success", () => {
        res.status(200).json({ message: "done" });
      });

      this.event.once("saved", async (data) => {
        this.updateImageToDB(data);
      });
    } catch (error) {
      console.log("error");
    }
  };

  updateImageToDB = async (data) => {
    let { id, uploadedPath } = data;
    id = await mdb.ObjectID(id);
    let where = { _id: id };
    let dataToUpdate = { image: uploadedPath };

    try {
      await mdb.update("author", where, dataToUpdate, (err, result) => {
        if (err) return this.event.emit("failed");

        this.event.emit("success");
      });
    } catch (error) {
      console.log(err);
    }
  };
}

module.exports = Author_Class;
