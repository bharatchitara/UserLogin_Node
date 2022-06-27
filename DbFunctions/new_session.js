/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-unused-lets */


import crypto from "crypto";
import DbOperation from "db_pkg";



const generate_session_key = async function(){
    return crypto.randomBytes(8).toString("base64");
};


export default class SessionClass{
    constructor(){

    }

async getUserID(username) {                                                          //getuserfromdb function
    let result;
    const u_name = username;

    let get_user_id;
    let user_id;

    try{
        //user_id = await this.getUserID(u_name).then(result => result.values[0].id);
        const get_sql = `select id from users where email="${u_name}"`;
        
        get_user_id = await DbOperation.getData(get_sql);
       // user_id = await getUserID(u_name);
        
        user_id = get_user_id[0].id;

        console.log("the user is "+get_user_id[0].id);  
        
        result = user_id;
        }

    catch(error){
        console.log(error);
        console.log("User not exist");
        result = {success:false,msg:error};
        return result;
    }
    return result;
}



async  insertSession(username,refreshtoken){
    let result;

    const u_name = username;
    const ref_token = refreshtoken;

   // console.log("refresh token is "+refreshtoken);
    //console.log("reftoken is " +ref_token);

    const generate_session_id = await generate_session_key().then(result);
    
    let get_user_id;
    let user_id;

    try{
        //user_id = await this.getUserID(u_name).then(result => result.values[0].id);
        const get_sql = `select id from users where email="${u_name}"`;
        
        get_user_id = await DbOperation.getData(get_sql);
       // user_id = await getUserID(u_name);
        
        user_id = get_user_id[0].id;

        console.log("the user is "+get_user_id[0].id);   
        }

    catch(error){
        console.log(error);
        console.log("User not exist");
        result = {success:false,msg:error};
        return result;
    }

    let currentdate;
    currentdate = new Date().toISOString().slice(0, 19).replace("T", " ");
    console.log(currentdate);
    console.log(ref_token);

    let insert_table = "sessions"; 
    let flag_insert_success = 0 ;
    
    let fieldsData = [
        "session_id",
        "user_id",
        "login_time",
        "token"
    ];
    let valuesData = [
            [
            generate_session_id,
            user_id,
            currentdate,
            ref_token                       
            ]
    ];


    try{
        await DbOperation.insertData("sessions",fieldsData,valuesData);
        flag_insert_success = 1;
        result =  {success:true,msg:"session inserted"};
    }
    catch(error){
        console.log("esbsjb");
        console.log(error);
        result =  {success:false,msg:"session insertion failed"};
    }

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
            "id": returned_max_user_id-1
        };



    if(flag_insert_success == 1){
        try{
            await DbOperation.updateData("sessions",updateData,condData);
            result = {
                success: true,
                message:"previous session ended."
               };
        }
        catch(error){
            console.log("updating error"+error);
            result = {
                success: false,
                message:"previous session update failed."
               };
        }

    }


       console.log(result);
       return result;
}


//insertSession('ps@test.com','1234');
//connection.end();


async getSessiondataFromDb(username){
    let result;

    const u_name = username;
    //const ref_token = refreshtoken;

    //const generate_session_id = await generate_session_key().then(result);
    

    try{
        let user_id = await this.getUserID(u_name).then(result => result.values[0].id);
        console.log("the user is "+user_id);   
        }

    catch(error){
        console.log("User not exist");
        result = {success:false,msg:error};
        return result;
    }

    const query = `
    select se.user_id,se.login_time from sessions as se inner join users as us 
    on se.user_id = us.id where logout_time is null and login_time = 
    (select max(login_time) from sessions where user_id = (select distinct id from users where id = "${u_name}"))`;

    try{
        const response  = await new Promise((resolve,reject) =>{
            connection.query(query,(err,results) =>{
                if(err){
                    result = {success:false, msg:err};
                    reject(err.message);
                }
                else{
                    resolve(results);
                    if(results.length ==0)
                        result = {success:false,msg:"user not exist",values: results};
                    else
                        result =  {success:true,msg:"user fetched",values: results};
                }
        });
    });

} 

catch(error){
    console.log("session table insertion failed",error);
    result = {success:false,msg:error};
}
       console.log(result);
       return result;
}



async  updateSessiondataFromDb(username,db_connection,to_update_previous_session){
    let result;

    let flag_is_previous_session  = to_update_previous_session;                          // if val - 1 , then to update previous session logout time, at the time of login. 
    connection = db_connection;

    const u_name = username;
    
    let user_id;

    let currentdate;
    currentdate = new Date().toISOString().slice(0, 19).replace("T", " ");
    console.log(currentdate);

    try{
        //console.log(u_name);
        user_id = await this.getUserID(u_name);
        console.log("the user is "+user_id);   
        }

    catch(error){
        console.log("User not exist");
        result = {success:false,msg:error};
        return result;
    }

    let query;

    if (flag_is_previous_session == 1 ){
        query = `update sessions set logout_time = "${currentdate}" 
                    where user_id = "${user_id}" and id = (select * from(select max(id)-1 

                    from sessions where user_id = "${user_id}") temptable)`;

    }

    else{
    query = `update sessions set logout_time = "${currentdate}" 
                    where user_id = "${user_id}" and id = (select * from(select max(id) 
                    from sessions where user_id = "${user_id}") temptable)`;
    }

    try{
        const response  = await new Promise((resolve,reject) =>{
            connection.query(query,(err,results) =>{
                if(err){
                    result = {success:false, msg:err};
                    reject(err.message);
                }
                else{
                    resolve(results);
                    if(results.length ==0)
                        result = {success:false,msg:"session update failed",values: results};
                    else
                        result =  {success:true,msg:"session update success",values: results};
                }
        });
    });

} 

catch(error){
    console.log("session updation failed",error);
    result = {success:false,msg:error};
}
       console.log(result);
       return result;
}


async  fetchSessiondata(username){

    let result;
   // connection = db_connection;

    let get_session_data;
 
    const query = `
    select session_id, token from sessions where id = (select max(id) from sessions) and logout_time is null;`;

        try{
            
            get_session_data = await DbOperation.getData(query);
            
            result =  {success:true,msg:"query passed",output:get_session_data};
        }

        catch(error){
            console.log(error);
            
            result = {success:false,msg:"query failed",output:get_session_data};
        }




        return result;

}

}


//export default { getUserID, insertSession, getSessiondataFromDb, updateSessiondataFromDb};

//module.exports = getUserID,insertSession,getSessiondataFromDb, updateSessiondataFromDb;

// module.exports.insertSession= insertSession;
// module.exports.getUserID = getUserID;
// module.exports.getSessiondataFromDb= getSessiondataFromDb;
// module.exports.updateSessiondataFromDb = updateSessiondataFromDb;
// module.exports.fetchSessiondata = fetchSessiondata;



// let classobj = new SessionClass;

// console.log(classobj.insertSession("bharat@test.com","1234"));
