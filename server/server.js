
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const dbo = require("./db/conn");
const app = express();

const port = process.env.PORT || 9000;

app.use(cors());
app.use(express.json());
app.use(require("./routes/record"));

app.get("/", function (req, res) {
  res.send("App is running");
});

async function startServer() {
  try {
    await dbo.connectToMongoDB();
    console.log("Successfully connected to MongoDB.");

    app.listen(port, () => {
      console.log("Server is running on port: " + port);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

startServer();
