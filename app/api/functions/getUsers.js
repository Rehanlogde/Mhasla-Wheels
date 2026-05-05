import { pool } from "../db.js"

export default async function getUserData(req,res) {
    const dbquery = "select * from customers"

    const dbresult = await pool.query(dbquery)
console.log("these are the rows : ", dbresult.rows)
    if (dbresult.rowCount > 0) {
        return res.json({
            ok : true,
            actualdata : dbresult.rows
        })
    }
    else{
        return res.json({
            ok : false,
            message : "Db issue"
        })
    }
}