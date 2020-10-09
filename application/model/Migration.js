"use strict";

const mdb = require("./MongoDB");

class Migration {
  start = (req, res) => {
    setTimeout(() => {
      this.userMigration();
      this.bookMigration();
      this.authorMigration();

      res.status(201).json({
        message: `collections created`,
      });
    }, 2000);
  };

  async userMigration() {
    await mdb.createCollection("users", {
      validator: {
        $or: [
          { firstname: { $type: "string" } },
          { lastname: { $type: "string" } },
          { email: { $regex: /@[a-z]\.com$/ } },
          { password: { $type: "string" } },
          { date: { $type: "date" } },
        ],
      },
    });
  }

  async bookMigration() {
    await mdb.createCollection("book", {
      validator: {
        $or: [
          { author: { $type: "string", $exists: true } }, // required
          { title: { $type: "string", $exists: true } }, // required
          { description: { $type: "string" } },
          { date: { $type: "date" } },
        ],
      },
    });
  }

  async authorMigration() {
    await mdb.createCollection("author", {
      validator: {
        $or: [
          { name: { $type: "string", $exists: true } }, // required
          { bio: { $type: "string" } },
          { image: { $type: "string" } },
          { date: { $type: "date" } },
        ],
      },
    });
  }
}

module.exports = new Migration();
