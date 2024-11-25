# Student Management System - Backend

A backend system built with **Node.js** and **Oracle SQL** to manage students, courses, grades, and enrollments.

## Tech Stack
  - Node.js
  - Express.js
  - Oracle SQL
  - JWT Authentication

## Features
- **User Management**
- **Course Management**
- **Enrollment System**
- **Grade Management**
- **Authentication**

## Project Structure
- **Controllers**: Business logic for users, students, courses, enrollments, and grades.
- **Routes**: API endpoints for each module.
- **Middleware**: Token verification for authentication.
- **Database**: Oracle SQL schema and connection.

## Installation
1. Clone the repository and install dependencies:
   ```bash
   git clone <repository_url>
   cd student-management-system
   npm install
2. Set up the database using db.sql.
3. Configure the .env file with database credentials.
4. Start the server:
   ```bash
   node server.js
