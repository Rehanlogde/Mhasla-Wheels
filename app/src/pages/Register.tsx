// // src/pages/Register.tsx
// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import { createClient } from "@supabase/supabase-js";
// import { FaGoogle, FaFacebook, FaInstagram } from "react-icons/fa";

// // Supabase client for OAuth
// const supabase = createClient(
//   import.meta.env.VITE_SUPABASE_URL!,
//   import.meta.env.VITE_SUPABASE_ANON_KEY!
// );

// const Register = () => {
//   const { register } = useAuth();
//   const navigate = useNavigate();

//   const [name, setName] = useState<string>("");
//   const [phone, setPhone] = useState<string>("");
//   const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const [confirmPassword, setConfirmPassword] = useState<string>("");
//   const [loading, setLoading] = useState(false);

//   const handleRegister = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (password !== confirmPassword) {
//       toast.error("Passwords do not match");
//       return;
//     }
//     if (!name.trim()) {
//       toast.error("Please enter your full name");
//       return;
//     }
//     if (!phone.trim() || !/^[0-9]{8,15}$/.test(phone)) {
//       toast.error("Please enter a valid contact number");
//       return;
//     }

//     setLoading(true);
//     try {
//       // Modified register call — assuming register(email, password, name, metadata)
//       const result = await register(email, password, name, { phone });

//       if (result.error) {
//         toast.error("Registration failed", { description: result.error });
//         return;
//       }

//       toast.success("Please confirm your email", {
//         description: "Check your inbox for the confirmation link.",
//       });

//       setTimeout(() => navigate("/login"), 2000);
//     } catch (err: any) {
//       toast.error("Registration failed", {
//         description: err.message || "Something went wrong",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSocialRegister = async (provider: "google" | "facebook") => {
//     try {
//       const { error } = await supabase.auth.signInWithOAuth({
//         provider,
//         options: { redirectTo: `${window.location.origin}/auth/callback` },
//       });
//       if (error) throw error;
//     } catch (err: any) {
//       toast.error("❌ Social signup failed", { description: err.message });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#121212] text-white flex flex-col">
//       <Header />

//       {/* Hero Section */}
//       <section className="pt-24 md:pt-32 pb-16 bg-[#181818] text-center border-b border-red-800/20">
//         <div className="max-w-4xl mx-auto px-6">
//           <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
//             Create an <span className="text-red-500">Account</span>
//           </h1>
//           <p className="text-gray-300 text-lg max-w-2xl mx-auto">
//             Join Mhasla Wheels and start your journey today.
//           </p>
//         </div>
//       </section>

//       {/* Register Form */}
//       <section className="flex-grow py-16 bg-[#141414] border-b border-red-800/10">
//         <div className="max-w-md mx-auto px-6">
//           <div className="bg-[#1f1f1f] border border-red-800/30 rounded-2xl p-8 shadow-[0_0_25px_rgba(255,0,0,0.15)]">
//             <form onSubmit={handleRegister} className="space-y-5">
//               <div>
//                 <label className="block text-sm font-medium mb-1 text-gray-400">
//                   Full Name
//                 </label>
//                 <input
//                   type="text"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   required
//                   placeholder="Enter your full name"
//                   autoComplete="off"
//                   className="w-full px-4 py-2 rounded-md bg-[#121212] text-white border border-red-800/30 focus:ring-2 focus:ring-red-600 outline-none transition"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1 text-gray-400">
//                   Contact Number
//                 </label>
//                 <input
//                   type="tel"
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value)}
//                   required
//                   placeholder="Enter your phone number"
//                   autoComplete="off"
//                   className="w-full px-4 py-2 rounded-md bg-[#121212] text-white border border-red-800/30 focus:ring-2 focus:ring-red-600 outline-none transition"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1 text-gray-400">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   placeholder="Enter your email address"
//                   autoComplete="off"
//                   className="w-full px-4 py-2 rounded-md bg-[#121212] text-white border border-red-800/30 focus:ring-2 focus:ring-red-600 outline-none transition"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1 text-gray-400">
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   placeholder="Create a password"
//                   autoComplete="new-password"
//                   className="w-full px-4 py-2 rounded-md bg-[#121212] text-white border border-red-800/30 focus:ring-2 focus:ring-red-600 outline-none transition"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1 text-gray-400">
//                   Confirm Password
//                 </label>
//                 <input
//                   type="password"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   required
//                   placeholder="Re-enter your password"
//                   autoComplete="new-password"
//                   className="w-full px-4 py-2 rounded-md bg-[#121212] text-white border border-red-800/30 focus:ring-2 focus:ring-red-600 outline-none transition"
//                 />
//               </div>

