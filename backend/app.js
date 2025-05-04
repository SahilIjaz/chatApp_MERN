const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());


const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/message", messageRoutes);

const globalErrors = require("./controllers/errControllers");
app.use(globalErrors);
module.exports = app;
// export default app;
