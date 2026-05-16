// /opt/mhasla/app/api/functions/create-booking.js
import { pool } from "../db.js";
import { v4 as uuidv4 } from "uuid";
import sgMail from "@sendgrid/mail";
import * as mailfunctions from "./mailfunctions.js";
  import * as whatsappmessagesending from "./whatsappops.js"
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const payload = JSON.parse(event.body || "{}");
    const {
      name,
      phone,
      email,
      pickup_location,
      drop_location,
      journey_type,
      custom_journey_details,
      custom_rate,
      custom_unit,
      depart_date,
      depart_time,
      return_date,
      return_time,
      vehicle_id,
      coupon_code,
      customer_id,
      vehiclename,
      address,
      members, driver_id, fare,couponcode,
      iscreditused,
      totalCredits
      
    } = payload;

    if (!pickup_location) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required field: pickup_location" }),
      };
    }

    const safeName = name || "Guest";
    const safePhone = phone || "";
    const safeEmail = email || "";

    // 🕒 Ensure ride_date is valid
    let ride_date;
    if (depart_date) {
      ride_date = new Date(
        depart_time ? `${depart_date}T${depart_time}` : `${depart_date}T00:00`
      ).toISOString();
    } else {
      ride_date = new Date().toISOString();
    }

    const booking_code = `MB-${uuidv4().split("-")[0]}`;
    const id = uuidv4();

    // 🛑 Phase 3: Prevent duplicate bookings
    if (customer_id && pickup_location && depart_date) {
      const duplicateCheck = await pool.query(
        `SELECT id FROM bookings 
         WHERE customer_id = $1 
           AND pickup_location = $2 
           AND COALESCE(drop_location, '') = COALESCE($3, '')
           AND depart_date = $4
           AND status NOT IN ('rejected', 'completed')
         LIMIT 1`,
        [customer_id, pickup_location, drop_location || '', depart_date]
      );

      if (duplicateCheck.rows.length > 0) {
        return {
          statusCode: 409,
          body: JSON.stringify({
            ok: false,
            message: "You already have an active booking for this trip. Please check your profile or contact support.",
          }),
        };
      }
    }
 var  drivername = ""
   if (driver_id !=null && driver_id.length >0) {
    console.log(`This id is passing in drivers section : ${id} The driver id acttuallly is : ${driver_id}`)
    const dbquery = "select name from drivers where id = $1"
    const resultofdbquery = await pool.query(dbquery, [driver_id])
    if (resultofdbquery.rowCount > 0) {
      console.log("driver name is : ", resultofdbquery.rows[0]['name'])
      drivername = resultofdbquery.rows[0]['name']
    }
  }
  
    // 🟢 Insert into local PostgreSQL
    
    const query = `
      INSERT INTO bookings (
        id, booking_code, customer_id, name, phone, email, pickup_location,
        drop_location, journey_type, custom_journey_details, custom_rate,
        custom_unit, depart_date, depart_time, return_date, return_time,
        vehicle_id, coupon_code, status, ride_date, created_at, vehiclename, members, driverid, fare, address, drivername, isCreditsUsed
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,'pending',$19,NOW(),$20, $21, $22, $23, $24, $25,$26
      )
      RETURNING *;
    `;

    const values = [
      id,
      booking_code,
      customer_id || null,
      safeName,
      safePhone,
      safeEmail,
      pickup_location,
      drop_location || null,
      journey_type || null,
      custom_journey_details || null,
      custom_rate || null,
      custom_unit || null,
      depart_date || null,
      depart_time || null,
      return_date || null,
      return_time || null,
      vehicle_id || null,
      coupon_code || null,
      ride_date,
      vehiclename,
      members, driver_id, fare, address, drivername,
      iscreditused
    ];

    const { rows } = await pool.query(query, values);
      
    const booking = rows[0];
    console.log("safe email is ", safeEmail)
   
    if (iscreditused) {
      const dbquery = "update customers set mw_credits = $1 where email = $2 "
      const dbresult = await pool.query(dbquery, [totalCredits, email])
      if (dbresult.rowCount > 0) {
        console.log("MW credits  updated successfully")
      }
      else{
        console.log("Failed to update")
      }
      }

      else{
        console.log("is creditused is false")
      }
    await whatsappmessagesending.sendsmsmessage("Booking done")
    await mailfunctions.sendmail("Booking Confirmed", safeEmail, `
      <p>Hi <strong>${safeName}</strong>,</p>
      <p>Your booking has been successfully created! Here are your details:</p>
      <table role="presentation" cellpadding="6" cellspacing="0" style="font-size:14px;color:#d4d4d4;line-height:1.6;border:1px solid #2a2a2a;border-radius:8px;overflow:hidden;width:100%;background-color:#1a1a1a;">
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Booking Code</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${booking_code}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Name</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${safeName}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Phone</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${safePhone || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Email</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${safeEmail || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Pickup</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${pickup_location}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Drop</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${drop_location || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Journey Type</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${journey_type || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Vehicle</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${vehiclename || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Depart Date</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${depart_date || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Depart Time</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${depart_time || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Return Date</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${return_date || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Return Time</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${return_time || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Members</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${members || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Fare</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${fare || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Address</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${address || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Driver</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${drivername || "-"}</td></tr>
      </table>
      <p style="margin-top:20px;color:#a3a3a3;">We'll notify you once your booking is confirmed. Thank you for choosing Mhasla Wheels!</p>
    `)
   await  mailfunctions.sendmailtoadmin("New Booking Request", `
      <p.><strong>New booking request received!</strong></p>
      <table role="presentation" cellpadding="6" cellspacing="0" style="font-size:14px;color:#d4d4d4;line-height:1.6;border:1px solid #2a2a2a;border-radius:8px;overflow:hidden;width:100%;background-color:#1a1a1a;">
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Booking Code</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${booking_code}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Customer Name</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${safeName}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Phone</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${safePhone || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Email</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${safeEmail || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Pickup</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${pickup_location}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Drop</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${drop_location || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Journey Type</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${journey_type || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Vehicle</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${vehiclename || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Ride Date</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${ride_date}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Depart Date</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${depart_date || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Depart Time</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${depart_time || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Return Date</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${return_date || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Return Time</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${return_time || "-"}</td></tr>
        ${custom_journey_details ? `<tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Custom Details</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${custom_journey_details}</td></tr>` : ""}
        ${custom_rate ? `<tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Custom Rate</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">₹${custom_rate} ${custom_unit || ""}</td></tr>` : ""}
        ${coupon_code ? `<tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Coupon</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${coupon_code}</td></tr>` : ""}
        <tr><td style="padding:8px 12px;color:#dc2626;font-weight:600;">Status</td><td style="padding:8px 12px;color:#facc15;font-weight:600;">Pending</td></tr>
      </table>
      <p style="margin-top:20px;color:#a3a3a3;">Please review and take action on this booking from the admin dashboard.</p>
    `)
     if (couponcode.length >0) {
      
      console.log("Coupon code received :", couponcode)
     const dbquery2 = "delete from loyalty_program where uniqueid = $1"
     var result = await pool.query(dbquery2,[couponcode])
     if (result.rowCount > 0) {
      
       console.log("Coupon code deleted !")
      } 
      else{
        console.log("Coupon code is valid but not deleted")
      }
    }
    else{
      console.log(couponcode)
      console.log("Coupon code received is null")
    }    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Booking submitted successfully!",
        booking,
      }),
    };
  } catch (err) {
    console.error("create-booking error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error creating booking",
        error: err?.message || err,
      }),
    };
  }
}
