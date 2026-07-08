import { useEffect, useState } from "react";
import {
  Car,
  Bike,
  MapPin,
  Camera,
  ArrowRight,
  Star,
  Shield,
  Clock,
  Users,
  CarFront,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import { toast } from "sonner";

interface Vehicle {
  id: string;
  imagepath?: string;
  vehiclename?: string;
  vehiclesafety?: string;
  capacity?: number;
  year?: number;
  priceperkm?: number;
}

const Index = () => {
  const [showLoading, setShowLoading] = useState(true);
  const [fleet, setFleet] = useState<Vehicle[]>([]);
  const [loadingFleet, setLoadingFleet] = useState(true);
  const [contactnumber, setcontactnumber] = useState(0);

  useEffect(() => {
    getcontactnumber();
    fetchFleet();
  }, []);

  const fetchFleet = async () => {
    try {
      setLoadingFleet(true);
      const res = await fetch("/api/functions/get-vehicles");
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || "Failed to fetch vehicles");
      }

      setFleet((json.vehiclesdata || []).slice(0, 6));
    } catch (error) {
      console.error("Error fetching fleet preview:", error);
      toast.error("Failed to load fleet preview");
    } finally {
      setLoadingFleet(false);
    }
  };

  const getcontactnumber = async () => {
    const response = await fetch("/api/functions/getmetadata/phone_number", {
      headers: {
        "content-type": "application/json",
      },
      method: "GET",
    });

    if (response.status === 200) {
      const finalresponse = await response.json();
      setcontactnumber(finalresponse.data);
    } else {
      toast.error("Failed to load contact number");
    }
  };

  const services = [
    {
      icon: Car,
      title: "Car Rentals",
      description:
        "Comfortable and reliable car rentals for daily commute or business trips.",
    },
    {
      icon: Bike,
      title: "Bike Rentals",
      description:
        "Economical rides for solo travelers navigating city traffic.",
    },
    {
      icon: MapPin,
      title: "Local Rides",
      description: "Point-to-point rides within Mhasla city.",
    },
    {
      icon: Camera,
      title: "Tourist Packages",
      description:
        "Curated sightseeing tours across Mhasla and nearby destinations.",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Safety First",
      description: "Verified drivers & inspected vehicles",
    },
    {
      icon: Clock,
      title: "24/7 Service",
      description: "Always ready when you are",
    },
    {
      icon: Users,
      title: "Professional Drivers",
      description: "Experienced and courteous staff",
    },
    {
      icon: Star,
      title: "Top Rated",
      description: "4.8+ customer satisfaction",
    },
  ];

  if (showLoading) {
    return <LoadingScreen onLoadingComplete={() => setShowLoading(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <Header />

      <section className="relative min-h-[80vh] md:min-h-screen flex flex-col justify-center items-center text-center bg-[#181818] pt-20 pb-10 md:pt-32 md:pb-16 px-4 border-b border-red-800/20">
        <img
          src="/splash-logo.png"
          alt="Mhasla Wheels Logo"
          className="w-28 h-28 md:w-40 md:h-40 mb-6 md:mb-10 rounded-full shadow-[0_0_40px_rgba(255,0,0,0.4)]"
        />

        <h1 className="text-3xl md:text-5xl font-extrabold mb-3 md:mb-4 leading-tight">
          Your Ride, Your Way in <span className="text-red-500">Mhasla</span>
        </h1>
        <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto mb-6 md:mb-8 px-2">
          Reliable, comfortable, and affordable transportation tailored for you.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
          <Button
            asChild
            className="rounded-full bg-red-600 hover:bg-red-700 px-6 py-3 md:px-8 text-base md:text-lg w-full sm:w-auto"
          >
            <Link to="/booking">Book Your Ride</Link>
          </Button>
          <Button
            asChild
            variant="secondary"
            className="rounded-full px-6 py-3 md:px-8 text-base md:text-lg w-full sm:w-auto"
          >
            <Link to="/fleet" className="flex items-center justify-center">
              Explore Our Fleet <ArrowRight size={18} className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="section-padding bg-[#181818]">
        <div className="max-w-6xl mx-auto container-padding text-center">
          <h2 className="text-3xl font-bold mb-10">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-[#1f1f1f] border border-red-800/30 rounded-xl p-8"
              >
                <div className="w-14 h-14 mx-auto mb-4 bg-red-600 rounded-full flex items-center justify-center">
                  <service.icon size={26} />
                </div>
                <h3 className="text-lg font-semibold">{service.title}</h3>
                <p className="text-gray-400 text-sm mt-2">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-[#141414]">
        <div className="max-w-6xl mx-auto container-padding text-center">
          <h2 className="text-3xl font-bold mb-8">Fleet Preview</h2>

          {loadingFleet ? (
            <p className="text-gray-400">Loading fleet...</p>
          ) : fleet.length === 0 ? (
            <p className="text-gray-400">No vehicles available.</p>
          ) : (
            <div className="flex flex-wrap justify-center gap-8">
              {fleet.map((vehicle, index) => (
                <div
                  key={vehicle.id || index}
                  className="w-full sm:w-[320px] bg-[#1e1e1e] border border-red-800/30 rounded-xl overflow-hidden hover:shadow-[0_0_20px_rgba(255,0,0,0.25)] hover:-translate-y-2 transition-all duration-500"
                >
                  <div className="h-48 bg-[#2a2a2a] relative">
                    <img
                      src={vehicle.imagepath}
                      alt={vehicle.vehiclename}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                    <Car size={80} className="text-red-600 absolute inset-0 m-auto hidden" />
                  </div>

                  <div className="p-6 text-left">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold">
                        {vehicle.vehiclename || "Premium cab"}
                      </h3>
                      <div className="flex items-center">
                        <Star size={16} className="text-yellow-400 fill-current" />
                        <span className="text-sm ml-1">4.5</span>
                      </div>
                    </div>

                    <p className="text-gray-400 text-sm mb-4">
                      {vehicle.vehiclesafety || "none"}
                    </p>

                    <div className="flex items-center text-gray-400 text-sm mb-4">
                      <Users size={16} className="mr-2" />
                      {vehicle.capacity ? `${vehicle.capacity} Passengers` : "Varies"}
                    </div>

                    <div className="flex items-center text-gray-400 text-sm mb-4">
                      <CarFront size={16} className="mr-2" />
                      {vehicle.year ? `${vehicle.year} Year Purchased` : "Varies"}
                    </div>

                    <div className="flex justify-between items-center border-t border-red-800/20 pt-4">
                      <span className="text-red-400 font-semibold">
                        {vehicle.priceperkm ? `Rs${vehicle.priceperkm}/km` : "Rs 500/km"}
                      </span>
                      <Button asChild size="sm" className="rounded-full">
                        <Link to="/booking">Book</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section-padding bg-[#181818]">
        <div className="max-w-6xl mx-auto container-padding text-center">
          <h2 className="text-3xl font-bold mb-10">
            Why Choose <span className="text-red-500">Mhasla Wheels?</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-[#1e1e1e] border border-red-800/30 rounded-xl p-8"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-red-600 rounded-full flex items-center justify-center">
                  <feature.icon size={28} />
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-gray-400 text-sm mt-2">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <a
        href={`https://wa.me/+91${contactnumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg"
      >
        <MessageCircle size={28} />
      </a>
    </div>
  );
};

export default Index;
