// /opt/mhasla/app/api/functions/get-settings.js
import { pool } from "../db.js";

export async function handler(event) {
    if (event.httpMethod !== "GET") {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method Not Allowed" }),
        };
    }

    try {
        const query = `SELECT * FROM settings LIMIT 1;`;
        const { rows } = await pool.query(query);

        if (rows.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "Settings not found" }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ ok: true, settings: rows[0] }),
        };
    } catch (err) {
        console.error("get-settings error:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message }),
        };
    }
}
