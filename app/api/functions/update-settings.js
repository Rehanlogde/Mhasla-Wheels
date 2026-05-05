// /opt/mhasla/app/api/functions/update-settings.js
import { pool } from "../db.js";

export async function handler(event) {
  try {
    // Only allow POST requests
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    // 🔒 Admin token validation
    const token = event.headers.authorization?.replace("Bearer ", "");
    if (token !== process.env.ADMIN_TOKEN) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Unauthorized" }),
      };
    }

    const body = JSON.parse(event.body || "{}");

    // ✅ Fetch the first settings record ID (if not known)
    const idResult = await pool.query(`SELECT id FROM settings LIMIT 1;`);
    if (idResult.rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Settings record not found" }),
      };
    }

    const settingsId = idResult.rows[0].id;

    // ✅ Update the record with provided values
    const query = `
      UPDATE settings
      SET
        phone = $1,
        email = $2,
        address = $3,
        whatsapp_link = $4,
        facebook_link = $5,
        instagram_link = $6,
        twitter_link = $7,
        linkedin_link = $8,
        updated_at = NOW()
      WHERE id = $9
      RETURNING *;
    `;

    const values = [
      body.phone || null,
      body.email || null,
      body.address || null,
      body.whatsapp_link || null,
      body.facebook_link || null,
      body.instagram_link || null,
      body.twitter_link || null,
      body.linkedin_link || null,
      settingsId,
    ];

    const { rows } = await pool.query(query, values);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        updated: rows[0],
      }),
    };
  } catch (err) {
    console.error("❌ update-settings error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
