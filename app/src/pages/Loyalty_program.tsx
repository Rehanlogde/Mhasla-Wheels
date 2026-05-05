import { useScroll } from "framer-motion"
import { useState } from "react"

export default function LoyaltyProgram() {
   
    var usernames = [];
var nonduplicateusernames = [];
var uniqueusernames = [];
       async function getLoyaltyProgramData() {
        const result = await fetch()
        
        const finalresponse = await result.json()

        if (finalresponse.ok) {
            assignusernames(finalresponse.actualdata)
        }
    
    }

    function assignusernames(list) {
        for (const element in list) {
                usernames.push(element['username'])
        }

uniqueusernames = [...new Set(usernames)]; 
    }
    
    return (
        <div>
            this is tthe loyalty proograam sectiin
        </div>
    )
}