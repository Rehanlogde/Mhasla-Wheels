// /opt/mhasla/app/api/functions/update-profile.js
import { pool } from "../db.js";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    const { user_id, name } = JSON.parse(event.body || "{}");

    if (!user_id || !name) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing user_id or name" }),
      };
    }

    // 🟢 Update the local profiles table
    const query = `
      UPDATE profiles
      SET name = $1, updated_at = NOW()
      WHERE user_id = $2
RETURNING *;
`;

    const values = [name, user_id];
    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Profile not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Profile updated successfully",
        profile: rows[0],
      }),
    };
  } catch (err) {
    console.error("update-profile error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
