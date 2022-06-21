import jwt from "jsonwebtoken";
import { config } from "dotenv"; 
import { verifyToken } from "../Middleware/authorization.js";
import cookieParser from "cookie-parser";

config();
export function home(req,res){
    
    const token = req.cookies["accesstoken"];
    console.log("the home"+token);

    let user;
    try{
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        user = decoded;
        console.log("value"+decoded);

        }
    
    catch(error){
        console.log(error);
        return;
       // verifyToken();
   
    }

    console.log(user);


    let user_name = user.user_data;
    
    res.status(200).json("Welcome home: "+user_name);

}

//module.exports = home;
