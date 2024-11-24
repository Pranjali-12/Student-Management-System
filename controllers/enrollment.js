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

exports.enrollCourse = async (req, res) => {
    const { role, user_id } = req.user;

    const { course_name } = req.body;

    try {
        const connection = await connectDB();
        console.log(role)
        console.log(user_id)

        if (!connection) {
            throw new Error('Database connection not established');
        }

        if (role != 'Student') {
            return res.status(400).json({ message: 'Not access to enroll into course' });
        }

        const student_query = `SELECT STUDENT_ID FROM STUDENTS WHERE USER_ID=:user_id`

        const id = await connection.execute(student_query, [user_id])
        if (!id.rows[0]) {
            return res.status(400).json({ message: 'Student not exist' });
        }

        const student_id = id.rows[0][0];
        console.log(student_id)

        const course_query = `SELECT COURSE_ID FROM COURSES WHERE COURSE_NAME=:course_name`

        const id_ = await connection.execute(course_query, [course_name])
        if (!id_.rows[0]) {
            return res.status(400).json({ message: 'Course not exist' });
        }

        const course_id = id_.rows[0][0];
        console.log(course_id)

        const query=`INSERT INTO ENROLLMENTS(ENROLLMENT_ID,STUDENT_ID,COURSE_ID) VALUES('E' || ENROLLMENT_SEQ.NEXTVAL,:student_id,:course_id)`
        await connection.execute(query,[student_id,course_id],{autoCommit:true})

        res.status(201).json({ message: 'Course Enrolled successfully' });
    } catch (error) {
        console.error('Error while adding course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


exports.enrolledCourses=async(req,res)=>{
    const {user_id}=req.user

    try {
        const connection = await connectDB();

        if (!connection) {
            throw new Error('Database connection not established');
        }

        const query = `SELECT C.COURSE_ID,C.COURSE_NAME,C.TRAINER_ID FROM COURSES C JOIN ENROLLMENTS E ON C.COURSE_ID=E.COURSE_ID WHERE E.STUDENT_ID=(SELECT STUDENT_ID FROM STUDENTS WHERE STUDENTS.USER_ID=:user_id)`

        const result = await connection.execute(query,[user_id],{ outFormat: oracledb.OUT_FORMAT_OBJECT })

        console.log(result)
        res.status(201).json(result.rows );

    } catch (error) {
        console.error('Error while fetching enrolled courses:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}