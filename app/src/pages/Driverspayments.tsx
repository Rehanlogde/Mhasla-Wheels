import { useState } from 'react';
import {toast} from 'sonner';
export default function Driverpayments() 
{
    
    const [paymentsdata, changepdata] = useState([])
    
    const checkpayments = async ()=>{
        const res = await fetch("/api/functions/driver-payments", {
            headers :{
                'Content-Type' : 'application/json'
            },
            credentials : "include",
            method :"POST"
        }
    )

    const finalresponse = await res.json()

        if(finalresponse.ok)
        {
            console.log("showing payments : ", finalresponse['paymentsdata'])

        }
        else{
            toast.error("Error occurred while fetching your payments")
            console.log("error : ", finalresponse['message'])
        }
    }

    return (
        <div>
            <h1>showing payments...</h1>
        </div>
    )
}