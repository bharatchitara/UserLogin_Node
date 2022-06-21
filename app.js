import { login } from "./Controllers/login3.js";
import { home } from "./Views/home.js";
import { verifyToken } from "./Middleware/authorization.js";
import { logout } from "./Controllers/logout.js";


import express from "express";
import bodyParser from "body-parser";
import { config } from "dotenv";
import cookieParser from "cookie-parser";

config();

const PORT = process.env.API_PORT || 5000;
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const app = express();
app.disable("x-powered-by");

app.use(cookieParser());

//routes
    // create server 
    app.listen(PORT, () => {
        console.log("Server is up and running on localhost:"+ PORT);
    });


    app.post("/login",urlencodedParser,login);                                            //login page 
 
    app.get("/home",verifyToken,home);                                                    //home page - success after, JWT check pass

    app.post("/logout",urlencodedParser,logout);                                          //logout page


