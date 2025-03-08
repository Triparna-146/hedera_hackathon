const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const certificateRoutes = require("./routes/certificateRoutes");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/certificate", certificateRoutes);

module.exports = app;
