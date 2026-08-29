import { pool } from "../db.js"

export default async function Useremailtocheck(req,res) {
    try {
        console.log("starte")
        var emailtocheck = req.body.email
        var query = "SELECT email from customers where email = $1"

        var result =await pool.query(query, [emailtocheck])
        
        if (result.rowCount > 0) {
            console.log('declining')
            return res.status(409).json({
                ok : false,
                message : 'Email already registered !'
            })
        }
        else {
            console.log('accepting')
            return res.status(200).json({
                ok : true,
                message :  "Email is not yet registered"
            })
        }
    } catch (e) {
        
    }
}