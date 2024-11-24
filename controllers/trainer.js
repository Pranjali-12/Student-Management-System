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

exports.trainerRegistration = async (req, res) => {
    const { username, firstname, lastname, contact, department } = req.body;
    console.log(req.body)

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

        const checkQuery = `SELECT COUNT(*) AS COUNT FROM TRAINERS WHERE USER_ID = :id`;
        const result = await connection.execute(checkQuery, [user_id]);

        if (result.rows[0][0] > 0) {
            return res.status(400).json({ message: 'Trainer already exists' });
        }

        const query = `INSERT INTO TRAINERS (TRAINER_ID,USER_ID,FIRST_NAME,LAST_NAME,CONTACT,DEPARTMENT) VALUES ('T' || TRAINER_SEQ.NEXTVAL,:user_id, :firstname, :lastname, :contact, :department )`


        await connection.execute(query, [user_id, firstname, lastname, contact, department], { autoCommit: true });

        res.status(201).json({ message: 'Trainer registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


exports.trainerLogin=async(req,res)=>{
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

        const trainer_query=`SELECT U.USERNAME,T.FIRST_NAME,T.LAST_NAME,T.CONTACT,T.DEPARTMENT,T.HIRED_DATE FROM USERS U JOIN Trainers T ON T.USER_ID = U.USER_ID WHERE T.USER_ID=:user_id`

        const result=await connection.execute(trainer_query,[user_id],{ outFormat: oracledb.OUT_FORMAT_OBJECT })
        if (!result.rows[0]) {
            return res.status(400).json({ message: 'Trainer not exist' });
        }
        const Trainer=result.rows[0]

        const role='Trainer'

        const token=await jwt.sign({user_id,username,role},process.env.JWT_SECRET,{expiresIn:'2h'})
        
        res.status(201).json({ message: 'Login Successful !',Trainer,token });
    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}