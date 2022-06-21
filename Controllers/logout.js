import SessionClass from "../Dbfunctions/new_session.js";

import { database_connection } from "../Common_functions/dbconnection.js";
let connection= database_connection;


let session_function = new SessionClass;


export async function logout(req,response) {                                                          //logout

    var username = req.body.username;
   // console.log(username);
    var msg;

    try{
       const result = await session_function.updateSessiondataFromDb(username,connection,0);

        console.log(result);
       
         msg = {
        success: true,
        message:"user logged-out success"

    };

    }
    catch(error){
        console.log("user logout failed");
        console.log(error);
        msg = {
            success: false,
            message:"user logout failed"

        };

    }


    response.status(200).json(msg);

    
}

//module.exports = logout;