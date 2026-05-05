import { pool } from "../db.js"

export default async function Emailverificationcodeverifying(req,res)
{
const {email,code } = req.body

console.log(email,code) 

    const dbquery = "select code from emailverificationcodes where emailid = $1"
    const result = await pool.query(dbquery,[email])

    if (result.rowCount>0) {
        console.log("got the result")
        if (code === result.rows[0].code) {
        
        return res.json(
            {
                ok : true,
                message : 'verified successfully'
            }
        )
    }
    else{
        return res.json({
            ok : false,
            message : "Verification failed"
        })
    }
    }
    else{
        return  res.json({
            ok : false,
            message : "DB ISSUE"
        });
    }

}