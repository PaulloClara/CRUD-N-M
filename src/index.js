require("dotenv").config();

const cors = require("cors");
const morgan = require("morgan");
const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(cors());

require("./routes").config(app);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`\n\t\tServer running in localhost:${port} 🚀`);
});
