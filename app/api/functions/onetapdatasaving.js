import { stat } from "fs"
import {pool} from "../db.js"
import bcrypt from 'bcrypt'
export default async function Savingonetapsignup(req,res) {
    try{
    const datareceived = req.body.userdata

    console.log(datareceived)
        
    var password = process.env.googleusersdefaultpassword
    console.log("password : ", password)  
    const saltRounds = 10;
     const hashedpass = await bcrypt.hash(password, saltRounds);
    const dbquery = "INSERT INTO customers(name, email, password_hash) VALUES($1,$2,$3)"

    await pool.query(dbquery, [ datareceived['name'], datareceived['email'], hashedpass])

        return  res.json({
            status : true,
            message : "registered...."
        });
    }
    catch(e){
        console.log("error caused : ", e)
        return  res.json({
            status : false,
            message : "could not let u in..."
        });
    }
}