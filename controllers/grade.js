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

exports.markGrade = async (req, res) => {
    const { role, user_id } = req.user;

    const { student_id,course_name,grade } = req.body;

    try {
        const connection = await connectDB();
        console.log(role)
        console.log(user_id)

        if (!connection) {
            throw new Error('Database connection not established');
        }

        if (role != 'Trainer') {
            return res.status(400).json({ message: 'Not access to assign the grade' });
        }

        const trainer_query = `SELECT TRAINER_ID FROM TRAINERS WHERE USER_ID=:user_id`

        const id = await connection.execute(trainer_query, [user_id], { autoCommit: true })

        if (!id.rows[0]) {
            return res.status(400).json({ message: 'Trainer not exist' });
        }

        const trainer_id = id.rows[0][0]


        const course_query = `SELECT COURSE_ID FROM COURSES WHERE COURSE_NAME=:course_name`

        const id_ = await connection.execute(course_query, [course_name], { autoCommit: true })

        if (!id_.rows[0]) {
            return res.status(400).json({ message: 'Course not exist' });
        }

        const course_id = id_.rows[0][0]



        const query = `INSERT INTO GRADES(GRADE_ID,STUDENT_ID,COURSE_ID,GRADE,ASSIGNED_BY) VALUES ('G'|| GRADE_SEQ.NEXTVAL,:student_id,:course_id,:grade,:trainer_id)`

        await connection.execute(query, [student_id, course_id, grade, trainer_id], { autoCommit: true })

        res.status(201).json({ message: 'Grade marked successfully' });


    } catch (error) {
        console.error('Error while adding course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

