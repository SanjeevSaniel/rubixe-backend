// require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
// const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sessionstorage = require("sessionstorage");

app.use(cors());
app.use(express.json());

const user = [];
let lastId = user.length;

const port = process.env.PORT || 5000;

let accessToken = "";

function auth(req, res, next) {
  const header = req.headers["Authorization"];
  console.log(typeof header);
  if (typeof header !== "undefined") {
    const bearer = header.split(" ");
    const token = bearer[1];
    req.token = token;
  }

  try {
    const tokenVerified = jwt.verify(token, "secret");

    console.log("email", tokenVerified);
    next();
  } catch (e) {
    res.status(401).send({ error: "Invalid-Token" });
  }
}

app.get("/", (req, res) => res.send("Express"));

app.post("/register", (req, res) => {
  user.push({
    _id: ++lastId,
    stamp: Date(),
    name: req.body.name,
    email: req.body.email,
    mobileNumber: req.body.mobileNumber,
  });
  accessToken = jwt.sign(req.body.email, "secret");
  sessionstorage.setItem("token", accessToken);
  console.log(accessToken);
  res.status(201).send(accessToken);
});

app.post("/login", (req, res) => {
  const header = req.headers["authorization"];
  console.log("header", header);

  try {
    const tokenVerified = jwt.verify(header, "secret");
    console.log("email", tokenVerified);
    res.status(201).send("Success");
  } catch (e) {
    console.log("Error");
    res.status(401).send("Invalid Credentials");
  }

  console.log("User", user);
});

app.listen(port, console.log("Server is running"));
