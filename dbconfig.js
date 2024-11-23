const dotenv=require('dotenv')
dotenv.config();

const dbConfig = {
    user: process.env.USER,
    password: process.env.PASSWORD,
    connectString: process.env.CONNECTSTRING,
};

module.exports = dbConfig;