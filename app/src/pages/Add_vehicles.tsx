import { useState } from "react";
import { Button } from "@/components/ui/button";
import {toast} from 'sonner'

export default function Addvehicles() {

    const [vechiclename, changevehiclename] = useState("")
    const [vehiclesafety, changevehiclesafety] = useState("")
    const [capacity, changecapacity] = useState(0)
    const [year, changeyear] = useState(2026)
    const [adding, changeadding] =  useState(false)
    const [priceperkm, changeprice] = useState(500) 
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const adddvehicles = async ()=>{
      if (!selectedImage) {
        toast.error("Please upload a valid image")
        changeadding(false)
        return
      }

      if (selectedImage.size > 5 * 1024 * 1024) {
        toast.error("Please select an image under 5 MB")
        changeadding(false)
        return
      }

        const randnumber = Math.random()
        const vehicleid = vechiclename+ "#" + randnumber
      try {
        const formData = new FormData()
        formData.append("imagedata", selectedImage)
        formData.append("imagename", selectedImage.name)
        formData.append("vehicleid", vehicleid)
        formData.append("vechiclename", vechiclename)
        formData.append("vehiclesafety", vehiclesafety) 
        formData.append("capacity", String(capacity))
        formData.append("year", String(year))
        formData.append("priceperkm", String(priceperkm))

        const res = await fetch("/api/functions/add-vehicles",{
          method :'POST',
          body : formData
        })
        
        const finalres = await res.json()

        if(finalres.ok)
        {
          toast.success("Vehicle added !")
          window.location.reload()
        }
        else{
          console.log("error occurred  while adding vehicles!", finalres.message)
          toast.error("Error occurred while entering the vehicle !")
          changeadding(false)
        }
      } catch (error) {
        console.log("error occurred while adding vehicles!", error)
        toast.error("Error occurred while entering the vehicle !")
        changeadding(false)
        }
    }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-[#111] to-[#1A1A1A] px-4">
      <form
        onSubmit={async (e) =>{
            e.preventDefault()
            changeadding(true)
          await adddvehicles()
        }}
        className="bg-card text-card-foreground shadow-card border border-border rounded-2xl p-8 w-full max-w-sm"
      >
        {/* Title */}
        <h1 className="text-3xl font-bold mb-6 text-center text-white">
          Add vehicles 🎉
        </h1>


        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-300">
            Vehicle name
          </label>
          <input
            type="text"
            onChange={(value)=> changevehiclename(value.target.value)}
            required
            className="w-full px-4 py-2 rounded-md bg-[#111] text-white border border-gray-600 focus:ring-2 focus:ring-red-600 outline-none transition"
            placeholder="Enter vehicle name"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1 text-gray-300">
            Vehicle Safety Description
          </label>
          <input
            type="text"
            onChange={(e)  => changevehiclesafety(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md bg-[#111] text-white border border-gray-600 focus:ring-2 focus:ring-red-600 outline-none transition"
            placeholder="Ex : 6 air bag safety, insurance claimed"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1 text-gray-300">
            Vehicle capacity for passenger
          </label>
          <input
            type="number"
            onChange={(e)  => changecapacity(Number(e.target.value))}
            required
            className="w-full px-4 py-2 rounded-md bg-[#111] text-white border border-gray-600 focus:ring-2 focus:ring-red-600 outline-none transition"
            placeholder="ex : 4, 5"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1 text-gray-300">
            Vehicle purschased year
          </label>
          <input
            type="number"
            onChange={(e)  => changeyear(Number(e.target.value))}
            required
            className="w-full px-4 py-2 rounded-md bg-[#111] text-white border border-gray-600 focus:ring-2 focus:ring-red-600 outline-none transition"
            placeholder="Enter year of purchased"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1 text-gray-300">
            Vehicle price per kilometer
          </label>
          <input
            type="number"
            onChange={(e)  => changeprice(Number(e.target.value))}
            required
            className="w-full px-4 py-2 rounded-md bg-[#111] text-white border border-gray-600 focus:ring-2 focus:ring-red-600 outline-none transition"
            placeholder="Enter year of purchased"
          />
          
        </div>
        <div className="mb-6">
          <label htmlFor="text">Image upload</label>
          <input type="file" accept="image/*" name="imagedata" onChange={async(e)=>{
            const selectedImage = e.target.files?.[0]
            if (!selectedImage) {
              setSelectedImage(null)
              return
            }

            if (selectedImage.size > 5 * 1024 * 1024) {
              toast.error("Please select an image under 5 MB")
              setSelectedImage(null)
              return
            }

            setSelectedImage(selectedImage)
          }}/>
        </div>
        {/* Submit */}
        <Button
          type="submit"
          disabled = {adding}
          variant="primary"
          className="w-full py-2 text-lg font-semibold rounded-full"
        >
            {adding ? 'Adding...' : 'Add'}
        </Button>
      </form>
    </div>
  );
}