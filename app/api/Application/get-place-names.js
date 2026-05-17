import { pool } from "../db.js"

export default async function PlacenamesGet(req,res) {
    var dbquery = "select * from fares"

    const result = await pool.query(dbquery)

    if (result.rowCount >0) {
        console.log("THIS IS PRINTING ROWS")
        console.log(result.rows)
var finaldata = []
console.log("PLACES")
        for (var element of result.rows) {
            var tobecontinue =0;
            console.log("printing element")
            console.log(element)
             
                for (const element2 of finaldata) {
                    if(element2 === element['source'] || element2 === element['destination'] )
                    {
                        tobecontinue = 1
                        console.log('YES continuing')
                        break
                    }
                }
                if (tobecontinue == 1) {
                    continue
                }else{
                finaldata.push(element['source'])
                finaldata.push(element['destination'])
                }
        }
        
            console.log("PRINING FINAL DATA")
            
        console.log(`Final data passing`, finaldata)
        console.log(finaldata)
        return  res.status(200).json({
            ok : true,
            data : finaldata
        });
    }
    else{
        return  res.status(401).json({
            ok :false,
            message: 'Internal server error'
        });
    }
}