// /opt/mhasla/app/api/functions/get-customer-bookings.js
import { pool } from "../db.js";

export async function handler(event) {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  const customer_id = event.queryStringParameters?.customer_id;

  if (!customer_id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing customer_id" }),
    };
  }

  try {
    const query = `
      SELECT 
        booking_code,
        pickup_location,
        drop_location,
        journey_type,
        status,
        created_at
      FROM bookings
      WHERE customer_id = $1
      ORDER BY created_at DESC;
    `;

    const { rows } = await pool.query(query, [customer_id]);

    return {
      statusCode: 200,
      body: JSON.stringify({ bookings: rows }),
    };
  } catch (err) {
    console.error("get-customer-bookings error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
