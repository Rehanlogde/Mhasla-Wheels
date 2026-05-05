import {pool} from '../db.js';
import bcrypt from "bcrypt";
export default async function handlecreationofsuperuser(event) {
    
    try{
        const requesteddata = JSON.parse(event.body);
        console.log(requesteddata)
        
        requesteddata.password = await bcrypt.hash(requesteddata.password, 10)
        const values = Object.values(requesteddata)
        console.log(values)
        const dbquery = `INSERT INTO superuser(name, location, contact_number, email, password) VALUES($1,$2,$3,$4,$5)`

        await pool.query(dbquery, values)
        return {
         headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
        statuscode : 200,
        message: "Created !!",
      }),
    }   
      

    } 
    catch(error)
    {
        console.log("passing error", error)
    return {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        statuscode : 500,
        message: "Internal Error",
      }),
    }
}
}