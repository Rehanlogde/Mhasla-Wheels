import { pool } from "../db.js";

export default async function Getdriverdetails(req,res) {
try{
    var dbquery = "SELECT id, name from drivers";

    var result = await pool.query(dbquery)
    if (result.rowCount > 0) {
        console.log("Got the drivers details", result)
         res.json({
            ok : true,
            driversnameandid : result.rows
         });
    }
    else{
        res.json({
            ok : false,
            message : "no drivers found in system!"
        })
    }
}
    catch(e)
    {
        res.json({
            ok : false,
            message : "Internal server issue"
        })
    }
}