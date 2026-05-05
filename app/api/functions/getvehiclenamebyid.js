import {pool} from "../db.js"
export default async function gettingvehiclename(req,res) {
    try{
        const {vehicleid}  = req.body

    console.log("Got the ID", vehicleid)
    const dbquery = "SELECT * FROM mw_vehicles where vehicleid = $1"
    const {rows} = await pool.query(dbquery, [vehicleid])
    console.log(rows)
    console.log("returning success")
    if(rows.length > 0)
{    return  res.json({
    ok : true,
    message : "got the result",
        vehiclename : rows[0]['vehiclename'],
        capacity : rows[0]['capacity'],
        raterperekm  :rows['priceperkm']
    });}

else{
    return res.json({
        ok : false,
        message : "problem occurred"
    })
}
    }
    catch(err)
    {
        console.log("Error occurred : ", err)
        return res.json({
            ok : false,
            error : err,
            message :"error occurred"
        })
    }
}