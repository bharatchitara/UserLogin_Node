import DbOperation from "db_pkg";




export async function test_db(req,res){

    //let criteria = "id = ?";

    let values = [5];

    // eslint-disable-next-line quotes
    let query = `SELECT * FROM users where id = ?`;

    try{
        let selectData = await DbOperation.execCustomQuery(query ,values);
        console.log(selectData);

        res.send(selectData);
    }
    catch(error){
        console.log(error);
        res.send(error);
    }

}

