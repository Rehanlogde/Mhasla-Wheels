import { pool } from "../db.js"
import { sendsmsmessage } from "./whatsappops.js";

function generateFourDigitCode() {
  return Math.floor(1000 + Math.random() * 9000);
}
export default async function Codegenerator(req,res) {
    try {
    const {useremail, phonenumber} = req.body

    const code = generateFourDigitCode()
    const dbquery = "INSERT INTO phonenumberverification VALUES($1,$2)"

    const dbresult=   await pool.query(dbquery, [useremail, code])
if (dbresult.rowCount > 0) {

        await sendsmsmessage(`Your phone number verification code : ${code}`)
    return res.json({
        ok : true,
        message : "Phone verification code generated"
    })
}
    } catch (e) {
        console.log("Phone verification code generation failed", e)
        return res.json({
            ok : false,
            message : "Phone verification code generation failed"
        })
    }
    
}
