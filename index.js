require("dotenv").config();
const express = require("express");
const connectToMongo = require("./db/db");
var cors = require("cors");
const cookieParser =require("cookie-parser");

connectToMongo();
const app = express();
const port = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("pulic"));
app.use(cookieParser());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/bulk", require("./routes/bulk"));
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
