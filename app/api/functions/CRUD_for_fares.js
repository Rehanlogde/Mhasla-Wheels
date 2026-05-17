import { TrunkPage } from "twilio/lib/rest/trunking/v1/trunk.js";
import { pool } from "../db.js";

export async function CreateFare(req,res) {
    try {
        console.log("HTTING CREATE")
        const {pickup, destination, capacity, onewayrate, seatrate} = req.body

        const dbquery = "INSERT INTO Fares values($1,$2,$3,$4,$5)"

        const dbresult = await pool.query(dbquery, [pickup,destination,capacity, onewayrate,seatrate])

        if(dbresult.rowCount > 0)
        {
            return res.json({
                ok : true,
                message : "Insertion successfull",
            })
        }
        else{
            return res.json({
                ok : false, 
                message : "Failed insertion"
            })
        }
    } catch (e) {
        console.log(e)
        return res.json({
            ok : false,
            message : "Internal server error"
        })
    }
}
export async function GetFares(req,res) {
    try {
        console.log("hitting")
        const dbquery = "SELECT * FROM fares";

        const dbresult = await pool.query(dbquery)

            if (dbresult.rowCount > 0) {
                console.log(dbresult.rows)
                return res.json({
                    ok : true,
                    message : "Got the data",
                    fareslist : dbresult.rows
                })
            }    
            else{
                return res.json({
                    ok : false,
                    message : "No rows found"
                })
            }
    } catch (e) {
        console.log(e)
        return res.json({
            ok : false,
            message : "Internal server error"
        })
    }
}
export async function DeleteFares(req,res) {
    try {
        const {pickup, destination} = req.body

        const dbquery = "DELETE FROM Fares where source = $1 AND destination = $2"

        const dbresult = await pool.query(dbquery, [pickup, destination])
        if (dbresult.rowCount > 0) {
            return res.json({
                ok : TrunkPage,
                message : "Deletion successfull"
            })
        }
        else{
            return res.json({
                ok : false,
                message  : "Deletion failed"
            })
        }
    } catch (e) {
        console.log(e)
        return res.json({
            ok : false,
            message : "Internal server error"
        })
    }
}
export async function UpdateFare(req,res) {
    try {
        console.log("UPDATING")
        const {pickup, destination, capacity, onewayrate, seatrate}= req.body
        console.log(pickup, destination, capacity, onewayrate, seatrate)
        const dbquery = "UPDATE Fares SET one_way_rate = $1 , perseatrate = $2 WHERE source = $3 AND  destination = $4 AND capacity = $5"

        const dbresult = await pool.query(dbquery, [onewayrate,seatrate,pickup,destination,capacity, ])

        if(dbresult.rowCount > 0)
        {
            return res.json({
                ok : true,
                message : "Updation successfull",
            })
        }
        else{
            return res.json({
                ok : false, 
                message : "Updation failed"
            })
        }
    } catch (e) {
        console.log(e)
        return res.json({
            ok : false,
            message : "Internal server error"
        })
    }
}
