const express = require("express");
const oracledb = require("oracledb");
const dbConfig = require("./dbconfig");

const app = express();
const PORT = 3000;


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
app.use('/user',userRoutes)
app.use('/student',studentRoutes)

app.get("/", (req, res) => {
  res.send("Welcome to the Oracle Connection Server!");
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