//               <Button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full py-3 rounded-full bg-red-600 hover:bg-red-700 text-white text-lg font-semibold transition"
//               >
//                 {loading ? "Registering..." : "Register"}
//               </Button>
//             </form>

//             {/* Divider */}
//             <div className="my-6 flex items-center">
//               <div className="flex-grow h-px bg-red-800/20"></div>
//               <span className="mx-3 text-gray-500 text-sm">or</span>
//               <div className="flex-grow h-px bg-red-800/20"></div>
//             </div>

//             {/* Social Register */}
//             <div className="space-y-3">
//               <Button
//                 type="button"
//                 onClick={() => handleSocialRegister("google")}
//                 className="w-full flex items-center justify-center gap-2 py-2 bg-[#222] border border-red-800/30 rounded-full hover:bg-red-600/20 transition"
//               >
//                 <FaGoogle className="text-red-500" /> Continue with Google
//               </Button>
//               <Button
//                 type="button"
//                 onClick={() => handleSocialRegister("facebook")}
//                 className="w-full flex items-center justify-center gap-2 py-2 bg-[#222] border border-red-800/30 rounded-full hover:bg-red-600/20 transition"
//               >
//                 <FaFacebook className="text-blue-600" /> Continue with Facebook
//               </Button>
//               <Button
//                 type="button"
//                 onClick={() =>
//                   toast.info(
//                     "⚠️ Instagram OAuth requires setup in Supabase Dashboard."
//                   )
//                 }
//                 className="w-full flex items-center justify-center gap-2 py-2 bg-[#222] border border-red-800/30 rounded-full hover:bg-red-600/20 transition"
//               >
//                 <FaInstagram className="text-pink-500" /> Continue with
//                 Instagram
//               </Button>
//             </div>

//             {/* Login Redirect */}
//             <p className="text-sm text-center mt-6 text-gray-400">
//               Already have an account?{" "}
//               <Link
//                 to="/login"
//                 className="text-red-500 hover:text-red-400 font-semibold"
//               >
//                 Login
//               </Link>
//             </p>
//           </div>
//         </div>
//       </section>

//       <Footer />
//     </div>
//   );
// };

// export default Register;

