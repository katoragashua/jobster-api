require("dotenv").config();
require("express-async-errors");
const path = require("path");
const User = require("./models/User");
const Job = require("./models/Job");
const jobsData = require("./jobsData.json");

// extra security packages
const helmet = require("helmet");
const xss = require("xss-clean");

const express = require("express");
const app = express();

const connectDB = require("./db/connect");
const { authenticateUser, testUser } = require("./middleware/authentication");
// routers
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");
// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// This is for the rate limiter
app.set("trust proxy", 1);

app.use(express.static(path.resolve(__dirname, "./client/build")));
app.use(express.json());
// Security packages
app.use(helmet());
app.use(xss());

// API routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter);

// Non-API routes
// We want to serve our index.html in the build folder for all get requests from non-API routes

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
