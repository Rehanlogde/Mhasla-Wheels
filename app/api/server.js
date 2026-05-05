import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import rateLimit from "express-rate-limit";
import { fileURLToPath } from "url";
import { dirname, join } from "path";import * as vehiclenamegetting from "./functions/getvehiclenamebyid.js"

/* =======================
   IMPORT FUNCTIONS
======================= */
import * as Farecalculation from "./functions/Fare_calculation.js";
import * as Savingonetap from "./functions/onetapdatasaving.js"
import * as adminLogin from "./functions/admin-login.js";
import * as drivercreation from "./functions/create-driver.js"
import * as customerLogin from "./functions/customer-login.js";
import * as customerRegister from "./functions/customer-register.js";
import * as createBooking from "./functions/create-booking.js";
import * as createFeedback from "./functions/create-feedback.js";
import * as createVehicle from "./functions/create-vehicle.js";
import * as deleteVehicle from "./functions/deleteVehicle.js";
import * as getBooking from "./functions/get-booking.js";
import * as getBookings from "./functions/get-bookings.js";
import * as getCustomerBookings from "./functions/get-customer-bookings.js";
import * as getFeedbacks from "./functions/get-feedbacks.js";
import * as getMetadata from "./functions/get-metadata.js";
import * as getSettings from "./functions/get-settings.js";
import * as getVehicles from "./functions/get-vehicles.js";
import * as metadataCrud from "./functions/metadata-crud.js";
import * as updateBooking from "./functions/update-booking.js";
import * as updateProfile from "./functions/update-profile.js";
import * as updateSettings from "./functions/update-settings.js";
import * as updateVehicle from "./functions/update-vehicle.js";
import * as validateCoupon from "./functions/validate-coupon.js";
import * as uploadVehicleImage from "./functions/upload-vehicle-image.js";
import * as vehicleImage from "./functions/vehicle-image.js";
import * as driverlogin from "./functions/driver-login.js";
import * as removeVehicleImage from "./functions/remove-vehicle-image.js";
import * as addvehicles from  "./functions/add-vehicles.js";
import * as drivers_showing from "./functions/Show-drivers.js";
import  * as driverdeletion  from "./functions/driver-deletion.js"
import * as superusercreation from "./functions/create-superuser.js"
import * as Superuserlogin from "./functions/Superuser-login.js"
import * as updatebookingstatus from "./functions/booking-status-update.js"
import * as Superuser_bookings from "./functions/Superuser_booking_getiting.js";
import * as  Emailverificationcodesending from "./functions/Email_verification_code_sending.js";
import * as Email_verification_code_verifying from "./functions/Email_verification_code_verifying.js";
import * as verificationofuserregardingphonenumber from "./functions/verify_that_user_have_phonenumber.js";
import * as Addingphonenumber from "./functions/add-user-phonenumber.js";
import * as Phonenumbercodegenerator from "./functions/phonenumbercodegenerator.js";
import * as Phonenumberverification from "./functions/phone-number-verification.js";
import * as Gettingdriverdetails from "./functions/Drivers_details_for_booking.js"
import * as Getplacenames from "./functions/get-places-names.js"
import * as Changedriver from "./functions/Change-driver.js";
import * as Mailtosomeone from "./functions/mailtosomeonebyadmin.js";
import * as CouponCodeverification from "./functions/Coupon_code_verification.js";
import * as InfogettingforloyaltyProgram from "./functions/get-info-for-loyalty-program.js";
import * as Getsuperuserdata from "./functions/get-super-user-data.js";

import * as editfleet from "./functions/editFleetVehicle.js"
import * as getUserData from "./functions/getUsers.js";
import  * as Deletesuperuser from "./functions/deletesuperuser.js";
import * as Superuserdata from "./functions/get-super-user-data-admin.js";
import * as allowAdminAcess from "./functions/adminaccesstosuperuser.js";
import * as getCredits from "./functions/get-credits.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json({ limit: "8mb" }));

// Serve static files from /uploads
app.use("/uploads", express.static(join(__dirname, "public", "uploads")));

/* =======================
   CORS
======================= */
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

