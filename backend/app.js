const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());
// app.options("*", cors());

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);

const globalErrors = require("./controllers/errControllers");
app.use(globalErrors);
module.exports = app;
// export default app;
