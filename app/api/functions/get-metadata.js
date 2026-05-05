// /opt/mhasla/app/api/functions/get-metadata.js
import { pool } from "../db.js";

export async function handler(event) {
    // Allow both GET and POST (frontend uses POST with page_name in body)
    if (event.httpMethod !== "GET" && event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method Not Allowed" }),
        };
    }

    try {
        let page_name = null;

        // Check query params for GET
        if (event.httpMethod === "GET") {
            page_name = event.queryStringParameters?.page_name;
        }

        // Check body for POST
        if (event.httpMethod === "POST" && event.body) {
            const body = JSON.parse(event.body);
            page_name = body.page_name;
        }

        // If page_name provided, fetch specific page metadata
        if (page_name) {
            const query = `SELECT * FROM metadata WHERE page_name = $1 LIMIT 1;`;
            const { rows } = await pool.query(query, [page_name]);

            if (rows.length === 0) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({ error: "Metadata not found for page" }),
                };
            }

            return {
                statusCode: 200,
                body: JSON.stringify({ ok: true, metadata: rows[0] }),
            };
        }

        // Otherwise fetch all metadata
        const query = `SELECT * FROM metadata ORDER BY page_name ASC;`;
        const { rows } = await pool.query(query);

        return {
            statusCode: 200,
            body: JSON.stringify({ ok: true, metadata: rows }),
        };
    } catch (err) {
        console.error("get-metadata error:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message }),
        };
    }
}
