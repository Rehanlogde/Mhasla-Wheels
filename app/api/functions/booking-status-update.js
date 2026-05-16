

import { stat } from "fs"
import { pool } from "../db.js"
import { sendmail, sendmailtoadmin, sendmailtosuperuser } from "./mailfunctions.js"
import { sendsmsmessage } from "./whatsappops.js"


export default async function updatingbookingandcarstatus(req, res) {
  try {
    const { bookingid, status, vehicleid, emailid, pickup, destination, vehiclename, driverid, fare } = req.body

    console.log("got the data : ", bookingid, status, vehicleid)

    var query = "select * from drivers where id = $1"
    console.log("This is the driverid : ", driverid)
    const result1 = await pool.query(query, [driverid])
    console.log("this is tthe length : ", result1.rowCount)
    const driverName = result1.rows[0]?.name || "-";
    console.log(driverName)
    const driverContact = result1.rows[0]?.contact_number || "-";
    const dbquery = "UPDATE bookings set status = $1 where booking_code = $2"
    const result = await pool.query(dbquery, [status, bookingid])
    if (result.rowCount >= 1) {
      var dbquery2

      if (status === "Started") {

        dbquery2 = "UPDATE mw_vehicles set vehiclestatus = $1 where vehicleid = $2 "

        var result2 = await pool.query(dbquery2, ['occupied', vehicleid])
        if (result2.rowCount < 1) {
          return res.json({
            ok: false,
            message: "DB ISSUE"
          })
        }

      }
      else if (status === "Finished" || status != "Started") {

        dbquery2 = "UPDATE mw_vehicles set vehiclestatus = $1 where vehicleid = $2"
        var result2 = await pool.query(dbquery2, ['available', vehicleid])
        if (result2.rowCount < 1) {
          return res.json({
            ok: false,
            message: "DB ISSUE"
          })
        }
      }

      switch (status) {
        case "Confirmed": await sendsmsmessage(
          `Booking Confirmed
ID:${bookingid}
Vehicle:${vehiclename || "-"}
Pickup:${pickup || "-"}
Drop:${destination || "-"}
Driver:${driverName}
Contact:${driverContact}`
        );
          await sendmail("Booking Confirmed ✅", emailid, `
      <p>Hi there!</p>
      <p>Great news — <strong>your ride has been confirmed!</strong> We're all set and ready to get you where you need to go.</p>
      <table role="presentation" cellpadding="6" cellspacing="0" style="font-size:14px;color:#d4d4d4;line-height:1.6;border:1px solid #2a2a2a;border-radius:8px;overflow:hidden;width:100%;background-color:#1a1a1a;">
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Booking ID</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${bookingid}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Vehicle</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${vehiclename || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Pickup</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${pickup || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Destination</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${destination || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Driver Name</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${driverName}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Driver Contact</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${driverContact}</td></tr>
        <tr><td style="padding:8px 12px;color:#dc2626;font-weight:600;">Status</td><td style="padding:8px 12px;color:#22c55e;font-weight:700;">✅ Confirmed</td></tr>
      </table>
      <p style="margin-top:20px;color:#a3a3a3;">Sit back and relax — your driver will be assigned shortly. We'll keep you posted on any updates!</p>
      <p style="color:#d4d4d4;">Thank you for choosing <strong style="color:#dc2626;">Mhasla Wheels</strong> 🚗</p>
      <div style="margin-top:16px;text-align:center;">
        <img src="https://raw.githubusercontent.com/Rehanlogde/Mhasla_wheels_images/main/Ride_confirmed.png" alt="Have a safe journey!" style="max-width:100%;border-radius:10px;border:1px solid #2a2a2a;" />
      </div>
      `)
          await sendmailtoadmin("Booking Confirmed — Admin Notification", `
      <p>Dear Admin,</p>
      <p>The following booking has been <strong style="color:#22c55e;">confirmed</strong> and the customer has been notified accordingly.</p>
      <table role="presentation" cellpadding="6" cellspacing="0" style="font-size:14px;color:#d4d4d4;line-height:1.6;border:1px solid #2a2a2a;border-radius:8px;overflow:hidden;width:100%;background-color:#1a1a1a;">
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Booking ID</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${bookingid}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Vehicle ID</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${vehicleid || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Vehicle Name</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${vehiclename || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Customer Email</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${emailid || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Pickup Location</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${pickup || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Destination</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${destination || "-"}</td></tr>
        <tr><td style="padding:8px 12px;color:#dc2626;font-weight:600;">Status</td><td style="padding:8px 12px;color:#22c55e;font-weight:700;">Confirmed</td></tr>
      </table>
      <p style="margin-top:16px;color:#a3a3a3;">A driver assignment may be required. Please review and take necessary action from the admin dashboard.</p>
    
    
      `)
        await sendmailtosuperuser("Booking Confirmed — Manager Notification", `
      <p>Dear Manager,</p>
      <p>The following booking has been <strong style="color:#22c55e;">confirmed</strong> and the customer has been notified accordingly.</p>
      <table role="presentation" cellpadding="6" cellspacing="0" style="font-size:14px;color:#d4d4d4;line-height:1.6;border:1px solid #2a2a2a;border-radius:8px;overflow:hidden;width:100%;background-color:#1a1a1a;">
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Booking ID</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${bookingid}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Vehicle ID</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${vehicleid || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Vehicle Name</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${vehiclename || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Customer Email</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${emailid || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Pickup Location</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${pickup || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Destination</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${destination || "-"}</td></tr>
        <tr><td style="padding:8px 12px;color:#dc2626;font-weight:600;">Status</td><td style="padding:8px 12px;color:#22c55e;font-weight:700;">Confirmed</td></tr>
      </table>
      <p style="margin-top:16px;color:#a3a3a3;">A driver assignment may be required. Please review and notify adminsfor taking action if needed.</p>
    
      `)
          break;
        case "Started":
          await sendsmsmessage(
            `Ride Started 🚗
Booking: ${bookingid}
Vehicle: ${vehiclename || "-"}
Pickup: ${pickup || "-"}
Drop: ${destination || "-"}
Driver: ${driverName}
Contact: ${driverContact}`
          );
          await sendmail("Your Ride Has Started 🚀", emailid, `
      <p>Hey!</p>
      <p><strong>Your ride is on the move!</strong> Your driver is heading to pick you up. Buckle up and enjoy the journey!</p>
      <table role="presentation" cellpadding="6" cellspacing="0" style="font-size:14px;color:#d4d4d4;line-height:1.6;border:1px solid #2a2a2a;border-radius:8px;overflow:hidden;width:100%;background-color:#1a1a1a;">
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Booking ID</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${bookingid}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Vehicle</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${vehiclename || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Pickup</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${pickup || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Destination</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${destination || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Driver Name</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${driverName}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Driver Contact</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${driverContact}</td></tr>
        <tr><td style="padding:8px 12px;color:#dc2626;font-weight:600;">Status</td><td style="padding:8px 12px;color:#facc15;font-weight:700;">🚀 Started</td></tr>
      </table>
      <p style="margin-top:24px;color:#d4d4d4;font-size:16px;font-weight:600;">Have a safe and wonderful journey! 🛣️</p>
      <div style="margin-top:16px;text-align:center;">
        <img src="https://raw.githubusercontent.com/Rehanlogde/Mhasla_wheels_images/main/Journey_starting.png" alt="Have a safe journey!" style="max-width:100%;border-radius:10px;border:1px solid #2a2a2a;" />
      </div>
    `)
          await sendmailtoadmin("Ride Started — Admin Notification", `
      <p>Dear Admin,</p>
      <p>The following ride has been <strong style="color:#facc15;">started</strong>. The assigned vehicle status has been updated to <strong>occupied</strong>.</p>
      <table role="presentation" cellpadding="6" cellspacing="0" style="font-size:14px;color:#d4d4d4;line-height:1.6;border:1px solid #2a2a2a;border-radius:8px;overflow:hidden;width:100%;background-color:#1a1a1a;">
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Booking ID</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${bookingid}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Vehicle ID</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${vehicleid || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Vehicle Name</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${vehiclename || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Customer Email</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${emailid || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Pickup Location</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${pickup || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Destination</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${destination || "-"}</td></tr>
        <tr><td style="padding:8px 12px;color:#dc2626;font-weight:600;">Status</td><td style="padding:8px 12px;color:#facc15;font-weight:700;">Started</td></tr>
      </table>
      <p style="margin-top:16px;color:#a3a3a3;">Vehicle has been marked as occupied. Monitor the ride progress from the admin dashboard.</p>
    `)
    
          await sendmailtosuperuser("Ride Started — Admin Notification", `
      <p>Dear Manager,</p>
      <p>The following ride has been <strong style="color:#facc15;">started</strong>. The assigned vehicle status has been updated to <strong>occupied</strong>.</p>
      <table role="presentation" cellpadding="6" cellspacing="0" style="font-size:14px;color:#d4d4d4;line-height:1.6;border:1px solid #2a2a2a;border-radius:8px;overflow:hidden;width:100%;background-color:#1a1a1a;">
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Booking ID</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${bookingid}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Vehicle ID</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${vehicleid || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Vehicle Name</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${vehiclename || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Customer Email</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${emailid || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Pickup Location</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${pickup || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Destination</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${destination || "-"}</td></tr>
        <tr><td style="padding:8px 12px;color:#dc2626;font-weight:600;">Status</td><td style="padding:8px 12px;color:#facc15;font-weight:700;">Started</td></tr>
      </table>
      <p style="margin-top:16px;color:#a3a3a3;">Vehicle has been marked as occupied. Monitor the ride progress from the admin dashboard.</p>
    `)
          break;
        case "Finished":
            //loyaly program destructing
            const dbquery = "UPDATE customers set mw_credits = mw_credits + $1 where email = $2"
            var creditstobeadded = (1/100) * fare
              console.log("type of : ",typeof(parseInt(creditstobeadded)), parseInt(creditstobeadded))
            const dbresult = await pool.query(dbquery, [parseInt(creditstobeadded), emailid])
            if (dbresult.rowCount > 0) {
              console.log("Finally updated the record in the user account")
            }
            else{
              console.log("UPDATION failed")
            }
          await sendsmsmessage(
            `Ride Completed 🚗
Booking: ${bookingid}
Vehicle: ${vehiclename || "-"}
Pickup: ${pickup || "-"}
Drop: ${destination || "-"}
Driver: ${driverName}
Contact: ${driverContact}
Status: Completed
Thanks for riding with Mhasla Wheels!`
          );

          await sendmail("Ride Completed 🏁", emailid, `
      <p>Hello!</p>
      <p><strong>Your ride has been completed!</strong> We hope you had an amazing experience with us. Your comfort and safety are what drive us — literally! 😄</p>
      <table role="presentation" cellpadding="6" cellspacing="0" style="font-size:14px;color:#d4d4d4;line-height:1.6;border:1px solid #2a2a2a;border-radius:8px;overflow:hidden;width:100%;background-color:#1a1a1a;">
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Booking ID</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${bookingid}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Vehicle</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${vehiclename || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Pickup</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${pickup || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Destination</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${destination || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Driver Name</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${driverName}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Driver Contact</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${driverContact}</td></tr>
        <tr><td style="padding:8px 12px;color:#dc2626;font-weight:600;">Status</td><td style="padding:8px 12px;color:#22c55e;font-weight:700;">🏁 Completed</td></tr>
      </table>
      <p style="margin-top:20px;color:#d4d4d4;">It was a pleasure serving you! We'd love to hear how your ride went — your feedback helps us improve and serve you even better next time. ❤️</p>
      <a href="http://wwww.mhaslawheels.in/feedback>Give us feedback</a>
      <p style="color:#a3a3a3;">Until next time — ride safe, ride <strong style="color:#dc2626;">Mhasla</strong>! 🚗💨</p>
      <div style="margin-top:16px;text-align:center;">
        <img src="https://raw.githubusercontent.com/Rehanlogde/Mhasla_wheels_images/main/Journey_ending.png" alt="Have a safe journey!" style="max-width:100%;border-radius:10px;border:1px solid #2a2a2a;" />
      </div>
      `)
          await sendmailtoadmin("Ride Completed — Admin Notification", `
      <p>Dear Admin,</p>
      <p>The following ride has been <strong style="color:#22c55e;">completed</strong>. The assigned vehicle has been released and its status updated to <strong>available</strong>.</p>
      <table role="presentation" cellpadding="6" cellspacing="0" style="font-size:14px;color:#d4d4d4;line-height:1.6;border:1px solid #2a2a2a;border-radius:8px;overflow:hidden;width:100%;background-color:#1a1a1a;">
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Booking ID</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${bookingid}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Vehicle ID</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${vehicleid || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Vehicle Name</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${vehiclename || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Customer Email</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${emailid || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Pickup Location</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${pickup || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Destination</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${destination || "-"}</td></tr>
        <tr><td style="padding:8px 12px;color:#dc2626;font-weight:600;">Status</td><td style="padding:8px 12px;color:#22c55e;font-weight:700;">Completed</td></tr>
      </table>
      <p style="margin-top:16px;color:#a3a3a3;">This booking has been closed. Vehicle is now available for new assignments.</p>
    `)
    await sendmailtosuperuser(
      "Ride Completed — Admin Notification", `
      <p>Dear Manager,</p>
      <p>The following ride has been <strong style="color:#22c55e;">completed</strong>. The assigned vehicle has been released and its status updated to <strong>available</strong>.</p>
      <table role="presentation" cellpadding="6" cellspacing="0" style="font-size:14px;color:#d4d4d4;line-height:1.6;border:1px solid #2a2a2a;border-radius:8px;overflow:hidden;width:100%;background-color:#1a1a1a;">
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Booking ID</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${bookingid}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Vehicle ID</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${vehicleid || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Vehicle Name</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${vehiclename || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Customer Email</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${emailid || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Pickup Location</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${pickup || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Destination</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${destination || "-"}</td></tr>
        <tr><td style="padding:8px 12px;color:#dc2626;font-weight:600;">Status</td><td style="padding:8px 12px;color:#22c55e;font-weight:700;">Completed</td></tr>
      </table>
      <p style="margin-top:16px;color:#a3a3a3;">This booking has been closed. Vehicle is now available for new assignments.</p>
    `
    )
          break;
        case "Rejected":
          await sendsmsmessage(
            `Booking Rejected
ID:${bookingid}
Vehicle:${vehiclename || "-"}
Pickup:${pickup || "-"}
Drop:${destination || "-"}
Driver:${driverName || "-"}
Contact:${driverContact || "-"}
Status:Rejected`
          ); await sendmail("Booking Update ❌", emailid, `
      <p>Hi there,</p>
      <p>We're really sorry to let you know that <strong>your booking has been rejected</strong>. 😔</p>
      <table role="presentation" cellpadding="6" cellspacing="0" style="font-size:14px;color:#d4d4d4;line-height:1.6;border:1px solid #2a2a2a;border-radius:8px;overflow:hidden;width:100%;background-color:#1a1a1a;">
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Booking ID</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${bookingid}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Vehicle</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${vehiclename || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Pickup</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${pickup || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Destination</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${destination || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Driver Name</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${driverName}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Driver Contact</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${driverContact}</td></tr>
        <tr><td style="padding:8px 12px;color:#dc2626;font-weight:600;">Status</td><td style="padding:8px 12px;color:#ef4444;font-weight:700;">❌ Rejected</td></tr>
      </table>
      <p style="margin-top:20px;color:#d4d4d4;">This could be due to vehicle unavailability or scheduling conflicts. But don't worry — we've got plenty of rides waiting for you!</p>
      <p style="color:#a3a3a3;">Feel free to book again or reach out to us if you need any help. We're always here for you. 🙏</p>
      <p style="color:#d4d4d4;">— Team <strong style="color:#dc2626;">Mhasla Wheels</strong> ❤️</p>
  <div style="margin-top:16px;text-align:center;">
        <img src="https://raw.githubusercontent.com/Rehanlogde/Mhasla_wheels_images/main/Ride_Rejected.png" alt="Have a safe journey!" style="max-width:100%;border-radius:10px;border:1px solid #2a2a2a;" />
      </div>
      `)
          await sendmailtoadmin("Booking Rejected — Admin Notification", `
      <p>Dear Admin,</p>
      <p>The following booking has been <strong style="color:#ef4444;">rejected</strong>. The customer has been notified about the cancellation.</p>
      <table role="presentation" cellpadding="6" cellspacing="0" style="font-size:14px;color:#d4d4d4;line-height:1.6;border:1px solid #2a2a2a;border-radius:8px;overflow:hidden;width:100%;background-color:#1a1a1a;">
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Booking ID</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${bookingid}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Vehicle ID</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${vehicleid || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Vehicle Name</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${vehiclename || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Customer Email</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${emailid || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Pickup Location</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${pickup || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Destination</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${destination || "-"}</td></tr>
        <tr><td style="padding:8px 12px;color:#dc2626;font-weight:600;">Status</td><td style="padding:8px 12px;color:#ef4444;font-weight:700;">Rejected</td></tr>
      </table>
      <p style="margin-top:16px;color:#a3a3a3;">The vehicle status has been set back to available. No further action is required unless a follow-up is needed.</p>
    `)
     await sendmailtosuperuser("Booking Rejected — Admin Notification", `
      <p>Dear Manager,</p>
      <p>The following booking has been <strong style="color:#ef4444;">rejected</strong>. The customer has been notified about the cancellation.</p>
      <table role="presentation" cellpadding="6" cellspacing="0" style="font-size:14px;color:#d4d4d4;line-height:1.6;border:1px solid #2a2a2a;border-radius:8px;overflow:hidden;width:100%;background-color:#1a1a1a;">
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Booking ID</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${bookingid}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Vehicle ID</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${vehicleid || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Vehicle Name</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${vehiclename || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Customer Email</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${emailid || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Pickup Location</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${pickup || "-"}</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Destination</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${destination || "-"}</td></tr>
        <tr><td style="padding:8px 12px;color:#dc2626;font-weight:600;">Status</td><td style="padding:8px 12px;color:#ef4444;font-weight:700;">Rejected</td></tr>
      </table>
      <p style="margin-top:16px;color:#a3a3a3;">The vehicle status has been set back to available. No further action is required unless a follow-up is needed.</p>
    `)
          break;
        default:
          break;
      }
      return res.json({
        ok: true,
        message: 'Changed successfully'
      });

    }
    else {
      return res.json({
        ok: false,
        message: "DB ISSUE"
      })
    }
  }
  catch (err) {
    console.debug("error occurred", err)
    return res.json({
      ok: false,
      message: "Internal server error "
    })
  }
}