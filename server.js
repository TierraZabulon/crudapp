const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const connectionString =
  "mongodb+srv://tzabulon:test123@cluster0.wk3ip.mongodb.net/?retryWrites=true&w=majority";
MongoClient.connect(
  connectionString,
  {
    useUnifiedTopology: true,
  },
  (err, client) => {
    if (err) return console.error(err);
    console.log("Connected to Database");
    const db = client.db("starwars");
    const quotesCollection = db.collection("quotes");
    app.set("view engine", "ejs");
    //app set is always placed before any appuse,get,post methods
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(express.static("public"));
    app.use(bodyParser.json());
    app.get("/", (req, res) => {
      quotesCollection
        .find()
        .toArray()
        .then((results) => {
          res.render("index.ejs", { quotes: results });
          console.log(results);
        })
        .catch((error) => console.error(error));
    });
    app.post("/quotes", (req, res) => {
      quotesCollection
        .insertOne(req.body)
        .then((result) => {
          res.redirect("/");
        })
        .catch((error) => console.error(error));
    });
    app.put("/quotes", (req, res) => {
      quotesCollection
        .findOneAndUpdate(
          { name: "Yoda" },
          {
            $set: {
              name: req.body.name,
              quote: req.body.quote,
            },
          },
          {
            upsert: true,
          }
        )
        .then((result) => {
          res.json("Success");
        })
        .catch((error) => console.error(error));
    });
    app.delete("/quotes", (req, res) => {
      //Handle delete event
      quotesCollection
        .deleteOne(
          { name: req.body.name } //name is coming from fetch request
        )
        .then((result) => {
          if (result.deletedCount === 0) {
            return res.json("No quote to delete");
          }
          res.json("Deleted Darth Vader Quote");
        })
        .catch((error) => console.error(error));
    });
    app.listen(3000, function () {
      console.log("Listening now");
    });
  }
);

