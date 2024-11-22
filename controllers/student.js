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

exports.studentRegistration = async (req, res) => {
    const { username, firstname, lastname, contact, city, department } = req.body;

    try {

        const connection = await connectDB();

        if (!connection) {
            throw new Error('Database connection not established');
        }

        const id_query = `SELECT USER_ID FROM USERS WHERE USERNAME = :username`
        const id = await connection.execute(id_query, [username]);
        console.log(id.rows[0][0])
        const user_id=id.rows[0][0];

        const checkQuery = `SELECT COUNT(*) AS COUNT FROM STUDENTS WHERE USER_ID = :id`;
        const result = await connection.execute(checkQuery, [user_id]);

        if (result.rows[0][0] > 0) {
            return res.status(400).json({ message: 'Student already exists' });
        }

        const query = `INSERT INTO STUDENTS (STUDENT_ID,USER_ID,FIRST_NAME,LAST_NAME,CONTACT,CITY,DEPARTMENT) VALUES ('S' || STUDENT_SEQ.NEXTVAL,:user_id, :firstname, :lastname, :contact, :city, :department )`


        await connection.execute(query, [user_id, firstname, lastname, contact, city, department], { autoCommit: true });

        res.status(201).json({ message: 'Student registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}