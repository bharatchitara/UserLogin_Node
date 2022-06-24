/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
////...... system imports ////
import jwt from "jsonwebtoken";
//import { config } from "dotenv";
import cookieParser from "cookie-parser";
import DbOperation from "db_pkg";


////.....user defined imports ////
import SessionClass from "../Dbfunctions/new_session.js";
import Cipher from "../Common_functions/cipher.js";
import PasswordHash from "../Common_functions/password_hash.js";
/////


import { database_connection } from "../Common_functions/dbconnection.js";
let connection= database_connection;


// var connection = mysql.createConnection({
//     host : "reusable-modules.ckphk93ofay7.us-east-1.rds.amazonaws.com",
//     user : "admin",
//     password : "Rmodules$2022#",
//     database : "micro_systems"

// });



let cipher_function = new Cipher;
let password_hashing_function = new PasswordHash;
let session_function = new SessionClass;
//config();

export async function login(req,response) {                                                          //login function

    //..............check connection 
    connection.connect(function(err) {    
        if (err) {
          //return console.error('error: ' + err.message);
          response.status(500).json("DB connection failed");
          
        }
      
        console.log("Connected to the MySQL server.");
    });
    let message;
    let verify_password;                              
    response.status(200);
    var username = req.body.username;
    var password = req.body.password;

    if(!(username && password)){                                                           //check for username and password both are provided
        response.status(500).send("Please enter username and password");
    }

    var flag_user_exist = 0 ;

    var u_name= username;
    
    //console.log(process.env);

    //var query_result = {};
    var db_password = "";

    var output;
    
    try{

    const sql = `select * from users where email="${u_name}"`;
    
    const result = await new Promise((resolve,reject) => {
        connection.query(sql,(err,res)=> {
            if(err){
                output = { success: false };
                reject(err.message);
            }
            else{
                resolve(res);
                output = {success : true, msg: res};
            }
        });
    });


    db_password = output.msg[0].password;
    console.log(output.msg);


    if(output.msg.length != 0){
        flag_user_exist = 1;
    }

    verify_password = password_hashing_function.verify_password(password,db_password);

    if(verify_password == false){
        throw err;
    }
}

    catch
    {
        message = [
            {
            "success": false,
            "message": "Login failed"
        }
        ];

        response.status(401).json(message);
       // connection.end();
        return;

    }

    if(flag_user_exist == 1 ){                                                                   // first check username is exist in local parameter/db
        
        if(verify_password == true){
             var get_user_name = output.msg[0].name;                                                      // fetch username and name from db/local stored 
             var get_user_email =  output.msg[0].email;

             console.log(process.env.DB_HOST);
            
             const token = jwt.sign(                                                             //jwt token creation and storing in user table
                {user_data: get_user_name,get_user_email},                                      // payload
                process.env.TOKEN_KEY,                                                           
                {
                  expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
                }
            );
            
            const refreshToken = jwt.sign(
                {user_data: get_user_name,get_user_email}, 
                process.env.REFRESH_TOKEN_KEY, 
                { 
                    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
                }
                );


            console.log("from login ref"+refreshToken);
            console.log("from login acc"+token);
            
            var payload= [                                                                       //response payload
                {
                "name":get_user_name, 
                "email":get_user_email,
                "token":refreshToken 
                }
            ];

            
            response.cookie("userid",get_user_email);                                                     //saving the userid in cookies
           // response.cookie('accesstoken',token);                                                        //saving the token in cookies
           
            //const inserttoken = await session.insertSession(u_name,refreshToken);
            const inserttoken = await session_function.insertSession(u_name,refreshToken);
            console.log(inserttoken);


             message = [                                                                        //display message - for postman
            {
                "success": true,
                "message": "Login successfull."
            }
        ];

        //var encrypted_msg = encryption_script.encryption_f(JSON.stringify(payload));               //encrypting the payload @server, needs to be decrypt @ client side.
        var encrypted_msg = cipher_function.encryption_f(JSON.stringify(payload));
        
        console.log(encrypted_msg);
        
        response.status(200).json(message);     
            
        }
        else{

            message = [
                {
                "success": false,
                "message": "Login failed", 
                }
            ];
            response.clearCookie("userid");
            response.status(403).json(message);
        }
    }

    else{

        message = [
            {
            "success": false,
            "message": "login failed", 
            }
        ];
        response.clearCookie("JWT_token");
        response.status(401).json(message);
    }      

  
//connection.end();                                                                           //closing the connection
}




