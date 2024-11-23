const express = require("express");
const oracledb = require("oracledb");
const dbConfig = require("./dbconfig");
const dotenv=require('dotenv')

const app = express();
dotenv.config();

async function initializeOracleConnection() {
  try {
    console.log("Connecting to Oracle Database...");
    const connection = await oracledb.getConnection(dbConfig);
    console.log("Connected to Oracle Database!");
  } catch (error) {
    console.error("Error connecting to Oracle Database:", error);
  }
}

initializeOracleConnection();

app.use(express.json());

const userRoutes=require('./routes/user')
const studentRoutes=require('./routes/student')
const trainerRoutes=require('./routes/trainer')
const courseRoutes=require('./routes/course')

app.use('/user',userRoutes)
app.use('/student',studentRoutes)
app.use('/trainer',trainerRoutes)
app.use('/course',courseRoutes)

app.get("/", (req, res) => {
  res.send("Welcome to the Oracle Connection Server!");
});


app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
