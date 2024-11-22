CREATE TABLE USERS (
    USER_ID VARCHAR2(50) PRIMARY KEY,
    USERNAME VARCHAR2(50) NOT NULL UNIQUE,
    PASSWORD VARCHAR2(1000) NOT NULL,
    ROLE VARCHAR2(20) CHECK (ROLE IN ('ADMIN', 'TEACHER', 'STUDENT')),
    CREATED_AT DATE DEFAULT SYSDATE
);

CREATE SEQUENCE USER_SEQ
START WITH 1
INCREMENT BY 1
NOCACHE;

SELECT CONSTRAINT_NAME, SEARCH_CONDITION 
FROM USER_CONSTRAINTS 
WHERE TABLE_NAME = 'USERS' AND CONSTRAINT_TYPE = 'C';

ALTER TABLE USERS DROP CONSTRAINT SYS_C007080;  --  CONSTRAINT SYS_C007080 --> ROLE VARCHAR2(20) CHECK (ROLE IN ('ADMIN', 'TEACHER', 'STUDENT')),

ALTER TABLE USERS
MODIFY ROLE VARCHAR2(20) CHECK (ROLE IN ('Admin', 'Trainer', 'Student'))

COMMIT;

SELECT * FROM USERS;

CREATE TABLE STUDENTS (
    STUDENT_ID VARCHAR2(50) PRIMARY KEY,
    USER_ID VARCHAR2(50) REFERENCES USERS(USER_ID),
    FIRST_NAME VARCHAR2(50) NOT NULL,
    LAST_NAME VARCHAR2(50) NOT NULL,
    CONTACT VARCHAR2(100),
    CITY VARCHAR2(50),
    DEPARTMENT VARCHAR2(50),
    ADMISSION_DATE DATE DEFAULT SYSDATE
);

CREATE SEQUENCE STUDENT_SEQ
START WITH 1
INCREMENT BY 1
NOCACHE;

SELECT * FROM STUDENTS;

CREATE TABLE TRAINERS (
    TRAINER_ID VARCHAR2(50) PRIMARY KEY,
    USER_ID VARCHAR2(50) REFERENCES USERS(USER_ID),
    FIRST_NAME VARCHAR2(50) NOT NULL, 
    LAST_NAME VARCHAR2(50) NOT NULL,
    CONTACT VARCHAR2(100),
    DEPARTMENT VARCHAR2(50),
    HIRED_DATE DATE DEFAULT SYSDATE
);

CREATE TABLE COURSES (
    COURSE_ID VARCHAR2(50) PRIMARY KEY,
    COURSE_NAME VARCHAR2(100) NOT NULL,
    TRAINER_ID VARCHAR2(50) REFERENCES TRAINERS(TRAINER_ID),
    CREATED_AT DATE DEFAULT SYSDATE
);

CREATE TABLE ENROLLMENTS (
    ENROLLMENT_ID VARCHAR2(50) PRIMARY KEY,
    STUDENT_ID VARCHAR2(50) REFERENCES STUDENTS(STUDENT_ID),
    COURSE_ID VARCHAR2(50) REFERENCES COURSES(COURSE_ID),
    ENROLLED_AT DATE DEFAULT SYSDATE
);

CREATE TABLE GRADES (
    GRADE_ID VARCHAR2(50) PRIMARY KEY,
    STUDENT_ID VARCHAR2(50) REFERENCES STUDENTS(STUDENT_ID),
    COURSE_ID VARCHAR2(50) REFERENCES COURSES(COURSE_ID),
    GRADE CHAR(1) CHECK (GRADE IN ('A', 'B', 'C', 'D', 'F')),
    ASSIGNED_AT DATE DEFAULT SYSDATE
);

CREATE TABLE ATTENDANCE (
    ATTENDANCE_ID VARCHAR2(50) PRIMARY KEY,
    STUDENT_ID VARCHAR2(50) REFERENCES STUDENTS(STUDENT_ID),
    COURSE_ID VARCHAR2(50) REFERENCES COURSES(COURSE_ID),
    ATTENDANCE_DATE DATE NOT NULL,
    STATUS CHAR(1) CHECK (STATUS IN ('P', 'A'))
);

