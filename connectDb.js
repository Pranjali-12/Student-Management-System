const dbConfig = require("./dbconfig");

xports.connectDB = async () => {
    try {
        console.log("Connecting to Oracle Database...");
        const connection = await oracledb.getConnection(dbConfig);
        console.log("Connected to Oracle Database!");
    } catch (error) {
        console.error("Error connecting to Oracle Database:", error);
    }
}