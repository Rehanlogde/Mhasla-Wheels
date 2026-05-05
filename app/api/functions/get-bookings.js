// /opt/mhasla/app/api/functions/get-bookings.js
import { pool } from "../db.js";

export async function handler(event) {
  const auth = event.headers.authorization || "";
  const token = auth.replace("Bearer ", "").trim();

  // 🔒 Admin authentication
  if (token !== process.env.ADMIN_TOKEN) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: "Unauthorized" }),
    };
  }

  try {
    const query = `
      SELECT 
        id,
        booking_code,
        customer_id,
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
        status,
        ride_date,
        created_at,
        updated_at,
        admin_comment,
        address,
        driverid,
        vehiclename,fare,drivername
      FROM bookings
      ORDER BY created_at DESC;
    `;

    const { rows } = await pool.query(query);
    return {
      statusCode: 200,
      body: JSON.stringify({ bookings: rows }),
    };
  } catch (err) {
    console.error("get-bookings error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
