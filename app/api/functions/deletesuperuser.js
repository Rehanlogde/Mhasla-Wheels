
import { pool } from "../db.js"

export default async function Deletesuperuser(req,res) {
    try{

        console.log("deleting")
    const email  = req.body.emailid
    const dbquery  = "delete from superuser where email = $1"

    const dbresult = await pool.query(dbquery, [email])

    if (dbresult.rowCount > 0) {
        return res.json({
            ok : true ,
            message : `Super user with email ${email} is deleted successfully`
        })
    }
    else{
        return res.json({
            ok : false,
            message : "Unable to perform delete operation at the moment"
        })
    }}
    catch(e)
    {
        return res.json({
            ok :false,
            message : "Internal server issue"
        })
    }
}