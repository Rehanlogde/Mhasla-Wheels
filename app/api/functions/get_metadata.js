import { WhatsappAuthentication } from "twilio/lib/rest/content/v1/content.js"
import { pool } from "../db.js"

export default async function Getmetadata(req,res) {
try{
    const whattoget = req.params.name

    const query = `SELECT ${whattoget} from metadata_data`
    
    const result = await pool.query(query)

    if (result.rowCount > 0) {
        
        console.log(result.rows)
        return res.status(200).json({
            ok : true,
            message : "Got the data",
            data : result.rows[0][whattoget]
        })
    }
    else{
        return res.status(404).json({
            ok :false,
            message : "Cannot get the data"
        })
    }
}catch(e){
console.log(e)
return res.status(500).json({
    ok :false,
    message : "Failed to get the data"
})
}
}