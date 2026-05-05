// src/App.tsx
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// ✅ Public pages
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Fleet from "./pages/Fleet";
import Contact from "./pages/Contact";
import BookingPage from "./pages/Booking";
import ThankYou from "./pages/ThankYou";
import Feedback from "./pages/Feedback";
import NotFound from "./pages/NotFound";
import CompleteProfile from "./pages/CompleteProfile";
import AuthCallback from "./pages/AuthCallback";

// ✅ Admin pages
import AdminLogin from "./pages/AdminLogin";
import AdminBookings from "./pages/AdminBookings";
import AdminFleet from "@/pages/AdminFleet";
import AdminSettings from "@/pages/AdminSettings";
import AdminMetadataConsole from "./pages/AdminMetadataConsole";
import AdminLayout from "./layouts/AdminLayout";
import Adddriverelement from "./pages/Add_driver";
import Map from "./pages/mapview"
import Addvehicles from "./pages/Add_vehicles";
import Showdriver from "./pages/Drivers_showing";

import Scanner from "./components/Scanner";
// ✅ Customer pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

// ✅ Loader
import LoadingScreen from "@/components/LoadingScreen";
import Googlesignin from "./components/Googleregistration";

import Driverlayout from "./layouts/Driverlayout";
import Driverlogin from "./pages/Driverlogin"
import Driverbooking from "./pages/Driverbookings";
import Driverpayments from "./pages/Driverspayments"
import Addsuperuser_element from "./pages/Add_superuser";
import Superuserlogin from "./pages/Superuserlogin";
import Superuserlayout from "./layouts/Superuserlayout";
import Superuser_booking from "./pages/Superuser_booking";
import Superuser_payment from "./pages/Superuser_payments";
import Mailform from "./pages/Mailform";
import LoyaltyProgram from "./pages/Loyalty_program";
import UserrInformation from "./pages/UsersInfoFetching";

const queryClient = new QueryClient();

const App = () => {
  const [startFadeIn, setStartFadeIn] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  const handleLoadingComplete = () => {
    setStartFadeIn(true);
    setTimeout(() => setShowLoader(false), 1000);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        {/* Loader stays on top during fade-out */}
        {showLoader && (
          <LoadingScreen onLoadingComplete={handleLoadingComplete} />
        )}

        {/* Main App Content cross-fades in */}
        <div
          className={`min-h-screen bg-gradient-to-br from-primary to-primary-dark
            transition-opacity duration-1000
            ${startFadeIn ? "opacity-100" : "opacity-0"}`}
        >
          <BrowserRouter>
            <Routes>
              {/* 🌍 Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/fleet" element={<Fleet />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="/feedback" element={<Feedback />} />

            <Route path="/signinwwithgoogle" element = {<Googlesignin/>} />
              {/* 👤 Customer Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/complete-profile" element={<CompleteProfile />} />
              <Route path="/auth/callback" element={<AuthCallback />} />

              {/* 🛠️ Admin routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="bookings" element={<AdminBookings />} />
                <Route path="loyaltyProgram" element= {<LoyaltyProgram />}/>
                
                <Route path="fleet" element={<AdminFleet />} />
                <Route  path="getusers" element ={<UserrInformation />}/>
                <Route path="settings" element= {<AdminSettings />} />
                <Route path="metadata" element={<AdminMetadataConsole />} />
                <Route path= "adddriver" element = {<Adddriverelement  />} />
                <Route path = "showdrivers" element = {<Showdriver />} />
                <Route path = "scanner" element = {<Scanner />}/>
                <Route path = "addsuperuser" element = {<Addsuperuser_element />} />
              <Route path="addvehicle" element = {<Addvehicles />} />
                <Route path="mailsomeone" element = {<Mailform />}/>
              </Route>

<Route path="/driver/login" element={<Driverlogin />} />
<Route path="/driver" element={<Driverlayout />}>
<Route path="scanner" element = {< Scanner/>}/>
  <Route path="bookings" element={<Driverbooking />} />
  <Route path="payments" element={<Driverpayments />}/>

</Route><Route path="/superuser/login" element={<Superuserlogin />} />
<Route path="/superuser" element={<Superuserlayout />}>
<Route path="scanner" element = {< Scanner/>}/>
  <Route path="bookings" element={<Superuser_booking />} />
  <Route path="payments" element={<Superuser_payment />}/>
</Route>



.<Route path="/mapview" element = {<Map /  >} />

              {/* 🚫 Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
