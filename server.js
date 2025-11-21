const express = require("express");
const app = express();
const fsPromises = require("node:fs/promises");
const formidable = require("express-formidable");

// NoSQL setup
// const { MongoClient, ObjectId } = require("mongodb");
// const mongourl = ""; // Add this later
// const client = new MongoClient(mongourl);
// const dbName = ""; // Add this later

app.set("view engine", "ejs");
app.use(formidable());

// Root
app.get("/", (req, res) => {
    res.status(200).end("Hello World!");
});

// Serving
app.listen(8000, () => {
    console.log("Server is being served on localhost:8000...");
});