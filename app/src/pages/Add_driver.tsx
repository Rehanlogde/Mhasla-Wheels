
import {Button} from "@/components/ui/button"; 

import { useState } from "react";
import { Head } from "react-day-picker";
import { toast } from "sonner";
 export default function Adddriverelement() {
    
    const [drivername, changedrivername] = useState("")
    const [drivercontactnumber, changecontactnumber] = useState(0)
    const [driverlocation, changelocation] = useState("")
    const [driveremail, changeemail] = useState("")
    const [password, changepassword] = useState("")
    const [creatinguser, changecreateuser] =  useState(false)

    const adddriver = async ()=>{
        console.log("addding....")
        const res = await fetch("/api/functions/create-driver",{
            headers : {
                "Content-Type" : 'application/json'

            },
            method  : 'POST',
            body : JSON.stringify({
                drivername, driverlocation, drivercontactnumber, driveremail, password
            })
                })
                console.log("request sent ha")

        const finalres = await res.json()
          var msg  = "";
        console.log("got response")

        if (finalres.statuscode != 200) {
          console.log("got erorr")
          msg = "got error : " + finalres.message
            toast.error(msg)
          }
        else{
          console.log("created")
          msg  =  finalres.message
            toast.success(msg)
            window.location.reload()
  
        }
    }
 return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-[#111] to-[#1A1A1A] px-4">
      <form
        className="bg-card text-card-foreground shadow-card border border-border rounded-2xl p-8 w-full max-w-sm"
        onSubmit={(e)=>{
          changecreateuser(true)
          e.preventDefault()
            console.log("calling add driver")
            adddriver()
        }}

      >
        {/* Title */}
        <h1 className="text-3xl font-bold mb-6 text-center text-white">
          Add Driver in your empire
        </h1>


        {/* Username */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-300">
            Driver name
          </label>
          <input
            type="text"
            value= {drivername}
            onChange={(value)=>{changedrivername(value.target.value)}}
            required
            className="w-full px-4 py-2 rounded-md bg-[#111] text-white border border-gray-600 focus:ring-2 focus:ring-red-600 outline-none transition"
            placeholder="Enter username"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1 text-gray-300">
            Driver's location
          </label>
          <input
            type="text"
            onChange={(value) =>changelocation(value.target.value)}
            required
            className="w-full px-4 py-2 rounded-md bg-[#111] text-white border border-gray-600 focus:ring-2 focus:ring-red-600 outline-none transition"
            placeholder="Enter location"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1 text-gray-300">
            Driver's contact number
          </label>
          <input
            type="number"
            onChange={(value) =>changecontactnumber(Number(value.target.value))} 
            required
            className="w-full px-4 py-2 rounded-md bg-[#111] text-white border border-gray-600 focus:ring-2 focus:ring-red-600 outline-none transition"
            placeholder="Enter email"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1 text-gray-300">
            Driver's email id
          </label>
          <input
            type="email"
            onChange={(value) =>changeemail(value.target.value)} 
            required
            className="w-full px-4 py-2 rounded-md bg-[#111] text-white border border-gray-600 focus:ring-2 focus:ring-red-600 outline-none transition"
            placeholder="Enter email"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1 text-gray-300">
            Password
          </label>
          <input
            type="text"
            onChange={(value) =>changepassword(value.target.value)}
            required
            className="w-full px-4 py-2 rounded-md bg-[#111] text-white border border-gray-600 focus:ring-2 focus:ring-red-600 outline-none transition"
            placeholder="Enter password"
          />
        </div>

        <Button
          type="submit"
          disabled = {creatinguser}
          variant="primary"
          className="w-full py-2 text-lg font-semibold rounded-full"
        >
            {creatinguser  ? "Creating...." : "Create Driver"}
        </Button>
      </form>
    </div>
    )
}