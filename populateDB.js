require("dotenv").config();
const Jobs = require("./models/Job");
const jobsData = require("./jobsData.json");
const connectDB = require("./db/connect");

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await Jobs.deleteMany();
    await Jobs.create(jobsData);
    console.log("Success!!!");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
