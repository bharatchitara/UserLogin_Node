import mysql from "mysql";
//import { config } from "dotenv";

//config();

console.log(process.env.DB_HOST);

export const database_connection = mysql.createConnection({
    host : process.env.DB_HOST,
    //port: process.env.MYSQL_PORT,
    user : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE

});

