
import getuserdetails from "./services/userdataget.service.js"

export default async function dashboardDataGet(req,res) {
    try{
        var  userid  = req.headers.authorization
        console.log("Got userid : ", userid)
        const userdata = await getuserdetails(userid) 
        
        return res.json({
            "useremail" : userdata.useremail,
            "username" : userdata.name,
            "mwcredits" : userdata.mwcredits,
            "upcomingtrips" : userdata.upcomingtrips,
            "completedtrips" : userdata.completedtrips
        })
    }
    catch(e)
    {
        return res.json({
            "error" : 'something bad happened'
        })
    }
}
