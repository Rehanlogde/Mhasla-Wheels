import { pool } from "../db.js"

export default async function getCredits(req,res) {

    try{
    const emailid = req.body.emailid

    const dbquery = "SELECT mw_credits from customers where email = $1"

    const dbresult = await pool.query(dbquery, [emailid])

    if (dbresult.rowCount > 0) {
        console.log("This  is being passed : ", dbresult.rows[0]['amount'])
            return res.json({
                ok : true,
                data : dbresult.rows[0]['mw_credits']
            })
    }
    else{
        return res.json({
            ok:false,
            mesage : "Cannot get the your credits !"
        })
    }
}
catch(e) {
    console.log("Exception occurred ",e)

    return res.json({
        ok : false,
        message : "Internal server issue"
    })
}
}