// /opt/mhasla/app/api/functions/update-vehicle.js
import { pool } from "../db.js";

export async function handler(event) {
  if (event.httpMethod !== "POST" && event.httpMethod !== "PUT") {
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
    let { id, ...updates } = JSON.parse(event.body || "{}");

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing vehicle ID" }),
      };
    }

    // ✅ Sanitize numeric fields
    ["capacity", "per_km_rate", "base_rate"].forEach((field) => {
      if (updates[field] === "" || updates[field] === undefined) {
        updates[field] = null;
      } else if (!isNaN(updates[field])) {
        updates[field] = Number(updates[field]);
      }
    });

    // ✅ Ensure availability is boolean
    if (Object.prototype.hasOwnProperty.call(updates, "availability")) {
      updates.availability = Boolean(updates.availability);
    }

    // ✅ Handle image_url updates
    if (Object.prototype.hasOwnProperty.call(updates, "image_url")) {
      if (typeof updates.image_url === "string" && updates.image_url.trim() !== "") {
        updates.image_url = updates.image_url.trim();
      } else {
        updates.image_url = null;
      }
    }

    // 🟢 Build a dynamic SQL update query safely
    const fields = Object.keys(updates);
    if (fields.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No fields provided for update" }),
      };
    }

    const setClause = fields.map((key, i) => `${key} = $${i + 2} `).join(", ");
    const values = [id, ...Object.values(updates)];

    const query = `
      UPDATE vehicles
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
RETURNING *;
`;

    console.log("🔄 Updating vehicle:", id, updates);

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Vehicle not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "✅ Vehicle updated successfully",
        vehicle: rows[0],
      }),
    };
  } catch (err) {
    console.error("❌ update-vehicle error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
