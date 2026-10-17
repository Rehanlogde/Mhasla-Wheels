import { pool } from "../../db.js";
import UserDashboardData from "../Model/userdashboarddata.model.js";

export default async function getuserdetails(userid) {
    try
{   console.log("excuting here") 
    console.log(userid)
    var creditqueryresult = await pool.query("SELECT mw_credits FROM customers where id = $1",[userid]);
   console.log("after query", creditqueryresult.rowCount)
    const userdashboarddata = new UserDashboardData() 
    console.log(creditqueryresult.rowCount)
    if (creditqueryresult.rowCount> 0) {

        console.log("Got the results")
        userdashboarddata.mwcredits =  creditqueryresult.rows[0]['mw_credits'];   
        
        
    }
    
     var useremailquery = await pool.query("SELECT email FROM customers where id = $1", [userid])
    if (useremailquery.rowCount > 0) {
            
userdashboarddata.useremail = useremailquery.rows[0]['email']
            
        }
    var totaltripscalculations = await pool.query("SELECT COUNT(*) as completedbookings FROM bookings where customer_id = $1 and status = 'Finished'", [userid])       
    console.log(totaltripscalculations.rowCount)
    if (totaltripscalculations.rowCount > 0) {
        console.log("total trips", totaltripscalculations.rows)
        userdashboarddata.completedtrips = totaltripscalculations.rows[0]['completedbookings']
        
    }
    var upcomingtripscalculations = await pool.query("SELECT COUNT(*) as upcomingbookings FROM bookings where customer_id = $1 and status = 'Confirmed'  ", [userid])       
    if (upcomingtripscalculations.rowCount > 0) {
        console.log(upcomingtripscalculations.rows[0]['upcomingbookings'])
            userdashboarddata.upcomingtrips =  upcomingtripscalculations.rows[0]['upcomingbookings']
    }
    var namequery = await pool.query("SELECT name FROM customers where id = $1", [userid])

    if (namequery.rowCount > 0) {
            userdashboarddata.name = namequery.rows[0]['name']
    }
    else{
        console.log("row count is lesser")

        throw new Error("");
        
    }
    
    return userdashboarddata
}
catch(e)
{
    console.log(e)
    throw new Error(e);
}
}
