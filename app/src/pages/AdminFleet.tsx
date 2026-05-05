import { useScroll } from "framer-motion";
import { Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react"
import editFleet from "./EditFields-fleet";
import EditFleet from "./EditFields-fleet";
import { toast } from "sonner";

export default function AdminFleet() {


  const [vehiclesdata, setvehiclesdata] = useState([])
  const [vehicletoedit, setvehicletoedit] = useState(null)
  
  useEffect(() => {
    getVehicles()
  }, [])

  async function deleteVehicle(vehicleid)
  {

    if(confirm(`Do you actually wanted to delete the vehicle with id ${vehicleid}` ))
    {
    const result =  await fetch("/api/functions/deleteFleetVehicle", {headers : {
      'Content-type' : 'application/json'
    },
    method : "post",
    body : JSON.stringify({
      vehicleid
    })
  })

  const finalresponse = await result.json()
  if (finalresponse.ok) {
    toast.success(finalresponse.message)
    window.location.reload()
  }
  else{
    toast.error(finalresponse.message)
  }
}
else{
  toast.error(`You denied deleting the vehicle with ID ${vehicleid}`)
}
  }
  async function getVehicles() {
    const result = await fetch("/api/functions/get-vehicles");
    const finalresult = await result.json()

    console.log(finalresult)

    setvehiclesdata(finalresult['vehiclesdata'])

    console.log("This is assigned data : ", vehiclesdata)
  }
  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <h2 className="text-3xl font-bold text-white mb-8 border-l-4 border-red-600 pl-4">
        Fleet Inventory
      </h2>

      <div className="grid grid-cols-1 gap-6">
        {vehiclesdata.map((vehicle: any) => (
          /* Main Card Container matching your wireframe structure */
          <div
            key={vehicle.vehicleid}
            className="bg-[#111] border border-gray-800 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-8 hover:bg-[#151515] transition-all"
          >
            {/* 1. Image Section - Using imagename from your data */}
            <div className="w-full md:w-64 h-40 bg-black rounded-xl overflow-hidden flex items-center justify-center border border-gray-800">
              <img
                src={vehicle.imagepath}
                alt={vehicle.vehiclename}
                className="w-full h-full object-contain p-2"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/400x300?text=Vehicle+Image";
                }}
              />
            </div>

            {/* 2. Content Section - Row based approach */}
            <div className="flex-1 w-full">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white capitalize tracking-tight">
                    {vehicle.vehiclename}
                  </h3>
                  <p className="text-gray-500 text-xs font-mono">
                    ID: {vehicle.vehicleid}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${vehicle.vehiclestatus === "available"
                      ? "bg-green-500/10 text-green-500 border border-green-500/20"
                      : "bg-red-500/10 text-red-500 border border-red-500/20"
                    }`}
                >
                  {vehicle.vehiclestatus}
                </span>

                <button
      className="px-4 py-1 rounded-full text-xs font-bold uppercase bg-blue-600/10 text-blue-400 border border-blue-600/30 hover:bg-blue-600 hover:text-white transition-all"
                    onClick={()=>{
                      setvehicletoedit(vehicle)
                    }
                  }
    >
    Edit</button>

    {/* Delete Button - Red Theme */}
    <button
      onClick={() => {
        
        console.log("Delete", vehicle.vehicleid)
        deleteVehicle(vehicle.vehicleid)
      }
      
      }
     
        className="px-4 py-1 rounded-full text-xs font-bold uppercase bg-red-600/10 text-red-500 border border-red-600/30 hover:bg-red-600 hover:text-white transition-all"
    >
      <Trash2 className="h-4 w-4" />
    </button>
                

              </div>

              {/* Data Attributes Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-gray-800">
                <div>
                  <p className="text-gray-500 text-[10px] uppercase font-bold">Capacity</p>
                  <p className="text-lg font-semibold text-gray-200">{vehicle.capacity} Seats</p>
                </div>
                <div>
                  <p className="text-gray-500 text-[10px] uppercase font-bold">Model Year</p>
                  <p className="text-lg font-semibold text-gray-200">{vehicle.year}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-[10px] uppercase font-bold">Safety</p>
                  <p className="text-lg font-semibold text-gray-200">{vehicle.vehiclesafety}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-[10px] uppercase font-bold">Pricing</p>
                  <p className="text-xl font-bold text-red-500">₹{vehicle.priceperkm}<span className="text-xs text-gray-500">/km</span></p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {vehiclesdata.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-gray-800 rounded-2xl">
            <p className="text-gray-500">No vehicles found in the fleet.</p>
          </div>
        )}
      </div>


   {vehicletoedit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl">
            {/* Pass the data and a function to close the form */}
           <EditFleet vehicledata = {vehicletoedit}/>
          </div>
        </div>
      )}
    </div>
  );
}