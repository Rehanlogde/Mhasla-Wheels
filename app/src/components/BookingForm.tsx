import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";

import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {toast} from 'sonner';
import { i, p, P } from "node_modules/framer-motion/dist/types.d-BJcRxCew";
import PhoneNumberEntry from "./PhoneNumberEntry";
import PhoneCodeEntry from "./PhoneCodeEntry";

type Vehicle = {
  id: string;
  name: string;
  type?: string;
  capacity?: number;
  per_km_rate?: number;
  base_rate?: number;
  image_url?: string;
  availability?: boolean;
};

export default function BookingForm() {
  const { customer, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [totalCredits , setCredits] = useState(0)
const hasFetchedVehicleName = useRef(false);
const [iscreditused, setiscreditused] = useState(false)


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
      }
      else{
        toast.error(finalresult.message)
      }
    }
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    journey_type: "one_way",
    depart_date: "",
    depart_time: "",
    return_date: "",
    return_time: "",
    distance_km: "",
    coupon_code: "",
    custom_journey_details: "",
    custom_rate: "",
    custom_unit: "",
    members: "",
    address: "",
    driver_id: "",
    name: customer?.name || "",
    phone: customer?.phone || "",
    email: customer?.email || "",
  });
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [status, setStatus] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const [showPhoneNumberEntry, setShowPhoneNumberEntry] = useState(false);
  const [showPhoneCodeEntry, setShowPhoneCodeEntry] = useState(false);
  const [phoneNumberInput, setPhoneNumberInput] = useState("");
  const [phoneCodeInput, setPhoneCodeInput] = useState("");
  const [phoneVerificationError, setPhoneVerificationError] = useState("");
  const [phoneVerificationLoading, setPhoneVerificationLoading] = useState(false);
  const [phoneVerificationCustomerId, setPhoneVerificationCustomerId] = useState("");
  const [pendingBookingPayload, setPendingBookingPayload] = useState<any | null>(null);
  const [estimatedFare, setEstimatedFare] = useState<number | null>(null);
  const [vehiclename, setvehiclename] = useState("")
  const [vehicleid, setvehicleid] = useState("")
  const [driverdetails, setdriverdetails] = useState([])
  const[capacityofvehicle, setcapacityofvehicle] = useState(0)
  const [errormsg, seterrormsg]= useState("")
  const [fare, setrate] = useState(0)
  const [placenames, setplacenames]= useState([])
  const [couponcode, setcouponcode] =useState("")
  const  locationOptions= [ 
"Mhasla",
"Shrivardhan",
"Borli",
"Mumbai",
"Mangaon",
"Pune",
"Indapur",
"Mahad",
"Chiplun",
"Divegar",
"Goregaon (Lonere)",
"Kharsai",
"Warwatna"
  ];
  const farecalculation = async () => {
    var seatssharing = false
    if (formData.journey_type === "shared") {
        seatssharing =true      
    }
    console.log("seat sharing response before sharing is ", seatssharing)
    const response = await fetch("/api/functions/fare-calculation",{
      headers :{
        'Content-type' :'application/json'
      },
      method :   'post',
      body : JSON.stringify({
        source : formData.from,
        destination : formData.to,
        seatsbooking : seatssharing,
        capacity :capacityofvehicle
      })
    })
    const finalresponse = await response.json()
    console.log(finalresponse)
    if (finalresponse.ok) {

      console.log(finalresponse['rate'])
      var rate = finalresponse['rate']
      console.log(rate)
      
      if (formData.journey_type  ==="round_trip") {
        var finalrate = rate*2
        setrate(finalrate)  
        }
      else{
        setrate(rate)
      console.log(fare)
        
      }
    }
    else{
      toast.error(finalresponse['message'])
    }
  }
  useEffect(()=>{
      getplacesname()
  },[vehicleid])
  const getplacesname = async () => {
    console.log("Getting tthe placenames from api calling")
    const result = await fetch("/api/functions/get-place-name")
    const finalresult = await result.json()
      console.log("got the response  as folllows \n", finalresult['data'])
    if (finalresult['ok']) {
      setplacenames ( finalresult['data'])
    }
    else{
      setcouponcode("")
      toast.error(finalresult.message)
    }
  }
  const gettingvehiclename = async ()=>{
    console.log("passing :",vehicleid)
    const res = await fetch("/api/functions/getvehiclesnamebyid",
      {
        headers : {
          'Content-Type' : 'application/json'
        },
        method : 'POST',
        body : JSON.stringify({
          vehicleid
        })
      }
    )
    const finalresponse = await res.json()

    if(finalresponse.ok)
    {
      console.log("got the vehiclename of the car")
      setvehiclename(finalresponse['vehiclename'])
      console.log("Got the capacity : ", finalresponse['capacity'])
      setcapacityofvehicle(finalresponse['capacity'])
    }
    else{
      console.log("error occured", finalresponse['error'])
      toast.error("Error occurred while fetching the vehicle name that u had selected")
    }

  }
