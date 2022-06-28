import express from "express";
import { login } from "../Controllers/login3.js";
import { home } from "../Views/home.js";
import { verifyToken } from "../Middleware/authorization.js";
import { logout } from "../Controllers/logout.js";
import { test_db } from "../Common_functions/newdbtest.js";


import bodyParser from "body-parser";



const urlencodedParser = bodyParser.urlencoded({ extended: false });


const userroutes = express.Router();


userroutes.post("/login",urlencodedParser,login);                                            //login page 

userroutes.get("/home",verifyToken,home);                                                    //home page - success after, JWT check pass

userroutes.post("/logout",urlencodedParser,logout);                                          //logout page

userroutes.get("/getdata",urlencodedParser,test_db);




export {userroutes};