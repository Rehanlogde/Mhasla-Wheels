import { pool } from "../db.js"

export default async function allowAdminAcess(req,res)
{
    try{const toallow = req.body.toallow
    
    const dbquery = "update superuser set adminaccess = $1"

    const dbresult = await pool.query(dbquery,  [!toallow])

    console.log("somewhere here")
    if (dbresult.rowCount > 0) {
            return res.json({
                ok :true,
                message : "Superuser permission updated !"
            })
    }
    else{
        return res.json({
            ok :false,
            message : "Failed to update the permission"
        })
    }}
    catch(e)
    {
        console.log("exception occured ",  e)
        res.json({
            ok :false,
            message : "Internal server isssue !"
        })
    }
}   
