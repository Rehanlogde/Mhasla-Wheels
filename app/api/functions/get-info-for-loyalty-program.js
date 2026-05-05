import { pool } from "../db.js"

export default async function InfogettingforloyaltyProgram(req,res) {
    const {emailid}= req.body

    var dbquery = "SELECT * from loyalty_program where useremail = $1"

    var queryresult = await pool.query(dbquery, [emailid])
    if (queryresult.rowCount > 0) {
        console.log("Got the data for the email id user : ", emailid)
console.log(queryresult.rows[0])
        res.json({
            ok : true,
            data : queryresult.rows
        })
    }
    else{
         res.json({
            ok  :false,
            message : "Yet no coupon !"
         });
    }
}