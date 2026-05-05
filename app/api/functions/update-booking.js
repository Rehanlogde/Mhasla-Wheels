// /opt/mhasla/app/api/functions/update-booking.js
import { pool } from "../db.js";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  // 🔒 Admin token check
  const auth = event.headers.authorization || "";
  const token = auth.replace("Bearer ", "").trim();
  if (token !== process.env.ADMIN_TOKEN) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: "Unauthorized" }),
    };
  }

  try {
    const { booking_code, status, reason } = JSON.parse(event.body || "{}");

    if (!booking_code || !status) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing booking_code or status" }),
      };
    }

    // 🔄 Phase 4: Validate status lifecycle
    const validTransitions = {
      pending: ["confirmed", "rejected"],
      confirmed: ["completed"],
      rejected: [],
      completed: [],
    };

    // Fetch current booking status
    const currentBooking = await pool.query(
      "SELECT status FROM bookings WHERE booking_code = $1",
      [booking_code]
    );

    if (currentBooking.rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Booking not found" }),
      };
    }

    const currentStatus = currentBooking.rows[0].status;
    const allowedNextStatuses = validTransitions[currentStatus] || [];

    if (!allowedNextStatuses.includes(status)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          ok: false,
          error: `Invalid status transition: ${currentStatus} → ${status}. Allowed: ${allowedNextStatuses.join(", ") || "none"}`,
        }),
      };
    }

    // 🟢 Update booking status and admin_comment
    const query = `
      UPDATE bookings
      SET status = $1,
          admin_comment = $2,
          updated_at = NOW()
      WHERE booking_code = $3
      RETURNING *;
    `;
    const values = [status, reason || null, booking_code];

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Booking not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Booking updated successfully",
        booking: rows[0],
      }),
    };
  } catch (err) {
    console.error("update-booking error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message || "Error updating booking",
      }),
    };
  }
}