const wrap = (mod) => async (req, res) => {
  try {
    const fn = mod.handler || mod.default;

    if (typeof fn !== "function") {
      throw new Error("Invalid function export");
    }

    // 🧠 EXPRESS STYLE (req, res)
    if (fn.length >= 2) {
      return fn(req, res);
    }

    // 🧠 NETLIFY STYLE (event)
    const result = await fn({
      httpMethod: req.method,
      headers: req.headers,
      body: req.body ? JSON.stringify(req.body) : undefined,
      queryStringParameters: req.query,
    });

    if (!result) {
      throw new Error("Function returned nothing");
    }

    res
      .status(result.statusCode || 200)
      .set(result.headers || {})
      .send(result.body);
  } catch (err) {
    console.error("❌ API Error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

/* =======================
   ROUTES (NO NETLIFY)
======================= */

// 🚦 Phase 5: Rate limiter for booking creation (5 per hour per IP)
const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { ok: false, error: "Too many booking attempts. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.all("/api/functions/admin-login", wrap(adminLogin));
app.all("/api/functions/customer-login", wrap(customerLogin));
app.all("/api/functions/customer-register", wrap(customerRegister));
app.post("/api/functions/create-booking", bookingLimiter, wrap(createBooking));
app.all("/api/functions/create-booking", wrap(createBooking)); // Allow GET for OPTIONS/CORS
app.all("/api/functions/create-feedback", wrap(createFeedback));
app.all("/api/functions/create-vehicle", wrap(createVehicle));
app.all("/api/functions/get-booking", wrap(getBooking));
app.all("/api/functions/get-bookings", wrap(getBookings));
app.all("/api/functions/get-customer-bookings", wrap(getCustomerBookings));
app.all("/api/functions/get-feedbacks", wrap(getFeedbacks));
app.all("/api/functions/get-metadata", wrap(getMetadata));
app.all("/api/functions/get-settings", wrap(getSettings));
app.all("/api/functions/get-vehicles", wrap(getVehicles));
app.all("/api/functions/metadata-crud", wrap(metadataCrud));
app.all("/api/functions/update-booking", wrap(updateBooking));
app.all("/api/functions/update-profile", wrap(updateProfile));
app.all("/api/functions/update-settings", wrap(updateSettings));
app.all("/api/functions/update-vehicle", wrap(updateVehicle));
app.all("/api/functions/validate-coupon", wrap(validateCoupon));
app.all("/api/functions/create-driver", wrap(drivercreation))
app.all("/api/functions/create-superuser", wrap(superusercreation))
app.all("/api/functions/driver-login", wrap(driverlogin))
app.all("/api/functions/getvehiclesnamebyid", wrap(vehiclenamegetting))
app.all("/api/functions/savingtheonetapsignupdata", wrap(Savingonetap))
app.all("/api/functions/showdrivers", wrap(drivers_showing))
app.all("/api/functions/driverdeletion", wrap(driverdeletion))
app.all("/api/functions/updatebookingstatus", wrap(updatebookingstatus))
app.all("/api/functions/superuser-login", wrap(Superuserlogin))
app.all("/api/functions/superuser_booking_details", wrap(Superuser_bookings))
app.all("/api/functions/emailcodesending", wrap(Emailverificationcodesending))
app.all("/api/functions/emailverification", wrap(Email_verification_code_verifying))
app.all("/api/functions/checkphonenumberofcustomer", wrap(verificationofuserregardingphonenumber))
app.all("/api/functions/addphonenumber", wrap(Addingphonenumber))
app.all("/api/functions/phonenumbercodegenerator", wrap(Phonenumbercodegenerator))
app.all("/api/functions/phone-number-verification", wrap(Phonenumberverification))
app.all("/api/functions/getdriversdetailforbookingmodule", wrap(Gettingdriverdetails))
app.all("/api/functions/fare-calculation", wrap(Farecalculation))
app.all("/api/functions/get-place-name", wrap(Getplacenames))
app.all("/api/functions/change-driver-for-booking", wrap(Changedriver))
app.all("/api/functions/mailtosomeonebyadmin", wrap(Mailtosomeone))
app.all("/api/functions/couponcodeverification", wrap(CouponCodeverification))
app.all("/api/functions/get-coupon-code-data", wrap(InfogettingforloyaltyProgram))
app.all("/api/functions/getsuperuserdata", wrap(Getsuperuserdata))
app.all("/api/functions/editFleetVehicle", wrap(editfleet) )
app.all("/api/functions/deleteFleetVehicle", wrap(deleteVehicle) )
app.all("/api/functions/getusers", wrap(getUserData) )
app.all("/api/functions/makesuperuseradminaccess", wrap(allowAdminAcess))

app.all("/api/functions/getusercredits", wrap(getCredits))

app.get("/api/functions/getsuperuserdataforadmin", wrap(Superuserdata))
app.all("/api/functions/deletesuperuser", wrap(Deletesuperuser))
// File upload endpoint with multer (Express-style, not wrapped)
const upload = multer({ storage: multer.memoryStorage() });
app.post("/api/functions/add-vehicles", upload.single("imagedata"), addvehicles.default);
app.post("/api/functions/upload-vehicle-image", upload.single("file"), uploadVehicleImage.handler);

// Image serving endpoint (Express-style, not wrapped)
app.get("/api/functions/vehicle-image", vehicleImage.handler);

// Remove vehicle image endpoint (Express-style, not wrapped)
app.post("/api/functions/remove-vehicle-image", express.json(), removeVehicleImage.handler);

/* =======================
   HEALTH CHECK
======================= */
app.get("/api/health", (_, res) => {
  res.json({ ok: true });
});

/* =======================
   START SERVER
======================= */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ API running on http://localhost:${PORT}`);
});
