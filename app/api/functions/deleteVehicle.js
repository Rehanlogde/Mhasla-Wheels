import { pool } from "../db.js"

export default async function deleteFunction(req,res) {
    const vehicleid = req.body.vehicleid

    console.log("vehicle id recieved  : ", vehicleid)

    const dbquery  = "DELETE FROM mw_vehicles where vehicleid = $1"

    const dbqueryresult = await pool.query(dbquery, [vehicleid])

    if (dbqueryresult.rowCount > 0) {
        return res.json({
            ok :true
            ,
            message : "Deleted successfully"
        })
    }
    else{
        return res.json({
            ok :false,
            message  : 'DB ISSUE'
        })
    }
}