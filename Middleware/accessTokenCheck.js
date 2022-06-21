import jwt from "jsonwebtoken";
//import cookieParser from "cookie-parser";

import SessionClass from "../Dbfunctions/new_session.js";


const config = process.env;

let session_function = new SessionClass;

const checkAccessToken = async (req,res,next) => {
  
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {
            return res.status(401).json({"error": true, "message": "Unauthorized access." });
        }
      req.decoded = decoded;
      next();
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
        "error": true,
        "message": "No token provided."
    });
  }
};