// src/pages/Register.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FaGoogle, FaFacebook, FaInstagram } from "react-icons/fa";
import { useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import LoadingScreen from "@/components/LoadingScreen";
const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showCodeForm, setShowCodeForm] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      });

      const userobj = await res.json();
      console.log("User object received:", userobj["email"]);

      const savingdataresponse = await fetch(
        "/api/functions/savingtheonetapsignupdata",
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            userdata: userobj,
          }),
        },
      );
      const finalresponse = await savingdataresponse.json();

      if (finalresponse["status"]) {
        console.log(
          "hey...registered through google is done in a fantastic manner !!!",
        );
        toast.success("registration done !!!");
        navigate("/login");
      } else {
        toast.error("Registration failed.....");
        console.log();
      }
    },
    onError: () => console.log("error occurred !!!"),
  });
  const sendVerificationCode = async (emailid: string) => {
    const result = await fetch("/api/functions/emailcodesending", {
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        emailid,
      }),
      method: "POST",
    });
    const finalresponse = await result.json();
    return finalresponse.ok;
  };

  const handleVerifyCode = async () => {

    setVerifying(true);
    setLoading(true)
    setCodeError("");
    try {
      const result2 = await fetch("/api/functions/emailverification", {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: verificationCode,
          email,
        }),
        method: "POST",
      });
      const finalresult = await result2.json();
      if (finalresult.ok) {
        console.log("verified, proceeding to register");
        setShowCodeForm(false);
        setVerificationCode("");
        // Now do the actual registration
        const result = await register(name, email, password, phone);
        console.log(result);
        if (result.error) {
          toast.error("Registration failed", { description: result.error });
          return;
        }
        toast.success("Registration successful!", {
          description: "You can now log in with your credentials.",
        });
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setCodeError("Invalid code");
      }
    } catch (err: any) {
      setCodeError("Something went wrong, try again");
    } finally {
      setVerifying(false);
    }
  };

  const handleCancelVerification = () => {
    setShowCodeForm(false);
    setVerificationCode("");
    setCodeError("");
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!name.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!phone.trim() || !/^[0-9]{8,15}$/.test(phone)) {
      toast.error("Please enter a valid contact number");
      return;
    }

    setLoading(true);
    try {
      const sent = await sendVerificationCode(email);
      if (sent) {
        setLoading(false);
        setShowCodeForm(true);
      } else {
        toast.error("Server issue, could not send verification code");
        setLoading(false)
      }
    } catch (err: any) {
      toast.error("Registration failed", {
        description: err.message || "Something went wrong",
      });
      setLoading(false);
    }
  };

  // ✅ Supabase-safe fallback (prevents crash)
  const handleSocialRegister = () => {
    toast.info("⚠️ Social signup is temporarily unavailable.");
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-16 bg-[#181818] text-center border-b border-red-800/20">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Create an <span className="text-red-500">Account</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Join Mhasla Wheels and start your journey today.
          </p>
        </div>
      </section>

      {/* Register Form */}
      <section className="flex-grow py-16 bg-[#141414] border-b border-red-800/10">
        <div className="max-w-md mx-auto px-6">
          <div className="bg-[#1f1f1f] border border-red-800/30 rounded-2xl p-8 shadow-[0_0_25px_rgba(255,0,0,0.15)]">
            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-400">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter your full name"
                  autoComplete="off"
                  className="w-full px-4 py-2 rounded-md bg-[#121212] text-white border border-red-800/30 focus:ring-2 focus:ring-red-600 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-400">
                  Contact Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="Enter your phone number"
                  autoComplete="off"
                  className="w-full px-4 py-2 rounded-md bg-[#121212] text-white border border-red-800/30 focus:ring-2 focus:ring-red-600 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-400">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email address"
                  autoComplete="off"
                  className="w-full px-4 py-2 rounded-md bg-[#121212] text-white border border-red-800/30 focus:ring-2 focus:ring-red-600 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-400">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Create a password"
                  autoComplete="new-password"
                  className="w-full px-4 py-2 rounded-md bg-[#121212] text-white border border-red-800/30 focus:ring-2 focus:ring-red-600 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-400">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  className="w-full px-4 py-2 rounded-md bg-[#121212] text-white border border-red-800/30 focus:ring-2 focus:ring-red-600 outline-none transition"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-red-600 hover:bg-red-700 text-white text-lg font-semibold transition"
              >
                {loading ? "Registering..." : "Register"}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-grow h-px bg-red-800/20"></div>
              <span className="mx-3 text-gray-500 text-sm">or</span>
              <div className="flex-grow h-px bg-red-800/20"></div>
            </div>

            {/* Social Register */}
            <div className="space-y-3">
              <Button
                type="button"
                onClick={() => login()}
                className="w-full flex items-center justify-center gap-2 py-2 bg-[#222] border border-red-800/30 rounded-full hover:bg-red-600/20 transition"
              >
                <FaGoogle className="text-red-500" /> Continue with Google
              </Button>
             
            </div>

            {/* Login Redirect */}
            <p className="text-sm text-center mt-6 text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-red-500 hover:text-red-400 font-semibold"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
      {loading && <LoadingScreen onLoadingComplete={() => setLoading(false)} />}

      {/* Verification Code Modal */}
      {showCodeForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] border border-red-800/40 rounded-2xl p-8 w-full max-w-sm mx-4 shadow-[0_0_30px_rgba(255,0,0,0.2)]">
            <h2 className="text-xl font-bold text-white text-center mb-2">
              Email Verification
            </h2>
            <p className="text-gray-400 text-sm text-center mb-6">
              Enter the verification code sent to <span className="text-red-400">{email}</span>
            </p>

            <input
              type="text"
              value={verificationCode}
              onChange={(e) => {
                setVerificationCode(e.target.value);
                setCodeError("");
              }}
              placeholder="Enter code"
              autoFocus
              className="w-full px-4 py-3 rounded-md bg-[#121212] text-white text-center text-lg tracking-widest border border-red-800/30 focus:ring-2 focus:ring-red-600 outline-none transition"
            />

            {codeError && (
              <p className="text-red-500 text-sm text-center mt-2">{codeError}</p>
            )}

            <Button
              type="button"
              disabled={verifying}
              onClick={handleVerifyCode}
              className="w-full mt-5 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white text-lg font-semibold transition"
            >
              {verifying ? "Verifying..." : "Verify & Register"}
            </Button>

            <button
              type="button"
              onClick={handleCancelVerification}
              className="w-full mt-3 py-2 text-gray-400 hover:text-white text-sm transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
