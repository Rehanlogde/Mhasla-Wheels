import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Fare = {
  source: string;
  destination: string;
  capacity: number | string;
  one_way_rate: number | string;
  perseatrate: number | string;
};

const emptyFare = {
  source: "",
  destination: "",
  capacity: "",
  one_way_rate: "",
  perseatrate: "",
};

export default function FaresAdmin() {
  const [fareForm, setFareForm] = useState(emptyFare);
  const [fareslist, setfareslist] = useState<Fare[]>([])
  const [isloading, setloading] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleChange = (field, value) => {
    setFareForm((current) => ({
      ...current,
      [field]: value,
    }));
  };
useEffect(()=>{
  getdata();
},[])
  const getdata = async()=>{
    setloading(true)
    const response = await fetch("/api/functions/get-fares-admin", {
      method : "GET"
    })
    
    const finalresponse = await response.json()
 
    if (finalresponse.ok) {
      console.log(finalresponse["fareslist"])
      setfareslist(finalresponse['fareslist'])
      setloading(false)
    }
    else{
      toast.error(finalresponse['message'])
      setloading(false)
    }
  }
  const resetForm = () => {
    setFareForm(emptyFare);
    setEditingIndex(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (editingIndex !== null) {
      setfareslist((current) =>
        current.map((fare, index) => (index === editingIndex ? fareForm : fare))
      );
      resetForm();
      return;
    }

    setfareslist((current) => [...current, fareForm]);
    resetForm();
  };
  

  const handleEdit = (fare, index) => {
    setFareForm(fare);
    setEditingIndex(index);
  };

  const handleDelete =async (source:String,  destination : String) => {

    alert("Deleting....")
    const response= await fetch("/api/functions/delete-fare", {
      headers : {
        'Content-type' : 'application/json'
      },
      method : 'DELETE',
      body : JSON.stringify({
        pickup : source,
        destination : destination
        })
    })
    const finalresponse = await response.json()
    if (finalresponse['ok']) {
      alert(finalresponse['message'])
      await getdata()
    }
    else{
      toast.error(finalresponse['message'])
    }
  };

  const insertnewfare = async () => {
      const response = await fetch("/api/functions/insert-new-fare", {
        headers : {
          'Content-type' : 'application/json'
        }
        ,
        method : "POST",
        body : JSON.stringify({
          pickup : fareForm.source,
          destination : fareForm.destination,
          capacity : fareForm.capacity,
          onewayrate : fareForm.one_way_rate,
          seatrate : fareForm.perseatrate
        })
      })
      
      const finalresponse = await response.json()
      console.log(finalresponse)
      if (finalresponse.ok) {
        alert("Insertion successfull")
        await getdata()
      }else{
        toast.error(finalresponse['message'])
      }
  }
  const updatefare = async () => {
      const response = await fetch("/api/functions/update-fare", {
        headers : {
          'Content-type' : 'application/json'
        }
        ,
        method : "PUT",
        body : JSON.stringify({
          pickup : fareForm.source,
          destination : fareForm.destination,
          capacity : fareForm.capacity,
          onewayrate : fareForm.one_way_rate,
          seatrate : fareForm.perseatrate
        })
      })
      
      const finalresponse = await response.json()
      console.log(finalresponse)
      if (finalresponse.ok) {
        alert(finalresponse['message'])
        await getdata()
      }else{
        toast.error(finalresponse['message'])
      }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#111] to-[#1A1A1A] px-4 py-8 text-white">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <div>
          <h1 className="border-l-4 border-red-600 pl-4 text-3xl font-bold text-white">
            Fares Admin
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-800 bg-[#111] p-6 shadow-lg"
        >
          <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <h2  className="text-xl font-bold text-white" onClick={async()=>{
              
            }}>

              {editingIndex !== null ? "Edit Fare" : "Create New Fare"}
            </h2>

            {editingIndex !== null && (
              <button
                type="button"
                onClick={resetForm}
                className="self-start rounded-full border border-gray-700 px-4 py-2 text-sm font-semibold text-gray-300 transition hover:border-gray-500 hover:text-white md:self-auto"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-300">
                Pickup
              </label>
              <input
                type="text"
                value={fareForm.source}
                onChange={(event) => handleChange("source", event.target.value)}
                required
                className="w-full rounded-md border border-gray-600 bg-[#0B0B0B] px-4 py-2 text-white outline-none transition focus:ring-2 focus:ring-red-600"
                placeholder="Pickup"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-300">
                Drop
              </label>
              <input
                type="text"
                value={fareForm.destination}
                onChange={(event) => handleChange("destination", event.target.value)}
                required
                className="w-full rounded-md border border-gray-600 bg-[#0B0B0B] px-4 py-2 text-white outline-none transition focus:ring-2 focus:ring-red-600"
                placeholder="Drop"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-300">
                Capacity
              </label>
              <input
                type="number"
                min="1"
                value={fareForm.capacity}
                onChange={(event) => handleChange("capacity", event.target.value)}
                required
                className="w-full rounded-md border border-gray-600 bg-[#0B0B0B] px-4 py-2 text-white outline-none transition focus:ring-2 focus:ring-red-600"
                placeholder="Seats"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-300">
                One Way Rate
              </label>
              <input
                type="number"
                min="0"
                value={fareForm.one_way_rate}
                onChange={(event) => handleChange("one_way_rate", event.target.value)}
                required
                className="w-full rounded-md border border-gray-600 bg-[#0B0B0B] px-4 py-2 text-white outline-none transition focus:ring-2 focus:ring-red-600"
                placeholder="Rate"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-300">
                Seat Rate
              </label>
              <input
                type="number"
                min="0"
                value={fareForm.perseatrate}
                onChange={(event) => handleChange("perseatrate", event.target.value)}
                required
                className="w-full rounded-md border border-gray-600 bg-[#0B0B0B] px-4 py-2 text-white outline-none transition focus:ring-2 focus:ring-red-600"
                placeholder="Rate"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button type="button"  
            onClick={async()=>{
              if (editingIndex!==null) {
                alert("Updating....")
                await updatefare()
              }
              else{
                  alert("Inserting...")
                  await insertnewfare()
                }if (editingIndex!==null) {
console.log("Pending to integrate update")
              }
            }}
            variant="primary" className="px-6 py-2">
              <Plus className="h-4 w-4" />
              {editingIndex !== null ? "Update Fare" : "Create Fare"}
            </Button>
          </div>
        </form>

        <div className="space-y-3">
          <h2 className="text-xl font-bold text-white">Existing Fares</h2>

          <div className="overflow-x-auto rounded-xl border border-gray-800 bg-[#111] shadow-lg">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-[#1A1A1A] text-gray-300">
                  <th className="border-b border-gray-700 p-3">Pickup</th>
                  <th className="border-b border-gray-700 p-3">Drop</th>
                  <th className="border-b border-gray-700 p-3">Capacity</th>
                  <th className="border-b border-gray-700 p-3">One Way Rate</th>
                  <th className="border-b border-gray-700 p-3">Seat Rate</th>
                  <th className="border-b border-gray-700 p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {isloading ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-400">
                      Loading fares...
                    </td>
                  </tr>
                ) : fareslist.length > 0 ? (
                  fareslist.map((fare, index) => (
                    <tr key={`${fare.source}-${fare.destination}-${fare.capacity}-${index}`} className="transition hover:bg-[#1E1E1E]">
                      <td className="border-b border-gray-800 p-3 text-white">{fare.source}</td>
                      <td className="border-b border-gray-800 p-3 text-gray-300">{fare.destination}</td>
                      <td className="border-b border-gray-800 p-3 text-gray-300">{fare.capacity}</td>
                      <td className="border-b border-gray-800 p-3 font-semibold text-red-500">
                        Rs. {fare.one_way_rate}
                      </td>
                      <td className="border-b border-gray-800 p-3 font-semibold text-red-500">
                        Rs. {fare.perseatrate}
                      </td>
                      <td className="border-b border-gray-800 p-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(fare, index)}
                            className="inline-flex items-center gap-2 rounded-full border border-blue-600/30 bg-blue-600/10 px-3 py-1 text-xs font-bold uppercase text-blue-400 transition hover:bg-blue-600 hover:text-white"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(fare.source, fare.destination)}
                            className="inline-flex items-center gap-2 rounded-full border border-red-600/30 bg-red-600/10 px-3 py-1 text-xs font-bold uppercase text-red-500 transition hover:bg-red-600 hover:text-white"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-400">
                      No fares added yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
