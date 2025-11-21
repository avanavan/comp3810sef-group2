const express = require("express");
const app = express();
const session = require("cookie-session");
const fsPromises = require("node:fs/promises");
const formidable = require("express-formidable");
const { hasAnOpaquePath } = require("whatwg-url");

// NoSQL setup
const { MongoClient, ObjectId } = require("mongodb");
const { waitForDebugger } = require("node:inspector");
const mongourl = process.env.MONGOURL;
// const mongourl = "mongodb+srv://comp3810_Project:Group2_Project@cluster0.5werauf.mongodb.net/?appName=Cluster0";
const client = new MongoClient(mongourl);
const db = client.db("test");

app.set("view engine", "ejs");
app.use(formidable());
app.use(session({
    name: "loginSession",
    keys: ["comp3810sef"]
}));

// Middleware (Login)
function loginRequired(req, res, next) {
    if (!req.session.authenicated) {
        return res.redirect("/login");
    }
    next();
}

// Root
app.get("/", (req, res) => {
    if (req.session.authenicated) {
        res.redirect("/dashboard");
    }
    else {
        res.redirect("/login");
    }
});

// Login page
app.get("/login", (req, res) => {
    if (req.session.authenicated) {
        res.redirect("/dashboard");
    }
    res.status(200).render("auth/login");
});

// Login (POST)
app.post("/login", async (req, res) => {
    try {
        // Handle password authenication logic
        const usersCollection = db.collection("users");
        const user = await usersCollection.findOne({ userName: req.fields.username, password: req.fields.password });

        if (user) { // if found
            req.session.authenicated = true;
            req.session.username = req.fields.username;
            res.redirect("/dashboard");
        }
        else { // failed, redirect back to login
            res.end("Wrong username or password, please go back and retry again...");
        }

    } catch (error) {
        console.error(error);
        res.status(500).send("an error has occured");
    }
});

// Logout
app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

// Dashboard page
app.get("/dashboard", loginRequired, (req, res) => {
    res.status(200).render("dashboard", req.session.username);
});



// borrowBook page
app.get("/borrowBook", loginRequired, (req, res) => {
    // pass in books model
    res.status(200).render("borrowBook", );
});

// updateUsername page
app.get("/updateUsername", loginRequired, (req, res) => {
    // pass in user model
    res.status(200).render("updateUsername", );
});


// Serving
app.listen(8000, () => {
    console.log("Server is being served on localhost:8000...");
});