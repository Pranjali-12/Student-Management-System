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

exports.addCourse = async (req, res) => {
    const { role, user_id } = req.user;

    const { course_name } = req.body;

    try {
        const connection = await connectDB();
        console.log(role)
        console.log(user_id)

        if (!connection) {
            throw new Error('Database connection not established');
        }

        if (role != 'Trainer') {
            return res.status(400).json({ message: 'Not access to add course' });
        }

        const trainer_query = `SELECT TRAINER_ID FROM TRAINERS WHERE USER_ID=:user_id`

        const id = await connection.execute(trainer_query, [user_id])
        if (!id.rows[0]) {
            return res.status(400).json({ message: 'Trainer not exist' });
        }

        const trainer_id = id.rows[0][0];
        console.log(trainer_id)

        const query = `INSERT INTO COURSES(COURSE_ID,COURSE_NAME,TRAINER_ID) VALUES('C' || COURSE_SEQ.NEXTVAL,:course_name,:trainer_id)`
        await connection.execute(query, [course_name, trainer_id], { autoCommit: true })

        res.status(201).json({ message: 'Course registered successfully' });
    } catch (error) {
        console.error('Error while adding course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}