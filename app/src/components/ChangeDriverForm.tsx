import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ChangeDriverFormProps {
  booking: any;
  onClose: () => void;
  onDriverChanged: () => void;
}

export default function ChangeDriverForm({ booking, onClose, onDriverChanged }: ChangeDriverFormProps) {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/functions/getdriversdetailforbookingmodule")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok){
          
          setDrivers(data.driversnameandid || []);
          console.log("Assignned the drivers datta", drivers)
        }else toast.error(data.message || "Failed to fetch drivers");
      })
      .catch(() => toast.error("Failed to fetch drivers"));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDriver) return toast.error("Please select a driver");
    setLoading(true);
    try {
      const res = await fetch("/api/functions/change-driver-for-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingdata : booking,
          driverselected : selectedDriver
        }),
      });
      const result = await res.json();
      if (result.ok) {
        toast.success("Driver changed successfully!");
        onDriverChanged();
        onClose();
      } else {
        toast.error(result.message || "Failed to change driver");
      }
    } catch {
      toast.error("Error changing driver");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#111] border border-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full text-gray-200">
        <h3 className="text-lg font-bold mb-4 text-blue-400">Change Driver</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Select Driver</label>
            <select
              className="w-full p-2 bg-[#222] border border-gray-700 rounded text-white"
              value={selectedDriver}
              onChange={(e) => setSelectedDriver(e.target.value)}
              required
            >
              <option value="">Select a driver</option>
              {drivers.map((d: any) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={loading}>{loading ? "Changing..." : "Change Driver"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
