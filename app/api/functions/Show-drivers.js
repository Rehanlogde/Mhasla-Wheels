import { pool } from "../db.js";
export default async function Showingdrivers(req,res) {
    try{
    console.log("Over the server side inside the show drivers option.")
    const query = "SELECT * FROM drivers";
    const results = await pool.query(query)
    console.log(results.rows)
    if (results.rows.length !=0 ) {
        
        return  res.json({
            ok  : true,
            data : results.rows
        });
    }
    else{
        res.json({
            ok : false,
            message : "Server side issue! Not able to get the drivers data"
        })
    }
}
catch(e)
{
    return res.json({
        ok : false,
        message : 'Internal server error'
    })
}
    }