import { title } from "process";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Driver {
    id: string;
    name: string;
    location: string;
    contact_number: number | string;
    email: string;
    password: string;
}

export default function Driversdata() {
    const [driversdata, setdriversdata] = useState<Driver[]>([])
    const [loading, setLoading] = useState(false)
        const [refresh, setrefresh] = useState(true)

    const deleteDriver = async (_driverId: string) => {
        const result = await fetch("/api/functions/driverdeletion", {
            headers :{
                'Content-type' : 'application/json'
            },
            body : JSON.stringify({
                driverid : _driverId
            })
            ,method : 'POST'
        })
        const finalresponse = await result.json()
        console.log(finalresponse)
        if (finalresponse.ok) {
            toast.success("Driver deleted successfully")
            setrefresh(!refresh)
        }
        else{
toast.error("Error occured at server side ! Failed to delete driver")
        }
    }

    const handleDeleteClick = async (driverId: string) => {
        const isConfirmed = window.confirm("Confirming the deletion ?")
        if (isConfirmed) {
            await deleteDriver(driverId)
        }
    }

    const driversdatagetting = async () => {
        setLoading(true)
        try {
            const result = await fetch("/api/functions/showdrivers")
            const finalresult = await result.json()

            if (finalresult?.ok) {
                setdriversdata(finalresult?.data || [])
            } else {
                toast.error(finalresult?.message || "Failed to load drivers data")
            }
        } catch (error) {
            console.error("Error loading drivers data:", error)
            toast.error("Failed to load drivers data")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        driversdatagetting()
    }, [refresh])

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                <h2 className="text-2xl font-bold text-red-500">Drivers Dashboard</h2>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="overflow-x-auto bg-[#111] border border-gray-800 rounded-xl shadow-lg">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="bg-[#1A1A1A] text-gray-300">
                                <th className="p-3 border-b border-gray-700">ID</th>
                                <th className="p-3 border-b border-gray-700">Name</th>
                                <th className="p-3 border-b border-gray-700">Location</th>
                                <th className="p-3 border-b border-gray-700">Contact Number</th>
                                <th className="p-3 border-b border-gray-700">Email</th>
                                <th className="p-3 border-b border-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {driversdata.length > 0 ? (
                                driversdata.map((driver) => (
                                    <tr key={driver.id} className="hover:bg-[#1E1E1E] transition">
                                        <td className="p-3 border-b border-gray-800 font-mono text-gray-300">{driver.id}</td>
                                        <td className="p-3 border-b border-gray-800 text-white">{driver.name || "-"}</td>
                                        <td className="p-3 border-b border-gray-800 text-gray-300">{driver.location || "-"}</td>
                                        <td className="p-3 border-b border-gray-800 text-gray-300">{driver.contact_number || "-"}</td>
                                        <td className="p-3 border-b border-gray-800 text-gray-300">{driver.email || "-"}</td>
                                        <td className="p-3 border-b border-gray-800">
                                            <button
                                                type="button"
                                                className="px-3 py-1 rounded text-sm bg-red-600 hover:bg-red-700 text-white"
                                                onClick={() => handleDeleteClick(driver.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="p-4 text-center text-gray-400" colSpan={6}>
                                        No drivers data found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )

}