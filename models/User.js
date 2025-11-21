const mongoose = require("mongoose");
const Book = require("./Book");

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    password: { type: String, required: true },
    borrowedBooks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book"
    }]
});

module.exports = mongoose.model("User", userSchema)