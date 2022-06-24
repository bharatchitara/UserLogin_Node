import DbOperation from "db_pkg";
import "db_pkg";

//let query  = "select id from user where id = 5";

let query = "SELECT * FROM users LIMIT 2";

try{
    let selectData = await DbOperation.getData(query);

}
catch(error){
    console.log(error);
}



