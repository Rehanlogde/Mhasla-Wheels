// /opt/mhasla/app/api/functions/get-feedbacks.js
import { pool } from "../db.js";

export async function handler(event) {
    if (event.httpMethod !== "GET") {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method Not Allowed" }),
        };
    }

    try {
        const query = `
      SELECT id, name, rating, comments, created_at
      FROM feedbacks
      ORDER BY created_at DESC;
    `;
        const { rows } = await pool.query(query);

        // Calculate average rating
        let averageRating = null;
        if (rows.length > 0) {
            const sum = rows.reduce((acc, f) => acc + (f.rating || 0), 0);
            averageRating = parseFloat((sum / rows.length).toFixed(1));
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                ok: true,
                feedbacks: rows,
                averageRating,
                count: rows.length,
            }),
        };
    } catch (err) {
        console.error("get-feedbacks error:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message }),
        };
    }
}
