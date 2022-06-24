/* eslint-disable no-undef */
import jwt from "jsonwebtoken";
import { config } from "dotenv";
// eslint-disable-next-line no-unused-vars
import cookieParser from "cookie-parser";

import SessionClass from "../Dbfunctions/new_session.js";


import { database_connection } from "../Common_functions/dbconnection.js";
let connection= database_connection;


config();

let session_function = new SessionClass;


export const verifyToken =  async(req, res, next) => {
  
  //const token = req.body.token || req.query.token || req.headers["x-access-token"] || req.cookies;
  const u_name = req.cookies["userid"];
  //const accesstoken = req.cookies['accesstoken'];
  // console.log(token);
  
  let fetchrefreshtoken;
  let fetchsession;   

  const get_user_email = u_name;

  
      try{
        

        fetchrefreshtoken = await session_function.fetchSessiondata(u_name,connection).then(result => result.values[0].token);
        fetchsession = await session_function.fetchSessiondata(u_name,connection).then(result => result.values[0].session_id);

       
        }

      catch(error){
        //console.log('User not exist');
        console.log(error);
        let result = {success:false,msg:error};
        return result;
      }

      //console.log("the data is " +fetchrefreshtoken);

  
  if(!fetchsession){
    res.status(401).send("no active session found against the user");
  }

  if(!fetchrefreshtoken){
    res.status(403).send("No refresh token found, Please login again.");
  }

  try {
   // console.log(fetchrefreshtoken);
    const decoded = jwt.verify(fetchrefreshtoken, process.env.REFRESH_TOKEN_KEY);
    req.user = decoded;
    

  } catch (err) {
    console.log(err);
    res.status(401).send("Invalid Token, authorization check failed. Please login again");
  }

  const accesstoken = jwt.sign(                                                             //jwt token creation and storing in user table
                {user_data:get_user_email},                                      // payload
                process.env.TOKEN_KEY,                                                           
                {
                  expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
                }
            );
  
  console.log("access token @auth: "+accesstoken);
  
  res.cookie("accesstoken",accesstoken);     
                

  return next();
};



//module.exports = verifyToken;