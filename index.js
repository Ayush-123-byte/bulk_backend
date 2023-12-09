const connectToMongo = require("./db");
const express = require("express");
var cors = require("cors");
const fileupload= require("express-fileupload")

connectToMongo();
const app = express();
const port = process.env.PORT || 4000;
app.use(fileupload({
  useTempFiles:true
}))
app.use(cors());
app.use(express.json());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/bulk", require("./routes/bulk"));
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
