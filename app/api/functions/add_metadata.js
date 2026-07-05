import { pool } from "../db.js";

export default async function addmetadata(req,res)  {
    try{
    const {whattoupdate, data} = req.body;
console.log(whattoupdate, data)
console.log("query sending")    
const result = await pool.query(`UPDATE metadata_data SET ${whattoupdate} = $1 `, [data])
    console.log("query sent")
    if (result.rowCount > 0) {
        return res.status(200).json({
            ok : true,
            message : `${whattoupdate} is successfully updated to ${data}`
        })
    }
    else{
        return res.status(401).json({
            ok : false,
            message : `Failed to update : ${whattoupdate}`
        })
    }
    }
    catch(e)
    {
        console.log(e)
return res.status(500).json({
    ok : false,
    message : `Internal server error occurred`
})
    }
}