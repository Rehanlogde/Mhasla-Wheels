// netlify/functions/admin-login.js
import {pool} from "../db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
export default async function Superuserlogin(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { username, password } = JSON.parse(event.body || "{}");
    console.log("got request")
    
    const dbquery = `SELECT email, password FROM superuser where email = $1`;
    
    const {rows} = await pool.query(dbquery, [username])
    console.log(rows.length)
    if(rows.length === 0)
    {
        return {
            statusCode : 401,
            body :JSON.stringify({
                ok : false,
                message : "No such user found"
            })
        }
    }
    else{
        console.log(rows)
    if (username === rows[0].email && bcrypt.compare(password, rows[0]['password'])) {
        const jwtkey = process.env.JWT_SECRET
    const token =jwt.sign({username}, jwtkey, {expiresIn : '7d'})

      return {
        statusCode: 200,
        body: JSON.stringify({
            ok: true,
          token: token,
          message: "Login successful",
        }),
      };
    }
    else{
     console.log("condition becomes false")
    return {
      statusCode: 401,
      body: JSON.stringify({ ok: false, message: "Invalid credentials" }),
    };
}
  } }
  catch (err) {
    console.log("error occurred : ", err)
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, message: "failed" }),
    };
  }
}
