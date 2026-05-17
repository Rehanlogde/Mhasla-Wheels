import { pool } from "../db.js"

export default async function Getsuperuserdata(req,res) {
    try{
    var dbquery = "select * from superuser"
    const result = await pool.query(dbquery)

    if (result.rowCount >0) {
        console.log('got the data', result.rows)
        return res.json({
            ok : true,
            data : result.rows[0]
        })
    }
    else{
        console.log("got no data")
        return  res.json({
            ok : false,
            message : "unable to get the super user with the name 'Asim' !"
        });
    }
    }
    catch(E)
    {
        return res.json({
            ok : false,
            message : "Internal server error"
        })
    }
}