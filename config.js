import mysql from "mysql";

const con = mysql.createConnection(
    {
        host:'localhost',
        user:"root",
        password:'',
        database:"data"
    });

    con.connect((err)=>{
        if(err)
            {
                console.warn("error in connection")
            }
            else
            {
                console.warn("connected")
            }
    });

    export default con