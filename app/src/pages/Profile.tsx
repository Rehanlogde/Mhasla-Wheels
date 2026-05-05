  // src/pages/Profile.tsx
  import { useEffect, useState } from "react";
  import { useNavigate, Link } from "react-router-dom";
  import { useAuth } from "@/context/AuthContext";
  import { Button } from "@/components/ui/button";
  import Header from "@/components/Header";
  import Footer from "@/components/Footer";
  import { Coins } from "lucide-react";
  import { toast } from "sonner";

  interface Booking {
    booking_code: string;
    pickup_location: string | null;
    drop_location?: string | null;
    journey_type?: string | null;
    status?: string | null;
    created_at?: string | null;
  }

  const Profile = () => {
    const { customer, loading: authLoading, logout } = useAuth();
    const navigate = useNavigate();

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);
  const [coupondata, setcoupondata] = useState([])
  const [credits, setCredits] = useState(0)
    // Safe display name extraction
    const displayName = customer?.name || customer?.email?.split("@")[0] || "Guest";

    useEffect(() => {
      // Wait for auth to finish loading
      if (authLoading) return;

      // Redirect if not authenticated
      if (!customer) {
        navigate("/login");
        return;
      }

      // Fetch bookings for this customer
      fetchBookings(customer.id);
      fetchLoyaltycoupondata();
      fetchTotalCredits()
    }, [customer, authLoading, navigate]);

    const fetchTotalCredits = async () => {
      const result = await fetch("/api/functions/getusercredits",{
        headers: {
          'Content-type' : 'application/json'
        },
        method : 'post',
        body : JSON.stringify({
          emailid : customer.email
        })
      })

      const finalresult = await result.json()
      
      if (finalresult.ok) {
        setCredits(finalresult.data)
        console.log("Total credits in account is : ", credits)
      }
      else{
        toast.error(finalresult.message)
      }
    }
    const fetchLoyaltycoupondata = async () => {
      console.log("passing : ", customer.email)
      const result = await fetch("/api/functions/get-coupon-code-data",{
        headers: {
          'Content-type' : 'application/json'
        },
        method : 'post',
        body : JSON.stringify({
          emailid : customer.email
        })
      })
      const finalresponse = await result.json()
      if (finalresponse.ok) {
        setcoupondata(finalresponse.data)
        console.log(finalresponse.data)
        console.log("coupon : ", coupondata)
      }
      else{
        alert(finalresponse['message'])
      }
    }
    const fetchBookings = async (customer_id: string) => {
      setLoading(true);
      setFetchError(null);
      try {
        const res = await fetch(
          `/api/functions/get-customer-bookings?customer_id=${encodeURIComponent(
            customer_id
          )}`
        );
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to fetch bookings");
        }
        const json = await res.json();
        setBookings(json.bookings || []);
      } catch (err: any) {
        console.error("Error fetching bookings:", err);
        setFetchError(err.message || "Error fetching bookings");
      } finally {
        setLoading(false);
      }
    };

    const handleLogout = () => {
      logout();
      navigate("/");
    };

    // Show loading while auth is being checked
    if (authLoading) {
      return (
        <>
          <Header />
          <main className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
            <p className="text-gray-400">Loading...</p>
          </main>
          <Footer />
        </>
      );
    }

    // Don't render if not authenticated (redirect will happen)
    if (!customer) return null;

    return (
      <>
        <Header />

       <main className="min-h-screen bg-[#121212] text-white px-4 pt-32 md:pt-40 pb-20">
          <div className="bg-[#1f1f1f] border border-red-800/30 shadow-[0_0_25px_rgba(255,0,0,0.15)] rounded-2xl p-6 sm:p-8 w-full max-w-3xl mx-auto text-center animate-fade-in">
            {/* Profile Info */}
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto flex items-center justify-center rounded-full bg-red-600 text-white text-3xl font-bold shadow-[0_0_20px_rgba(255,0,0,0.4)] mb-4">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <h1 className="text-3xl font-extrabold mb-1">
                Welcome, <span className="text-red-400">{displayName}</span> 👋
              </h1>
              <p className="text-gray-400">
                Logged in as:{" "}
                <span className="text-gray-200 font-medium">{customer.email}</span>
              </p>
            </div>
{/* Sleek Credits Badge */}
<div className="mt-4 flex flex-col items-center gap-2">
  {/* Main Credit Pill */}
  <div className="group flex items-center gap-2 bg-gradient-to-r from-red-600/10 to-red-900/20 border border-red-500/30 px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(255,0,0,0.1)] transition-all duration-300 hover:border-red-500/60 hover:shadow-[0_0_20px_rgba(255,0,0,0.2)]">
    <div className="bg-red-600 p-1 rounded-full shadow-[0_0_10px_rgba(255,0,0,0.5)] group-hover:scale-110 transition-transform">
      <Coins size={14} className="text-white" />
    </div>
    <span className="text-sm font-semibold tracking-wide text-gray-100">
      {credits.toLocaleString()} <span className="text-red-400 text-xs ml-1 uppercase font-bold">Credits</span>
    </span>
  </div>

  {/* Progress Goal Text */}
  {credits < 1000 && (
    <div className="animate-pulse">
      <p className="text-[10px]  uppercase tracking-[0.15em] text-gray-500 font-medium">
        Need <span className="text-red-400 font-bold">{(1000 - credits).toLocaleString()}</span> more for your next reward
      </p>
    </div>
  )}
</div>
  <br />
  
            {/* My Bookings */}
            <h2 className="text-xl font-bold text-white mb-5 border-b border-red-800/30 pb-2">
              My Bookings
            </h2>

            {loading ? (
              <p className="text-gray-400 mb-4">Loading your bookings...</p>
            ) : fetchError ? (
              <p className="text-red-500 mb-4">{fetchError}</p>
            ) : bookings.length === 0 ? (
              <p className="text-gray-400 mb-4">No bookings yet.</p>
            ) : (
              <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 mb-6">
                <table className="min-w-[700px] w-full border-collapse text-sm text-left">
                  <thead>
                    <tr className="bg-[#181818] border-b border-red-800/30 text-gray-300">
                      <th className="p-3 font-medium">Code</th>
                      <th className="p-3 font-medium">Pickup</th>
                      <th className="p-3 font-medium">Drop</th>
                      <th className="p-3 font-medium">Journey</th>
                      <th className="p-3 font-medium">Status</th>
                      <th className="p-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b, index) => (
                      <tr
                        key={b.booking_code || index}
                        className="hover:bg-[#2a2a2a] transition"
                      >
                        <td className="p-3 border-t border-red-800/20 text-gray-200">
                          {b.booking_code}
                        </td>
                        <td className="p-3 border-t border-red-800/20 text-gray-400">
                          {b.pickup_location || "-"}
                        </td>
                        <td className="p-3 border-t border-red-800/20 text-gray-400">
                          {b.drop_location || "-"}
                        </td>
                        <td className="p-3 border-t border-red-800/20 text-gray-400">
                          {b.journey_type || "-"}
                        </td>
                        <td
                          className={`p-3 border-t border-red-800/20 font-semibold capitalize ${b.status === "pending"
                            ? "text-yellow-400"
                            : b.status === "confirmed"
                              ? "text-green-400"
                              : b.status === "rejected"
                                ? "text-red-500"
                                : "text-gray-400"
                            }`}
                        >
                          {b.status || "-"}
                        </td>
                        <td className="p-3 border-t border-red-800/20 text-gray-400">
                          {b.created_at
                            ? new Date(b.created_at).toLocaleDateString()
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Coupon Section */}
        {coupondata && coupondata.length > 0 ? (
    coupondata.map((coupon, index) => (
      <div
        key={index}
        className="flex items-center justify-between bg-[#181818] border border-red-800/30 rounded-lg px-6 py-4 mb-4"
      >
        <span className="text-lg font-semibold text-gray-200">
          {coupon.uniqueid}
        </span>
        <span className="text-lg font-bold text-green-400">
          ₹{coupon.amount}
        </span>
      </div>
    ))
  ) : (
    <div className="text-gray-400">No coupon available.</div>
  )}

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/booking"
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white text-center rounded-full px-6 py-3 font-semibold transition"
              >
                Book a Ride
              </Link>
              <Button
                onClick={handleLogout}
                className="w-full sm:w-auto bg-[#2a2a2a] border border-red-800/30 hover:bg-red-600/20 text-white rounded-full px-6 py-3 transition"
              >
                Logout
              </Button>
            </div>
          </div>
        </main>

        <Footer />
      </>
    );
  };

  export default Profile;
