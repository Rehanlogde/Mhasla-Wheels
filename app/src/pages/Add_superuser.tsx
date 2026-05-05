
import {Button} from "@/components/ui/button"; 

import { useEffect, useState } from "react";
import { Head } from "react-day-picker";
import { toast } from "sonner";
 export default function Addsuperuser_element() {
    
    const [drivername, changedrivername] = useState("")
    const [drivercontactnumber, changecontactnumber] = useState(0)
    const [driverlocation, changelocation] = useState("")
    const [driveremail, changeemail] = useState("")
    const [password, changepassword] = useState("")
    const [creatinguser, changecreateuser] =  useState(false)
const [superusersdata, setsuperuserdata] = useState([])
const [allowadminaccess, setallowadmin] = useState(false)

const [reload, setreload] = useState(0)
useEffect(()=>{
  getsuperuserdata()
determineAdminAccess()
}, [reload])

const deletesuperuser = async(email : string) =>{
  const result = await fetch("/api/functions/deletesuperuser", {
    headers : {
      'Content-type' : 'application/json'
    },
    method  : "post",
    body : JSON.stringify({
      emailid : email
    })
  })
  const finalresult = await result.json()

  if (finalresult.ok ) {
    toast.success(finalresult.message)
    setreload(reload+1)
  }
  else{
    toast.error(finalresult.message)
  }
}
    const getsuperuserdata = async () => {
      const result = await fetch("/api/functions/getsuperuserdataforadmin", {
        headers : {
          'Content-type' : 'application/json'
        },
        method : 'GET',
        
      })
      const finalresult =  await result.json()

      if (finalresult.ok ) {
        setsuperuserdata(finalresult.data)
        
      }
      else{
        toast.error(finalresult.message)
      }
      
    }

    const adddriver = async ()=>{
        console.log("addding....")
        const res = await fetch("/api/functions/create-superuser",{
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

            setreload(reload+1)
            resetinputs()
  
        }
    }

    const determineAdminAccess = async()=>{
        const result = await fetch("/api/functions/getsuperuserdataforadmin", {
        headers : {
          'Content-type' : 'application/json'
        },
        method : 'get',
        
      })
      const finalresult =  await result.json()

      if (finalresult.ok ) {
          var onerow = finalresult.data[0]
          console.log("this is the one row data : ", onerow)
          setallowadmin(onerow['adminaccess'])
        }
      else{
        toast.error(finalresult.message)
      }
    
    }
    const giveAdminAcess = async () => {
      
const result = await fetch("/api/functions/makesuperuseradminaccess", {

  headers : {
    'Content-type' : 'application/json'
  },
  body : JSON.stringify({
    toallow  : allowadminaccess
  }),
  method : "post"
}) 
  const finalresult = await result.json()

  if (finalresult.ok) {
    toast.success(finalresult.message)
    setreload(reload+1)
  }
  else{
    toast.error(finalresult.message)
  }
}


    const resetinputs = ()=>{

changedrivername("")
changelocation("")
changepassword("")
changecontactnumber(0)
changeemail("")
    changecreateuser(false)
    }
 return (
  <div>
  <div className="w-full max-w-4xl mb-6">
    <button onClick={()=>giveAdminAcess()}>{
      (allowadminaccess) ? "Remove permission": "Grant permission"
 }
 </button>
  <h2 className="text-xl font-bold text-white mb-3">Existing Superusers</h2>

  <div className="overflow-x-auto bg-[#111] border border-gray-800 rounded-xl">
    <table className="w-full text-sm text-left">
      <thead className="bg-[#1A1A1A] text-gray-300">
        <tr>
          <th className="p-3 border-b border-gray-700">Name</th>
          <th className="p-3 border-b border-gray-700">Email</th>
          <th className="p-3 border-b border-gray-700">Contact</th>
          <th className="p-3 border-b border-gray-700">Location</th>
          <th className="p-3 border-b border-gray-700">Action</th>
        </tr>
      </thead>

      <tbody>
        {superusersdata.map((user: any, index) => (
          <tr key={index} className="border-b border-gray-800 hover:bg-[#1E1E1E]">
            <td className="p-3 text-white">{user.name}</td>
            <td className="p-3 text-gray-300">{user.email}</td>
            <td className="p-3 text-gray-300">{user.contact_number}</td>
            <td className="p-3 text-gray-300">{user.location}</td>

            <td className="p-3">
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => {
                  const confirmDelete = window.confirm("Are you sure to delete?");
                  if (confirmDelete) {
                    deletesuperuser(user.email);
                  }
                  
                }}
              >
                🗑️
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
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
          Add Superuser 

        </h1>
        <p><b>Note:</b> superusers will be having the access to the booking data (read only)</p>
        {/* Username */}
        <br />
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-300">
Superuser's name
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
            Superuser's location
          </label>
          <input
            type="text"
            value={driverlocation}
            onChange={(value) =>changelocation(value.target.value)}
            required
            className="w-full px-4 py-2 rounded-md bg-[#111] text-white border border-gray-600 focus:ring-2 focus:ring-red-600 outline-none transition"
            placeholder="Enter location"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1 text-gray-300">
            superuser's contact number
          </label>
          <input
            type="number"
            value= {(drivercontactnumber!=0) ?drivercontactnumber : ""}
            onChange={(value) =>changecontactnumber(Number(value.target.value))} 
            required
            className="w-full px-4 py-2 rounded-md bg-[#111] text-white border border-gray-600 focus:ring-2 focus:ring-red-600 outline-none transition"
            placeholder="Enter email"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1 text-gray-300">
            superuser's email id
          </label>
          <input
            type="email"
            value={driveremail}
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
            value={password}
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
            {creatinguser  ? "Creating...." : "Create Supseruser"}
        </Button>
      </form>
    </div>
    </div>
    )
}