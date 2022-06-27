import DbOperation from "db_pkg";




export async function test_db(req,res){
let query = "SELECT * FROM users LIMIT 2";

try{
    let selectData = await DbOperation.getData(query);
    console.log(selectData);

    res.send(selectData);
}
catch(error){
    console.log(error);
    res.send(error);
}

}

