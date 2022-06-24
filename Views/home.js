import { config } from "dotenv"; 
// eslint-disable-next-line no-unused-vars
import cookieParser from "cookie-parser";
import { checkAccessToken } from "../Middleware/accessTokenCheck.js";




config();
export function home(req,res){
    
    // const token = req.cookies["accesstoken"];
    // console.log("access token @home "+token);

//    let flag = 0; 

    // let user;
    // try{
    //     const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    //     user = decoded;
    //     console.log("user details @home: " +user+"and"+user.user_data);
    //     flag =1;
    //     console.log("value"+decoded);

    //     }
    
    // catch(error){
    //     console.log(error);
    //     app.use(verifyToken);
    //     // app.get(home());
        
    // }

    // //console.log(user);


    // let user_name = user.user_data;

    let message;
    try{
        checkAccessToken;

        message = {
            
                success: true,
                message: "welcome home"
        };

        res.status(200).json(message);
        

    }
    catch(error){
        message = {
         
            success: false,
            message: error
            
        };
        res.status(401).json(message);
         
    }

    

}

//module.exports = home;
