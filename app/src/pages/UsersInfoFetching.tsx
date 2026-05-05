import { getOverlappingDaysInIntervals } from "date-fns";
import { useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function UserrInformation() {
    
const [userdata, setusersdata] = useState([])
    useEffect(()=>{
getuserinformation()
    }, [])

    async function getuserinformation() {
        const result = await fetch("/api/functions/getusers")

        const finalresponse = await result.json()
    if (finalresponse.ok) {
        setusersdata(finalresponse.actualdata)
    }
    else{
        toast.error(finalresponse.message)
    }
    }
   return (
        <div className="p-6 bg-[#0A0A0A] min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white border-l-4 border-red-600 pl-4">
                    User Management
                </h2>
                <span className="text-gray-500 text-sm bg-gray-900 px-3 py-1 rounded-full border border-gray-800">
                    Total Users: {userdata.length}
                </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-800 shadow-2xl">
                <table className="w-full text-left border-collapse bg-[#111]">
                    <thead>
                        <tr className="bg-[#1a1a1a] border-b border-gray-800 text-red-500 uppercase text-xs tracking-wider">
                            <th className="px-6 py-4 font-bold">User ID</th>
                            <th className="px-6 py-4 font-bold">Name</th>
                            <th className="px-6 py-4 font-bold">Email</th>
                            <th className="px-6 py-4 font-bold">Phone</th>
                            <th className="px-6 py-4 font-bold">Created At</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-300 divide-y divide-gray-800">
                        {userdata.length > 0 ? (
                            userdata.map((user: any) => (
                                <tr key={user.userid} className="hover:bg-[#151515] transition-colors group">
                                    <td className="px-6 py-4 font-mono text-xs text-gray-500 group-hover:text-gray-300">
                                        {user.id}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-white">
                                        {user.name}
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.phone || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {/* Formatting the date if needed */}
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        ) : null}
                    </tbody>
                </table>
            </div>
        </div>
    );
}