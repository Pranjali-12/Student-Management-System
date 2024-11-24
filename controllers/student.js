const bcrypt = require('bcrypt');
const oracledb = require("oracledb");
const dbConfig = require("../dbconfig");
const jwt = require('jsonwebtoken');

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

        if (!id.rows[0]) {
            return res.status(400).json({ message: 'User not exist' });
        }

        console.log(id.rows[0][0])
        const user_id = id.rows[0][0];

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


exports.studentLogin=async(req,res)=>{
    const { username, password } = req.body;

    try {
        const connection = await connectDB();

        if (!connection) {
            throw new Error('Database connection not established');
        }

        const user_query=`SELECT USER_ID FROM USERS WHERE USERNAME=:username AND PASSWORD=:password`

        const id=await connection.execute(user_query,[username,password])
        if (!id.rows[0]) {
            return res.status(400).json({ message: 'User not exist' });
        }

        const user_id=id.rows[0][0]
        console.log("UserId",user_id)

        const student_query=`SELECT U.USERNAME,S.FIRST_NAME,S.LAST_NAME,S.CONTACT,S.CITY,S.DEPARTMENT,S.ADMISSION_DATE FROM USERS U JOIN STUDENTS S ON S.USER_ID = U.USER_ID WHERE S.USER_ID=:user_id`

        const result=await connection.execute(student_query,[user_id],{ outFormat: oracledb.OUT_FORMAT_OBJECT })


        // By nested query
        // const student_query=`SELECT U.USERNAME,S.FIRST_NAME,S.LAST_NAME,S.CONTACT,S.CITY,S.DEPARTMENT,S.ADMISSION_DATE FROM USERS U JOIN STUDENTS S ON S.USER_ID = U.USER_ID WHERE S.USER_ID=(SELECT USER_ID FROM USERS WHERE USERNAME=:username AND PASSWORD=:password)`

        // const result=await connection.execute(student_query,[username,password],{ outFormat: oracledb.OUT_FORMAT_OBJECT })
        if (!result.rows[0]) {
            return res.status(400).json({ message: 'Student not exist' });
        }
        const student=result.rows[0]

        const role='Student'

        const token=await jwt.sign({user_id,username,role},process.env.JWT_SECRET,{expiresIn:'2h'})
        
        res.status(201).json({ message: 'Login Successful !',student,token });
    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}