const getvehicleid = (name: string) => {
  for (let cookie of document.cookie.split(";")) {
    const [key, value] = cookie.split("=");
    if (key.trim() === name) {
      setvehicleid(value.trim());
      break;
    }
  }
};
const getdriversname = async () => {
  const result = await fetch("/api/functions/getdriversdetailforbookingmodule")
  const finalresponse = await result.json()
  if (finalresponse.ok) {
    setdriverdetails(finalresponse['driversnameandid']) 
  }
  else{
    toast.error(finalresponse.message)
  }
}
useEffect(() => {
  if (formData.from && formData.to) {
    farecalculation();
  }
}, [formData.journey_type, formData.from, formData.to, capacityofvehicle]);
useEffect(()=>{
  getdriversname()
}, [vehicleid])
useEffect(() => {
  if (!vehicleid) return;
  if (hasFetchedVehicleName.current) return;

  hasFetchedVehicleName.current = true;
  gettingvehiclename();
}, [vehicleid]);
  useEffect(() => {
    async function fetchVehicles() {
      setLoadingVehicles(true);
      try {
        const res = await fetch("/api/functions/get-vehicles");
        const json = await res.json();
        if (json.ok) {
          setVehicles(json.vehicles || []);
        }
      } catch (err) {
        console.error("Error fetching vehicles:", err);
      } finally {
        setLoadingVehicles(false);
      }
    }
    fetchVehicles();

    console.log("getting car detail")

    getvehicleid('vehicleselected')
    console.log("running")

  }, []);

  const phonenumbercodegenerator = async (customerid) => {
    const result = await fetch("/api/functions/phonenumbercodegenerator", {
      headers : {
        'Content-type' : 'application/json'

      },
      body : JSON.stringify({
        useremail : customerid, 
        phonenumber : phoneNumberInput
      }),
      method : 'POST'
    })

    const finalresult = await result.json()
    if (finalresult.ok) {
      return 1
    }
    else{
      toast.error(finalresult.message)
      return 0
    }
  }
  
  const phonenumberverificationwithcode = async (customerid, code) => {
    const result = await fetch("/api/functions/phone-number-verification", {
      headers : {
        'Content-Type' : 'application/json'
      } ,
      body : JSON.stringify({
        useremail : customerid,
        code
      }),
      method : "POST"
    })

    const finalresult = await result.json()
    if (finalresult.ok) {
      return 1
    }
    else{
      toast.error(finalresult.message)
      return 0
    }
  }
  const openPhoneVerification = (customerid, payload) => {
    setPhoneVerificationCustomerId(customerid)
    setPendingBookingPayload(payload)
    setPhoneNumberInput("")
    setPhoneCodeInput("")
    setPhoneVerificationError("")
    setShowPhoneNumberEntry(true)
    setShowPhoneCodeEntry(false)
    setStatus(null)
    setLoading(false)
  }
  const handlePhoneNumberOk = async () => {
    if (phoneNumberInput.length === 0) {
      setPhoneVerificationError("Please enter your phone number")
      return
    }
    if (phoneNumberInput.length > 10) {
      setPhoneVerificationError("Phone number should include only 10 max numbers")
      return
    }
    if (phoneNumberInput.length < 10) {
      setPhoneVerificationError("Phone number should include minimum 10 numbers")
      return
    }

    setPhoneVerificationLoading(true)
    setPhoneVerificationError("")
    const generated = await phonenumbercodegenerator(phoneVerificationCustomerId)
    setPhoneVerificationLoading(false)

    if (generated === 1) {
      setShowPhoneNumberEntry(false)
      setShowPhoneCodeEntry(true)
      toast.success("Verification code sent")
    } else {
      setPhoneVerificationError("Could not send verification code. Please try again.")
    }
  }
  const handlePhoneCodeOk = async () => {
    if (phoneCodeInput.length < 4) {
      setPhoneVerificationError("Please enter the 4 digit code")
      return
    }

    setPhoneVerificationLoading(true)
    setPhoneVerificationError("")
    const verified = await phonenumberverificationwithcode(phoneVerificationCustomerId, phoneCodeInput)

    if (verified !== 1) {
      setPhoneVerificationLoading(false)
      setPhoneVerificationError("Phone number verification failed")
      return
    }

    const resultofenteringnumber = await enteringnumber(phoneVerificationCustomerId, phoneNumberInput)
    if (resultofenteringnumber == 0) {
      setPhoneVerificationLoading(false)
      setPhoneVerificationError("Phone number was verified but could not be saved")
      return
    }

    setFormData((prev) => ({ ...prev, phone: phoneNumberInput }))
    setShowPhoneCodeEntry(false)
    setPhoneVerificationLoading(false)
    setLoading(true)

    if (pendingBookingPayload) {
      await submitBooking({
        ...pendingBookingPayload,
        phone: phoneNumberInput,
      })
    }
  }
  const verifythephonenumber= async (customerid)=>{
    console.log("seeing phone number of user.")
    const result = await fetch("/api/functions/checkphonenumberofcustomer", {
      headers : {
        'Content-Type' : 'application/json'
      },
      body :JSON.stringify({
        userid : customerid
      }),
      method :"POST"
    })

    const finalresponse=  await result.json()
    if (finalresponse.ok) {
      console.log("User have phone number")
      return 1
    }else{
      return 0
    }
  } 
  const enteringnumber= async (customerid,phonenumber)=>{
    console.log("sending entering the phone number")
    const result = await fetch("/api/functions/addphonenumber", {
      headers : {
        'Content-Type' : 'application/json'
      },
      body :JSON.stringify({
        userid :customerid,
        phonenumber : phonenumber
      }),
      method :"POST"
    })

    const finalresponse=  await result.json()
    console.log("Got the response")
    if (finalresponse.ok) {
      console.log("number is added")
      return 1
    }else{
      alert(finalresponse['message'])
      return 0
    }
  }
  useEffect(() => {
  if (!vehicleid) return;

  console.log("calling API with vehicleid:", vehicleid);
  gettingvehiclename();

}, [vehicleid]);

  useEffect(() => {
    if (!selectedVehicle) {
      setEstimatedFare(null);
      return;
    }

    const rate =
      selectedVehicle.per_km_rate ||
      selectedVehicle.base_rate ||
      (formData.custom_rate ? parseFloat(formData.custom_rate) : 0);

    const distance = parseFloat(formData.distance_km) || 0;
    let estimate = 0;

    if (formData.journey_type === "customize") {
      estimate = rate;
    } else if (formData.journey_type === "one_way") {
      estimate = distance * rate;
    } else if (formData.journey_type === "round_trip") {
      estimate = distance * rate * 2;
    } else if (formData.journey_type === "shared") {
      estimate = distance * rate * 0.6; // discounted for shared
    }

    setEstimatedFare(Math.max(estimate, selectedVehicle.base_rate || 0));
  }, [selectedVehicle, formData.distance_km, formData.journey_type, formData.custom_rate]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
  const handleChangeforDestination = (
 
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) =>{ 
       setcouponcode("")
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
  }
  const submitBooking = async (payload) => {
    try {
      console.log("Before submiting is credit used value : ", iscreditused)
      const res = await fetch("/api/functions/create-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        setStatus(result?.message || "Submission failed");
        setLoading(false);
        return;
      }

      setStatus(result.message || "Booking submitted successfully!");
      localStorage.setItem("lastBooking", JSON.stringify(result.booking));

      setTimeout(() => {
        if (result.booking?.booking_code) {
          window.location.href = `/thank-you?code=${result.booking.booking_code}`;
        } else {
          window.location.href = "/thank-you";
        }
      }, 1200);
    } catch (err) {
      console.error(err);
      setStatus("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🔐 Phase 6: Soft auth redirect
    if (!customer) {
      navigate("/login?redirect=/booking");
      return;
    }

    setLoading(true);
    setStatus("Submitting...");

    try {
      const payload = {
        ...formData,
        pickup_location: formData.from,
        drop_location: formData.to,
        vehicle_id: vehicleid || null,
        estimated_fare: estimatedFare,
        customer_id: customer.id,
        vehiclename: vehiclename,
        members: formData.members,
        address: formData.address,
        driver_id: formData.driver_id,
        fare : fare,
         couponcode,
         iscreditused,
         totalCredits
      };


      console.log("passing data: ", payload)

      const bookornot = await verifythephonenumber(payload.customer_id)

      if (bookornot ==0) {
        openPhoneVerification(payload.customer_id, payload)
        return
      }
      console.log("Before submiting is credit used value : ", iscreditused
      )
      const res = await fetch("/api/functions/create-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        setStatus(result?.message || "❌ Submission failed");
        setLoading(false);
        return;
      }

      setStatus("✅ " + (result.message || "Booking submitted successfully!"));
      localStorage.setItem("lastBooking", JSON.stringify(result.booking));

      setTimeout(() => {
        if (result.booking?.booking_code) {
          window.location.href = `/thank-you?code=${result.booking.booking_code}`;
        } else {
          window.location.href = "/thank-you";
        }
      }, 1200);
    } catch (err) {
      console.error(err);
      setStatus("❌ Something went wrong!");
    } finally {
      setLoading(false);
    }
  };


useEffect(()=>{
  fetchTotalCredits()
}, [formData.journey_type, formData.from, formData.to])
  function recalculateFare() {  
    console.log("Recalculating fare")
    setiscreditused(false)
    
    if (fare <1000) {
      alert("You cannot redeem your points at the moment ! Your trip fare is less than 1000 (book a ride atleast of 1000 fare to spend you credits).")
    }
    else{
      console.log("Inside else fhuiouasd")
      var updatedfare = fare-totalCredits
      
      if (updatedfare < 0) {
        console.log("it's zero")
        var creditupdate = totalCredits-fare
        setrate(0)
        setCredits(creditupdate)
setiscreditused(true)
        console.log("Is credit used value : ", iscreditused)
      }else{
      setrate(updatedfare)
        
      setCredits(0)
        console.log("dnfjnsdf")
        setiscreditused(true)
        console.log("is credit used value : ", iscreditused)
    }
  }
  }
  return (
    <>
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 bg-[#0A0A0A] text-white shadow-xl rounded-2xl max-w-3xl mx-auto border border-gray-800"
    >
      {/* Pickup & Drop */}
      <div>
        <label htmlFor="text">Car selected : {vehiclename || 'not confirmed'}</label>
       <br /> <label htmlFor="text">Capacity : {capacityofvehicle || 'null'}</label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          name="from"
          value={formData.from}
          onChange={handleChange}
          required
          className="w-full p-3 bg-[#111] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-red-500 outline-none"
        >

          <option value="">Select Pickup Location</option>
          {placenames.sort().map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
            
          ))}
        </select>

        <select
          name="to"
          value={formData.to}
          onChange={ 
            handleChangeforDestination }
          required
          className="w-full p-3 bg-[#111] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-red-500 outline-none"
        >
          <option value="">Select Drop Location</option>
          {placenames.sort().map((loc) => (
            (loc != formData.from)?
            <option key={loc} value={loc}>
              {loc}
            </option> : null
          ))}
        </select>
      </div>

      {/* Journey Type */}
      <div className="flex flex-wrap justify-center gap-3 mt-2">
        {[
          { key: "one_way", label: "One Way" },
          { key: "round_trip", label: "Round Trip" },
          { key: "shared", label: "Shared / Seat" },
          { key: "customize", label: "Customize" },
        ].map((opt) => (
          <button
            key={opt.key}
            type="button"
           onClick={() => {
  setFormData((prev) => ({ ...prev, journey_type: opt.key }));

}}
            className={`px-5 py-2 rounded-full border text-sm font-medium transition-all ${formData.journey_type === opt.key
              ? "bg-red-600 text-white border-red-600 shadow-md scale-105"
              : "bg-[#111] text-gray-300 border-gray-700 hover:bg-[#1a1a1a] hover:text-white"
              }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {fare >= 0 &&(
        <p>Fare : {fare} /-</p>
      )}
      {/* Date & Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
        <div>

          <label className="block text-sm text-gray-400 mb-1">
            Pickup Date & Time
          </label>
          <ReactDatePicker
            selected={
              formData.depart_date
                ? new Date(
                  formData.depart_date +
                  "T" +
                  (formData.depart_time || "00:00")
                )
                : null
            }
            onChange={(date: Date | null) => {
              if (date) {
                setFormData((prev) => ({
                  ...prev,
                  depart_date: date.toISOString().split("T")[0],
                  depart_time: date.toTimeString().slice(0, 5),
                }));
              }
            }}
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mm aa"
            placeholderText="Select date and time"
            className="w-full p-3 bg-[#111] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 outline-none"
            minDate={new Date()}
          />
        </div>

        {formData.journey_type === "round_trip" && (
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Return Date & Time
            </label>
            <ReactDatePicker
              selected={
                formData.return_date
                  ? new Date(
                    formData.return_date +
                    "T" +
                    (formData.return_time || "00:00")
                  )
                  : null
              }
              onChange={(date: Date | null) => {
                if (date) {
                  setFormData((prev) => ({
                    ...prev,
                    return_date: date.toISOString().split("T")[0],
                    return_time: date.toTimeString().slice(0, 5),
                  }));
                }
              }}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
              placeholderText="Select return date and time"
              className="w-full p-3 bg-[#111] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 outline-none"
              minDate={
                formData.depart_date
                  ? new Date(formData.depart_date)
                  : new Date()
              }
            />
          </div>
        )}
      </div>

      {/* Custom Journey */}
      {formData.journey_type === "customize" && (
        <div className="space-y-3 mt-3">
          <textarea
            name="custom_journey_details"
            value={formData.custom_journey_details}
            onChange={handleChange}
            placeholder="Describe your custom journey..."
            className="w-full p-3 bg-[#111] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-red-500 outline-none"
            rows={3}
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="number"
              name="custom_rate"
              value={formData.custom_rate}
              onChange={handleChange}
              placeholder="Custom Rate (₹)"
              className="w-full p-3 bg-[#111] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-red-500 outline-none"
              required
            />
            <select
              name="custom_unit"
              value={formData.custom_unit}
              onChange={handleChange}
              className="w-full p-3 bg-[#111] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-red-500 outline-none"
              required
            >
              <option value="">Select Unit</option>
              <option value="km">Per Km</option>
              <option value="hour">Per Hour</option>
              <option value="day">Per Day</option>
              <option value="trip">Per Trip</option>
            </select>
          </div>
        </div>
      )}

      {/* Members, Address & Driver */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="number"
          name="members"
          value={formData.members}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, members: e.target.value }));
            var inputcapacity = parseInt(e.target.value);
            if (inputcapacity > capacityofvehicle) {
              seterrormsg("Members, exceeds the limit of vehicles");
            } else {
              seterrormsg(null);
            }
          }}
          placeholder="Number of Members"
          min="1"
          className="w-full p-3 bg-[#111] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-red-500 outline-none"
        />
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full p-3 bg-[#111] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-red-500 outline-none"
        />
        <select
          name="driver_id"
          value={formData.driver_id}
          onChange={handleChange}
          className="w-full p-3 bg-[#111] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-red-500 outline-none"
        >
          <option value="">Select Driver</option>
          {driverdetails.map((driver) => (
            <option key={driver.id} value={driver.id}>{driver.name}</option>
          ))}
        </select>
    <button  
    type="button"
    onClick={()=>{
      recalculateFare()
    }}
  className="px-6 py-2 text-sm font-bold uppercase tracking-widest transition-all duration-300
             rounded-lg border
             /* Active State: Bright red with shadow */
             bg-red-700 border-red-600 text-white shadow-[0_0_15px_rgba(185,28,28,0.4)] hover:bg-red-600
             /* Disabled State: Muted, desaturated red-gray */
             disabled:bg-red-950/40 disabled:border-red-900/30 disabled:text-gray-500 
             disabled:shadow-none disabled:cursor-not-allowed"
  disabled={totalCredits < 1000}
><span>Redeem Credits</span> <br />
  
  {totalCredits < 1000 && (
    <span className="text-[9px] leading-none tracking-[0.1em] opacity-80 font-medium lowercase italic">
      — need {1000 - totalCredits} more to unlock —
    </span>
  )}
</button> </div>
      <div>
        {errormsg && (
          <p className="text-center text-sm mt-2 text-red-500">{errormsg}</p>
        )}
      </div>
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
        <Button
          type="submit"
          variant="primary"
          className="w-full sm:w-auto rounded-full"
          disabled={loading || authLoading || !customer || (errormsg!=null)}
        >
          {loading ? "Submitting..." : authLoading ? "Loading..." : !customer ? "Login to Book" : 'Book a ride' }
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => (window.location.href = "/")}
          className="w-full sm:w-auto rounded-full"
        >
          Cancel
        </Button>
      </div>

      {status && (
        <p className="text-center text-sm mt-2 text-gray-300">{status}</p>
      )}
    </form>
    <PhoneNumberEntry
      open={showPhoneNumberEntry}
      phoneNumber={phoneNumberInput}
      error={phoneVerificationError}
      loading={phoneVerificationLoading}
      onPhoneNumberChange={(value) => {
        setPhoneNumberInput(value)
        setPhoneVerificationError("")
      }}
      onSubmit={handlePhoneNumberOk}
      onCancel={() => {
        setShowPhoneNumberEntry(false)
        setPendingBookingPayload(null)
        setLoading(false)
      }}
    />
    <PhoneCodeEntry
      open={showPhoneCodeEntry}
      code={phoneCodeInput}
      error={phoneVerificationError}
      loading={phoneVerificationLoading}
      onCodeChange={(value) => {
        setPhoneCodeInput(value)
        setPhoneVerificationError("")
      }}
      onSubmit={handlePhoneCodeOk}
      onBack={() => {
        setShowPhoneCodeEntry(false)
        setShowPhoneNumberEntry(true)
        setPhoneVerificationError("")
      }}
    />
    </>
  );
}
