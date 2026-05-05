import { pool } from "../db.js"

export default async function Superuserdata(req,res) {
  try{
    const dbquery = "select * from superuser"

    const dbresult = await pool.query(dbquery)

    if (dbresult.rowCount > 0) {
     return res.json({
        ok : true,
        data : dbresult.rows
     })   
    }
    else{
        return res.json({
            ok : false,
            message : "No super users found !"
        })
    }
}
catch(e)
{
return res.json({
    ok : false,
    message :"Internal server issue"
})
}
}