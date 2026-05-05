import {pool} from "../db.js"

export default async function Superuser_bookings(req,res) {
    console.log("inside bookings functions !")
    try{
    const dbquery = "SELECT * FROM bookings"
      
    const result = await pool.query(dbquery)
        console.log("query executed !", result)
    if (dbquery.length >0) {    
        return  res.json({
            ok : true,
            data : result.rows
        });
    }
    else{
        return  res.json({
            ok : false,
            message : 'no bookings found !'
        });
    }}
    catch (e) {
        return  res.json({
            ok : false,
            message : "server side issue"
        });
    }
}