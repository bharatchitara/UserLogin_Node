import SessionClass from "../Dbfunctions/new_session.js";

import { database_connection } from "../Common_functions/dbconnection.js";
let connection= database_connection;

import DbOperation from "db_pkg";

let session_function = new SessionClass;


export async function logout(req,response) {                                                          //logout

    var username = req.body.username;
   
    let result;

    let u_name = username;

    let user_id = await session_function.getUserID(u_name);

    var currentdate = new Date().toISOString().slice(0, 19).replace("T", " ");
   

    let get_max_id;
    let get_max_id_from_session;
    let returned_max_user_id;

    try{
        get_max_id = `select max(id) as maxid from sessions where user_id = "${user_id}"`;
        
        get_max_id_from_session = await DbOperation.getData(get_max_id);
     
        returned_max_user_id = get_max_id_from_session[0].maxid;
 
    }

    catch(error){
        console.log("error in fetching max id"+error);
    }

    let updateData = 
        {   
        "logout_time": currentdate                           
        };
    
    let condData = 
        {   
            "user_id": user_id,
            "id": returned_max_user_id
        };



    try{
        await DbOperation.updateData("sessions",updateData,condData);
        result = {
            success: true,
            message:"session ended successfully."
            };
    }
    catch(error){
        console.log("updating error"+error);
        result = {
            success: false,
            message:"session update failed."
            };
    }

    
    response.status(200).json(result);

    

}

//module.exports = logout;