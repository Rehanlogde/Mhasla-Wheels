import { Car, Users, Fuel, Shield, Star, CarFront } from "lucide-react";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const Fleet = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [liveUpdating, setLiveUpdating] = useState(false);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/functions/get-vehicles");
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || "Failed to fetch vehicles");
      }

      setVehicles(json.vehiclesdata || []);
    } catch (error) {
      console.error("❌ Error fetching vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();

    const handleFocus = () => {
      setLiveUpdating(true);
      fetchVehicles();
      setTimeout(() => setLiveUpdating(false), 1200);
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col">

      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-[#1a1a1a] text-center relative border-b border-red-800/20">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
          Our <span className="text-red-500">Fleet</span>
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Choose from our range of well-maintained vehicles.
        </p>
   <Button 
  onClick={() => window.location.href = "/"}
  className="mt-8 rounded-full bg-transparent border border-red-600/50 text-white hover:bg-red-600 hover:border-red-600 px-8 py-2 text-sm font-bold uppercase tracking-widest transition-all duration-300 shadow-[0_0_15px_rgba(255,0,0,0.1)] hover:shadow-[0_0_20px_rgba(255,0,0,0.3)]"
>
  Go Home
</Button>
        {liveUpdating && (
          <div className="absolute top-6 right-6 text-xs bg-red-600/20 border border-red-600 px-3 py-1 rounded-full text-red-300 animate-pulse">
            Updating...
          </div>
        )}
      </section>

      {/* Vehicles Section */}
      <section className="py-16 bg-[#181818] flex-1">
        <div className="max-w-7xl mx-auto px-6">

          {loading ? (
            <p className="text-center text-gray-400">Loading vehicles...</p>
          ) : vehicles.length === 0 ? (
            <p className="text-center text-gray-400">No vehicles available.</p>
          ) : (
            <div className="flex flex-wrap justify-center gap-8">
              {vehicles.map((vehicle, index) => (
                <div
                  key={vehicle.id || index}
                  className="w-full sm:w-[320px] bg-[#1e1e1e] border border-red-800/30 rounded-xl overflow-hidden
                             hover:shadow-[0_0_20px_rgba(255,0,0,0.25)]
                             hover:-translate-y-2 transition-all duration-500"
                >
                  {/* Image */}
                  <div className="h-48 bg-[#2a2a2a] relative">
                    <img
                      src={vehicle.imagepath}
                      alt={vehicle.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                    <Car size={80} className="text-red-600 absolute inset-0 m-auto hidden" />
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold">{vehicle.vehiclename || "Premium cab"}</h3>
                      <div className="flex items-center">
                        <Star size={16} className="text-yellow-400 fill-current" />
                        <span className="text-sm ml-1">4.5</span>
                      </div>
                    </div>

                    <p className="text-gray-400 text-sm mb-4 ">
                      {vehicle.vehiclesafety || "none"}
                    </p>

                    <div className="flex items-center text-gray-400 text-sm mb-4">
                      <Users size={16} className="mr-2" />
                      {vehicle.capacity
                        ? `${vehicle.capacity} Passengers`
                        : "Varies"}
                    </div>
                        
                    <div className="flex items-center text-gray-400 text-sm mb-4">
                      <CarFront size={16} className="mr-2" />
                      {vehicle.capacity
                        ? `${vehicle.year} Year Purchased`
                        : "Varies"}
                    </div>
                        
                    <div className="flex items-center justify-between border-t border-red-800/20 pt-4">
                      <span className="text-lg font-semibold text-red-400">
                        {vehicle.priceperkm
                          ? `₹${vehicle.priceperkm}/km`
                            : "₹ 500/km"}
                      </span>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Fleet Stats */}
      <section className="py-16 bg-[#141414] border-t border-red-800/10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">
            Fleet <span className="text-red-500">Statistics</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <Car className="mx-auto mb-3 text-red-400" size={28} />
              <div className="text-3xl font-bold">{vehicles.length}+</div>
              <div className="text-gray-400 text-sm">Total Vehicles</div>
            </div>
            <div>
              <Shield className="mx-auto mb-3 text-red-400" size={28} />
              <div className="text-3xl font-bold">100%</div>
              <div className="text-gray-400 text-sm">Safety Certified</div>
            </div>
            <div>
              <Fuel className="mx-auto mb-3 text-red-400" size={28} />
              <div className="text-3xl font-bold">25+</div>
              <div className="text-gray-400 text-sm">Avg Fuel Efficiency</div>
            </div>
            <div>
              <Star className="mx-auto mb-3 text-red-400" size={28} />
              <div className="text-3xl font-bold">4.8</div>
              <div className="text-gray-400 text-sm">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
};

export default Fleet;
