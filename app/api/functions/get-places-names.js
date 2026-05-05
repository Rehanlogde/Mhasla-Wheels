import { pool } from "../db.js"

export default async function Getplacenames(req,res) {
    var dbquery = "select * from placenames"

    const result = await pool.query(dbquery)

    if (result.rowCount >0) {
        
        var finaldata = result.rows

        return  res.json({
            ok : true,
            data : finaldata
        });
    }
    else{
        return  res.json({
            ok :false,
            message: 'Internal server error'
        });
    }
}