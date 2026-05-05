import { pool } from "../db.js"

export default async function Phonenumberverification(req,res) {
    const {useremail, code} = req.body

    const dbquery = "SELECT * from phonenumberverification where useremail = $1 AND code =$2"

    const dbresult = await pool.query(dbquery, [useremail, code])

    if (dbresult.rowCount > 0) {

        const dbquery2 = "DELETE FROM phonenumberverification where useremail = $1"
        const dbresult2 = await pool.query(dbquery2, [useremail])

        if (dbresult2.rowCount > 0) {
            
            return res.json({
                ok : true,
                message : "Phone number Verified"
            })
        }
        else{
            return res.json({
                ok : false,
                message : "Phone number verified but failed to proceed further"
            })
        }
    }
    else{
        return res.json({
            ok : false,
            message : "Phone number verification failed"
        })
    }
}
