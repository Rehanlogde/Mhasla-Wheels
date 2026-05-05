import { pool } from "../db.js"

export default async function Addingphonenumber(req,res) {
 
 try{
    console.log("inside the adding function")   
    const {userid, phonenumber} = req.body

    console.log(userid, phonenumber)

    const dbquery= "UPDATE customers set phone = $1 where id = $2"

    const result = await pool.query(dbquery, [phonenumber, userid])
    
    if (result.rowCount >0 ) {
        console.log("updated.")
       return  res.json({
        ok : true,
        message  : "number added successfully"
       }); 
    }
    else{
        console.log("not updated")
        return res.json({
            ok : false,
            message : "DB ISSUE"
        })
    }
}
    catch (e)
    {
        console.log("Internal server issue ", e)
        return res.json({
            ok : false,
            message : "Internal server issue"
        })
    }
}