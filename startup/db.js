const mongoose = require("mongoose");

module.exports = function () {
  mongoose
    .connect(
      "mongodb+srv://arashafsharian1996:PWY756LMAomvxpyP@popcornflicks.nmd0j.mongodb.net/?retryWrites=true&w=majority&appName=PopcornFlicks"
    )
    .then(() => console.log("Connected to MongoDB..."))
    .catch((err) => console.error("Could not connect to MongoDB!", err));
};
