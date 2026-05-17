import {pool} from  '../db.js'
export default async function Deletedriver(req,res) {
    try{
    console.log("inside the function")
    const driverid = req.body.driverid
        console.log(driverid)
    const query = "DELETE FROM drivers where id = $1"
    const result = await pool.query(query, [driverid])
console.log(result)
    if (result.rowCount >=1) {
        
        console.log(result)
         res.json({
            ok : true,
            message : "Driver deleted successfully"
         });
    }
    else{
        
         res.json({
            ok : false,
            message : 'No such driver found !'
         });
    }
}
catch(e)
{
    return res.json({
        ok : false,
         message : "Internal server error"
    })
}

}