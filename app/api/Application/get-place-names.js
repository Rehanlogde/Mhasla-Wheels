import { pool } from "../db.js"

export default async function PlacenamesGet(req,res) {
    var dbquery = "select * from placenames"

    const result = await pool.query(dbquery)

    if (result.rowCount >0) {
        
        var finaldata = result.rows

        return  res.status(200).json({
            ok : true,
            data : finaldata
        });
    }
    else{
        return  res.status(401).json({
            ok :false,
            message: 'Internal server error'
        });
    }
}