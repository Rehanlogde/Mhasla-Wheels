import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function EditFleet({vehicledata}) {
    
    const [vehiclename, setvehiclename] = useState(vehicledata['vehiclename'])
    
    const [vehicleid, setvehicleid] = useState(vehicledata['vehicleid'])
    
    const [vehiclecapacity, setvehiclecapacity] = useState(vehicledata['capacity'])
    
    const [modelyear, setvehiclemodelyear] = useState(vehicledata['year'])

    const [safetydescription, setvehiclesafetydescription] = useState(vehicledata['vehiclesafety'])
    
    const [pricing, setpricing] = useState(vehicledata['priceperkm'])


    async function submitEdits() {
        const result = await fetch("/api/functions/editFleetVehicle", {
            headers : {
                'Content-type' : 'application/json'
            },
            method : 'POST',
            body : JSON.stringify({
                vehiclename,
                vehicleid, 
                capacity : vehiclecapacity, 
                year : modelyear,
                safetydescription,
                priceperkm : pricing
            })
        })
const finalresponse  = await result.json()

if (finalresponse.ok) {
    toast.success("Data added successfully")
  setTimeout(() => {
    window.location.reload()
}, 2000);
}
else{
    toast.error(finalresponse['message'])
}
    }
    return (
        <div className="bg-[#111] border border-gray-800 rounded-2xl p-6 text-white max-w-2xl mx-auto shadow-xl">
            <h2 className="text-2xl font-bold mb-6 border-b border-gray-800 pb-4 text-red-500">
                Edit {vehiclename}
            </h2>

            <div className="space-y-4">
                {/* Vehicle ID - Non Editable */}
                <div className="space-y-1.5">
                    <Label className="text-gray-400 text-xs uppercase tracking-wider">Vehicle ID (Locked)</Label>
                    <Input 
                        value={vehicleid} 
                        readOnly 
                        className="bg-black border-gray-800 text-gray-500 cursor-not-allowed font-mono"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Vehicle Name */}
                    <div className="space-y-1.5">
                        <Label className="text-gray-300">Car Name</Label>
                        <Input 
                            value={vehiclename}
                            onChange={(e) => setvehiclename(e.target.value)}
                            className="bg-[#1a1a1a] border-gray-700 focus:border-red-600"
                        />
                    </div>

                    {/* Capacity */}
                    <div className="space-y-1.5">
                        <Label className="text-gray-300">Capacity (Seats)</Label>
                        <Input 
                            type="number"
                            value={vehiclecapacity}
                            onChange={(e) => setvehiclecapacity(e.target.value)}
                            className="bg-[#1a1a1a] border-gray-700 focus:border-red-600"
                        />
                    </div>

                    {/* Model Year */}
                    <div className="space-y-1.5">
                        <Label className="text-gray-300">Model Year</Label>
                        <Input 
                            type="number"
                            value={modelyear}
                            onChange={(e) => setvehiclemodelyear(e.target.value)}
                            className="bg-[#1a1a1a] border-gray-700 focus:border-red-600"
                        />
                    </div>

                    {/* Pricing */}
                    <div className="space-y-1.5">
                        <Label className="text-gray-300">Price per KM (₹)</Label>
                        <Input 
                            type="number"
                            value={pricing}
                            onChange={(e) => setpricing(e.target.value)}
                            className="bg-[#1a1a1a] border-gray-700 focus:border-red-600"
                        />
                    </div>
                </div>

                {/* Safety Description */}
                <div className="space-y-1.5">
                    <Label className="text-gray-300">Safety Description</Label>
                    <Textarea 
                        value={safetydescription}
                        onChange={(e) => setvehiclesafetydescription(e.target.value)}
                        className="bg-[#1a1a1a] border-gray-700 focus:border-red-600 min-h-[100px]"
                    />
                </div>

                {/* Action Button */}
                <div className="pt-4">
                    <Button 
                        onClick={() =>{ console.log("Updating:", { vehicleid, vehiclename, vehiclecapacity, modelyear, safetydescription, pricing })
                        submitEdits()    
                    }}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-12"
                    >
                        <Save className="mr-2 h-5 w-5" /> Update Fleet Details
                    </Button>
                </div>
            </div>
        </div>
    );
}