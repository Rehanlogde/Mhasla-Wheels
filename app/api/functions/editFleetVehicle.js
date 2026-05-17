import { resolveSoa } from "node:dns"
import { pool } from "../db.js"
import { parse } from "node:path"

export default async function editVehicle(req,res) {
    try{
    const {vehiclename, vehicleid, capacity, year, safetydescription, priceperkm}= req.body

    const dbquery = "UPDATE mw_vehicles SET vehiclename = $1, capacity = $2, year = $3, vehiclesafety = $4, priceperkm = $5 where vehicleid = $6" 

    const dbresult = await pool.query(dbquery, [vehiclename, capacity, year, safetydescription, parseInt(priceperkm), vehicleid ])
    if (dbresult.rowCount > 0) {
        return res.json({
            ok : true
        })
    }
    else{
        return res.json({
            ok : false,
            message : "DB ISSUE"
        })
    }
}catch(e)
{
return res.json({
    ok : false,
    message : "Internal server error"
})
}
}