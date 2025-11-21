const express = require("express");
const app = express();
const session = require("cookie-session");
const formidable = require("express-formidable");

// NoSQL setup
const mongoose = require("mongoose");
const mongourl = "no";

// Connect to MongoDB
mongoose.connect(mongourl)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

app.set("view engine", "ejs");
app.use(formidable());
app.use(session({
    name: "loginSession",
    keys: ["comp3810sef"]
}));

// Models
const User = require("./models/User");
const Book = require("./models/Book");
const { ObjectId } = require("bson");

// Middleware (Login)
function loginRequired(req, res, next) {
    if (!req.session.authenicated) {
        return res.redirect("/login");
    }
    next();
}

// Middleware (Validation)
async function validateBookAndUser(req, res, next) {
    try {
        const bookID = req.params.bookID || req.params.bookid || req.fields.bookID;
        const username = req.params.username || req.session.username;

        if (bookID) {
            const book = await Book.findById(bookID);
            if (!book) {
                return res.status(404).json({ error: "Book not found" });
            }
        }

        if (username) {
            const user = await User.findOne({ userName: username });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}

/*

    EJS HANDLERS

*/
app.get("/", (req, res) => {
    if (req.session.authenicated) {
        res.redirect("/dashboard");
    }
    else {
        res.redirect("/login");
    }
});

app.get("/login", (req, res) => {
    if (req.session.authenicated) {
        res.redirect("/dashboard");
    }
    res.status(200).render("auth/login");
});

app.post("/login", async (req, res) => {
    try {
        if (await User.findOne({ userName: req.fields.username, password: req.fields.password })) { // if found
            req.session.authenicated = true;
            req.session.username = req.fields.username;
            res.redirect("/dashboard");
        }
        else { // failed, redirect back to login
            res.end("Wrong username or password, please go back and retry again...");
        }

    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

app.get("/dashboard", loginRequired, async (req, res) => {
    try {
        const user = await User.findOne({ userName: req.session.username }).populate('borrowedBooks');
        res.status(200).render("dashboard", { 
            user: { username: req.session.username },
            borrowedBooks: user ? user.borrowedBooks : []
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error has occurred");
    }
});

app.get("/borrowBook", loginRequired, async (req, res) => {
    try {
        const borrowedBooks = await User.aggregate([
            { $unwind: "$borrowedBooks" },
            { $group: { _id: null, borrowedBookIds: { $addToSet: "$borrowedBooks" } } }
        ]);
        
        const borrowedBookIds = borrowedBooks.length > 0 ? borrowedBooks[0].borrowedBookIds : [];
        const availableBooks = await Book.find({ _id: { $nin: borrowedBookIds } });
        
        res.status(200).render("borrowBook", { 
            availableBooks,
            user: { username: req.session.username }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error has occurred");
    }
});

app.post("/borrow-book", loginRequired, validateBookAndUser, async (req, res) => {
    try {
        const bookID = req.fields.bookID;
        const username = req.session.username;

        await User.updateOne(
            { userName: username },
            { $push: { borrowedBooks: bookID } }
        );

        await Book.updateOne(
            { _id: bookID },
            { lastBorrowDate: new Date() }
        );

        res.redirect("/dashboard");
    } catch (error) {
        console.error(error);
        res.status(500).send("An error has occurred");
    }
});

app.post("/return-book", loginRequired, validateBookAndUser, async (req, res) => {
    try {
        const bookID = req.fields.bookID;
        const username = req.session.username;

        await User.updateOne(
            { userName: username },
            { $pull: { borrowedBooks: bookID } }
        );

        res.redirect("/dashboard");
    } catch (error) {
        console.error(error);
        res.status(500).send("An error has occurred");
    }
});

app.get("/updateUsername", loginRequired, (req, res) => {
    // pass in user model
    res.status(200).render("updateUsername", );
});



/*

    API ENDPOINTS

*/

//
//  /api/user
//
app.get("/api/user", async (req, res) => {
    try {
        res.status(200).json(await User.find());
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

app.get("/api/user/:username", async (req, res) => {
    try {
        res.status(200).json(await User.find({ userName: req.params.username }));
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

app.get("/api/user/:username/books", async (req, res) => {
    try {
        res.status(200).json(await User.find( {userName: req.params.username }).populate('borrowedBooks'));
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// appoint newly borrowed books
app.post("/api/user/:username/books/:bookID", validateBookAndUser, async (req, res) => {
    try {
        const bookID = req.params.bookID;
        const username = req.params.username;

        await User.updateOne(
            { userName: username },
            { $push: { borrowedBooks: bookID } }
        );

        await Book.updateOne(
            { _id: bookID },
            { lastBorrowDate: new Date() }
        );

        res.status(200).json({ status: "success" });

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

// Return book
app.delete("/api/user/:username/books/:bookid", validateBookAndUser, async (req, res) => {
    try {
        const bookID = req.params.bookid;
        const username = req.params.username;

        await User.updateOne(
            { userName: username },
            { $pull: { borrowedBooks: bookID } }
        );

        res.status(200).json({ status: "success" });

    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

//
//  /api/books
//

app.get("/api/books", async (req, res) => {
    try {
        const canBorrow = req.query.canBorrow;

        if (canBorrow !== undefined) {
            const borrowedBooks = await User.aggregate([
                { $unwind: "$borrowedBooks" },
                { $group: { _id: null, borrowedBookIds: { $addToSet: "$borrowedBooks" } } }
            ]);
            
            const borrowedBookIds = borrowedBooks.length > 0 ? borrowedBooks[0].borrowedBookIds : [];
            const filter = canBorrow == "true" ? { _id: { $nin: borrowedBookIds } } : { _id: { $in: borrowedBookIds } };
            return res.status(200).json(await Book.find(filter));
        }

        res.status(200).json(await Book.find());
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

app.get("/api/books/:id", async (req, res) => {
    try {
        res.status(200).json(await Book.findById(req.params.id));
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// Serving
app.listen(8000, () => {
    console.log("Server is being served on localhost:8000...");
});