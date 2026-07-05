import { pool } from "../db"

export default async function Getmetadata(req,res) {
try{
    const whattoget = req.name

    const query = "SELECT $1 from metadata_data"
    
    const result = await pool.query(query, [whattoget])

    if (result.rowCount > 0) {
        
        return res.status(200).json({
            ok : true,
            message : "Got the data",
            data : result[0][0]
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