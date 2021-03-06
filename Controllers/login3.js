/* eslint-disable no-unused-vars */
////...... system imports ////
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import DbOperation from "db_pkg";


////.....user defined imports ////
import SessionClass from "../Dbfunctions/new_session.js";
import Cipher from "../Common_functions/cipher.js";
import PasswordHash from "../Common_functions/password_hash.js";
/////


let cipher_function = new Cipher;
let password_hashing_function = new PasswordHash;
let session_function = new SessionClass;


export async function login(req,response) {                                                          //login function

    
    let message;
    let verify_password;                              
    response.status(200);
    let username = req.body.username;
    let password = req.body.password;

    if(!(username && password)){                                                           //check for username and password both are provided
        response.status(500).send("Please enter username and password");
    }

    let flag_user_exist = 0 ;

    let u_name= username;
    
    //console.log(process.env);

    //let query_result = {};
    let db_password = "";

    let output;

    let getUserData;
    
    try{

        let fetch_values = [u_name];

        const sql = "select * from users where email= ?";

        getUserData = await DbOperation.execCustomQuery(sql,fetch_values);

        db_password = getUserData[0].password;

        console.log(db_password);

        if(getUserData.length != 0){
            flag_user_exist = 1;
        }

        verify_password = password_hashing_function.verify_password(password,db_password);

        if(verify_password == false){
            // eslint-disable-next-line no-undef
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
            let get_user_name = getUserData[0].name;                                                      // fetch username and name from db/local stored 
            let get_user_email =  getUserData[0].email;

            
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

            
            let payload= [                                                                       //response payload
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

            //let encrypted_msg = encryption_script.encryption_f(JSON.stringify(payload));               //encrypting the payload @server, needs to be decrypt @ client side.
            let encrypted_msg = cipher_function.encryption_f(JSON.stringify(payload));
            
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
        response.status(401).json(message);
    }      

  
//connection.end();                                                                           //closing the connection
}




