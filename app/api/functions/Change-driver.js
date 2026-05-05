import { Dirent } from "fs";
import { pool } from "../db.js";
import { sendmail, sendmailtoadmin } from "./mailfunctions.js";

export default async function Changedriver(req, res) {
    const { bookingdata , driverselected} = req.body;
    console.log("data received : ", bookingdata, driverselected);
    // Update drivername and driverid for booking
    const firstdbquery = "select * from drivers where id = $1"
    const result1 = await pool.query(firstdbquery,[driverselected])

    if (result1.rowCount > 0) {
        console.log("result of drivername : ",result1)
    const dbquery = "UPDATE bookings SET drivername = $1, driverid = $2 WHERE id = $3";
    const result = await pool.query(dbquery, [result1.rows[0]['name'], driverselected, bookingdata.id]);
    console.log("result", result)
    if (result.rowCount > 0) {
        console.log("updated");
        sendmail(
            "Driver changed!",
            bookingdata.email,
            `<p>Hi <strong>${bookingdata.name}</strong>,</p>
            <p>We wanted to let you know that a new driver has been assigned to your booking. Please find your updated booking details below:</p>
            <table role="presentation" cellpadding="6" cellspacing="0" style="font-size:14px;color:#d4d4d4;line-height:1.6;border:1px solid #2a2a2a;border-radius:8px;overflow:hidden;width:100%;background-color:#1a1a1a;">
              <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Name</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${bookingdata.name}</td></tr>
              <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Pickup</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${bookingdata.pickup_location}</td></tr>
              <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Drop</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${bookingdata.drop_location || "-"}</td></tr>
              <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Journey Type</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${bookingdata.journey_type || "-"}</td></tr>
              <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Vehicle</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${bookingdata.vehiclename || "-"}</td></tr>
              <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Depart Date</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${bookingdata.depart_date || "-"}</td></tr>
              <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Depart Time</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${bookingdata.depart_time || "-"}</td></tr>
              <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Return Date</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${bookingdata.return_date || "-"}</td></tr>
              <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Return Time</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${bookingdata.return_time || "-"}</td></tr>
              <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Members</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${bookingdata.members || "-"}</td></tr>
              <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Fare</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${bookingdata.fare || "-"}</td></tr>
              <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Address</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${bookingdata.address || "-"}</td></tr>
              <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Driver</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${ result1.rows[0]['name']|| "-"}</td></tr>
              <tr><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#dc2626;font-weight:600;">Driver</td><td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;">${ result1.rows[0]['contact_number']|| "-"}</td></tr>
              </table>
            <p style="margin-top:20px;color:#a3a3a3;">If you have any questions or need further assistance, feel free to reply to this email. Safe travels and thank you for choosing Mhasla Wheels!</p>`
        );
        return res.json({
            ok: true,
            message: 'driver changed successfully'
        });
    } else {
        console.log("err")
        return res.json({
            ok: false,
            message: "Internal server issue"
        });
    }
}
else{
    return res.json({
        ok : false,
        message : 'Big server issue'
    })
}
}