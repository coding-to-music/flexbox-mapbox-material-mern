const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const middlewares = require("./middleware");
const entry = require("./api/entryRoute");
const path = require("path");
const port = process.env.PORT || 4000;

const app = express();

// app.use(express.static(path.join(__dirname, 'client/build')));

mongoose.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log("DB Connected Successfully");
  }
);

app.use(helmet());
app.use(morgan("common"));
app.use(cors());
app.use(express.json());

app.use("/api/entry", entry);
app.use("/api/entry/remove/:id", entry);
app.use("/api/entry/update/:id", entry);

// const __dirname = path.resolve();
// console.log("__dirname", __dirname);

const __parent = path.resolve(__dirname, "..");
// console.log("__parent", __parent);

const root = path.join(__parent, "client", "build");

console.log("root", root);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(root));
  app.get("*", (req, res) => res.sendFile("index.html", { root }));
} else {
  app.get("/", (req, res) => {
    res.send("API IS RUNNING......");
  });
}

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }

// app.get("/", (req, res) => {
//   res.json({
//     message: "You are server",
//   });
// });

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

app.listen(port, () => {
  console.log(`Listining at http://localhost:${port}`);
});
