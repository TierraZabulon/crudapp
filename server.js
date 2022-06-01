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

// const express = require("express");
// const bodyParser = require("body-parser");
// const app = express();
// const MongoClient = require("mongodb").MongoClient;

// MongoClient.connect(
//   "mongodb+srv://tzabulon:test123@cluster0.wk3ip.mongodb.net/?retryWrites=true&w=majority",
//   {
//     useUnifiedTopology: true,
//   }
// ).then((client) => {
//   console.log("Connected to Database");
//   const db = client.db("starwars");
//   const quotesCollection = db.collection("quotes");

//   app.use(bodyParser.urlencoded({ extended: true }));
//   app.get("/", (req, res) => {
//     res.sendfile(__dirname + "/index.html");
//   });
//   app.post("/quotes", (req, res) => {
//     quotesCollection
//       .insertOne(req.body)
//       .then((result) => {
//         console.log(result);
//       })
//       .catch((error) => console.error(error));
//   });
//   app.listen(3000, function () {
//     console.log("listening on 3000");
//   });
// });

// MongoClient.connect(
//   "mongodb+srv://tzabulon:test123@cluster0.wk3ip.mongodb.net/?retryWrites=true&w=majority",
//   {
//     useUnifiedTopology: true,
//   },
//   (err, client) => {
//     if (err) return console.log(err);
//     console.log("Connected to database");
//     const dataBase = client.dataBase("starwars");
//   }
// );

// MongoClient.connect(
//   "mongodb+srv://tzabulon:test123@cluster0.wk3ip.mongodb.net/?retryWrites=true&w=majority",{
//     useUnifiedTopology: true
//   })
//   (err, client) => {
//     if (err) return console.log(err);
//     console.log("Connected to database");
//   }
// );
//body parser goes before crud handlers

// app.listen(3000, function () {
//   console.log("listening on 3000");
// });
// app.get("/", (req, res) => {
//   res.send("hello world");
// });

//app handlers

// app.get("/", (req, res) => {
//   res.sendfile(
//     "/Users/tierra/desktop/desktop-tierra/100devs/crudapp/" + "/index.html"
//   );
// });
// app.post("/quotes", (req, res) => {
//   console.log(req.body);
// });
// "/Users/tierra/desktop/desktop-tierra/100devs/crudapp/";
