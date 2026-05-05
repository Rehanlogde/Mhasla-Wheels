// /opt/mhasla/app/api/functions/create-feedback.js
import { pool } from "../db.js";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { name, rating, comments } = JSON.parse(event.body || "{}");

    if (!name || !rating || !comments) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required fields" }),
      };
    }

    // 🟢 Insert feedback into local DB
    const query = `
      INSERT INTO feedbacks (name, rating, comments, created_at)
      VALUES ($1, $2, $3, NOW());
    `;
    const values = [name, rating, comments];

    await pool.query(query, values);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Feedback submitted successfully!" }),
    };
  } catch (err) {
    console.error("create-feedback error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error submitting feedback" }),
    };
  }
}
