import { pool } from "../db.js"

export default async function verificationofuserregardingphonenumber(req,res) {
    const {userid}  = req.body

    console.log("Got the email data : ", userid)
    const dbquery = "SELECT phone from customers where id = $1"

    const result = await pool.query(dbquery,[userid])
    console.log(result)
    if (result.rowCount > 0) {
        console.log("got the phone number")
        console.log(result.rows[0].phone)
        if (result.rows[0].phone == null) {
            console.log("it's null")
            return res.json({
                ok : false,
                message : "Number is null"
            })
        }
        return  res.json({
            ok : true,
            message : "Number found"
        });
    }
    else{
        console.log("did get the phone number")
        return res.json({
            ok : false,
            message :"Number not found !"
        })
    }
}