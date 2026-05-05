import { useState } from 'react';
import {toast} from 'sonner';
export default function Driverbookings() {

    const [bookingdata, changepdata] = useState([])
    
    const gettingbookingsdetails = async ()=>{
        const res = await fetch("/api/functions/driver-bookings", {
            headers : {
                'Content-Type' :'application/json'
            
            },
            method : "POST",
            credentials : 'include'
        })


        const finalresponse = await res.json()

        if(finalresponse.ok)
        {
            alert("showing the bookings...")
            console.log("Got the bookings data : ", finalresponse['bookingsdata'])

        }
        else{
            toast.error("Error occurred while fethcing your bookings")
        }
    }
return(
    <div>
        
        <h1>Bookings....</h1>

    </div>
)
}