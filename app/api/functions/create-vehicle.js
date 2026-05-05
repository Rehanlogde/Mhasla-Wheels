// /opt/mhasla/app/api/functions/create-vehicle.js
import { pool } from "../db.js";
import { v4 as uuidv4 } from "uuid";

export async function handler(event) {
  // Allow only POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  // 🔒 Admin authentication
  const auth = event.headers.authorization || "";
  const token = auth.replace("Bearer ", "").trim();
  if (token !== process.env.ADMIN_TOKEN) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: "Unauthorized" }),
    };
  }

  try {
    // ✅ Parse request body
    const payload = JSON.parse(event.body || "{}");
    let {
      name,
      type,
      capacity,
      per_km_rate,
      base_rate,
      image_url,
      availability,
    } = payload;

    if (!name) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Vehicle name is required" }),
      };
    }

    // ✅ Sanitize numeric fields
    const safeCapacity =
      capacity === "" || capacity === undefined ? null : Number(capacity);
    const safePerKm =
      per_km_rate === "" || per_km_rate === undefined
        ? null
        : Number(per_km_rate);
    const safeBaseRate =
      base_rate === "" || base_rate === undefined ? null : Number(base_rate);

    // ✅ Ensure availability is boolean (default = true)
    const safeAvailability =
      availability === undefined || availability === "" ? true : Boolean(availability);

    // ✅ Ensure image_url is properly set
    const safeImageUrl =
      typeof image_url === "string" && image_url.trim() !== ""
        ? image_url.trim()
        : null;

    const id = uuidv4();

    // 🟢 Insert into PostgreSQL
    const query = `
      INSERT INTO vehicles (
        id, name, type, capacity, per_km_rate, base_rate,
        image_url, availability, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      RETURNING *;
    `;

    const values = [
      id,
      name,
      type || null,
      safeCapacity,
      safePerKm,
      safeBaseRate,
      safeImageUrl,
      safeAvailability,
    ];

    const { rows } = await pool.query(query, values);
    const vehicle = rows[0];

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "✅ Vehicle created successfully",
        vehicle,
      }),
    };
  } catch (err) {
    console.error("❌ create-vehicle error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
