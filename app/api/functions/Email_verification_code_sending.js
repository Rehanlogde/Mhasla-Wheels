
import { pool } from "../db.js";
import { sendmail } from "./mailfunctions.js";

export default async function Emailverificationcodesending(req, res) {
    try{
  const { emailid } = req.body;
  console.log("email received : ", emailid);

  var dbquery = "select * from emailverificationcodes where emailid = $1";

  const result = await pool.query(dbquery, [emailid]);
  
  if (result.rowCount > 0) {
      dbquery = "DELETE FROM emailverificationcodes where emailid  = $1";
    const result2 = await pool.query(dbquery, [emailid]);
    if (result2 > 0) {
      console.log("deleted successfully");
    } else {
      return res.json({
        ok: false,
        message: "DB ISSUE",
      });
    }
  }
  const digits = "176540238765";
  let OTP = "";
  for (let i = 0; i < digits.length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  console.log("OTP generated is : ", OTP);
  dbquery = "INSERT INTO emailverificationcodes VALUES($1,$2)";

  const result2 = await pool.query(dbquery, [emailid, OTP]);

  if (result2.rowCount <= 1) {

    console.log("code inserted successfully");
     await sendmail("Email Verification Code", emailid, `
      <p>Hi there! 👋</p>
      <p>You requested an email verification code. Please use the code below to verify your email address:</p>
      <div style="margin:24px 0;text-align:center;">
        <span style="display:inline-block;padding:16px 36px;font-size:32px;font-weight:800;letter-spacing:8px;color:#ffffff;background-color:#1a1a1a;border:2px solid #dc2626;border-radius:10px;">${OTP}</span>
      </div>
      <p style="color:#a3a3a3;font-size:13px;">If you didn't request this code, please ignore this email. Do not share this code with anyone.</p>
      <p style="margin-top:20px;color:#d4d4d4;">— Team <strong style="color:#dc2626;">Mhasla Wheels</strong> 🚗</p>
    `)
    return res.json({
      ok: true,
      message: "code inserted in db successfullyy",
    });
  } else {
    return res.json({
      ok: false,
      message: "DB ISSUE",
    });
  }

    }
catch (E){
    console.log("error occurred " ,E)
    return res.json({
        ok : false,
        message : "server issue"
    })
}}
