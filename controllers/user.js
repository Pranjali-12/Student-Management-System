const bcrypt = require('bcrypt');
const oracledb = require("oracledb");
const dbConfig = require("../dbconfig");

async function connectDB() {
    try {
        return await oracledb.getConnection(dbConfig);
    } catch (error) {
        console.error("Error establishing database connection:", error);
        throw error;
    }
}

exports.userRegistration = async (req, res) => {
    const { username, password, role, firstname, lastname, contact, department } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const connection = await connectDB();

        if (!connection) {
            throw new Error('Database connection not established');
        }
        const query = `INSERT INTO USERS (USER_ID, USERNAME, PASSWORD, ROLE) VALUES ('U' || USER_SEQ.NEXTVAL, :username, :password, :role)`;

        await connection.execute(query, [username, hashedPassword, role], { autoCommit: true });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}