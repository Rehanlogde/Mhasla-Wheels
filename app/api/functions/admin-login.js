// netlify/functions/admin-login.js
import {pool} from "../db.js"
import * as bcrypt from'bcrypt' ;
export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { username, password } = JSON.parse(event.body || "{}");
    console.log("got request")
    const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "supersecrettoken123";
     console.log("completed initialization")

     const dbquery1 = "select * from public.admins where email = $1"
      
      const result = await pool.query(dbquery1, [username])
      console.log(password)
      console.log(result.rows)
    const isValid = await bcrypt.compare(password, result.rows[0].password)
    if (username == result.rows[0].email) {
      console.log("username is right")
      console.log(isValid)
    }
     if (username === result.rows[0].email && isValid) {
        console.log("updating the tokens")
        
        var dbquery = `DELETE FROM userstokens where username = $1`
        
        await pool.query(dbquery, [username])
        
        console.log("executing the query of insertion now")
        
        dbquery = `INSERT INTO public.userstokens(userrole, username, usertoken) values ($1,$2,$3)`
        
         await pool.query(dbquery, ["admin", username, ADMIN_TOKEN])
          console.log("token added")
      return {
        statusCode: 200,
        body: JSON.stringify({
          ok: true,
          token: ADMIN_TOKEN,
          message: "Login successful",
        }),
      };
    }
     console.log("condition becomes false")
    return {
      statusCode: 401,
      body: JSON.stringify({ ok: false, message: "Invalid credentials" }),
    };
  } catch (err) {
    console.log("error :", err)
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, message: "failed" }),
    };
  }
}
