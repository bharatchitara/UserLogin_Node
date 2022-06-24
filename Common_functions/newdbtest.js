import DbOperation from "db_pkg";
// import { config } from "dotenv";
// import { database_connection } from "../Common_functions/dbconnection.js";

// database_connection;

//config({path:"../.env"});

//config();

//console.log(process.env.DB_HOST);


export async function test_db(req,res){
let query = "SELECT * FROM users LIMIT 2";

try{
    let selectData = await DbOperation.getData(query);
    console.log(selectData);

    res.send(selectData);
}
catch(error){
    console.log(error);
    res.send(error);
}

}

