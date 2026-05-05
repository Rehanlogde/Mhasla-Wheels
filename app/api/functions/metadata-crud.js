// /opt/mhasla/app/api/functions/metadata-crud.js
import { pool } from "../db.js";

export async function handler(event) {
  // 🔒 Admin token check
  const token = event.headers["x-admin-token"];
  if (token !== process.env.ADMIN_TOKEN) {
    return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized" }) };
  }

  try {
    const method = event.httpMethod;

    // 🟢 READ: Fetch all metadata records
    if (method === "GET") {
      const query = `SELECT * FROM metadata ORDER BY page_name ASC;`;
      const { rows } = await pool.query(query);
      return {
        statusCode: 200,
        body: JSON.stringify(rows),
      };
    }

    // Safely parse JSON body
    const body = JSON.parse(event.body || "{}");

    // 🟢 CREATE: Add new metadata record
    if (method === "POST") {
      const query = `
        INSERT INTO metadata (page_name, site_title, site_description, meta_keywords, og_image_url, inserted_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        RETURNING *;
      `;
      const values = [
        body.page_name,
        body.site_title,
        body.site_description,
        body.meta_keywords,
        body.og_image_url,
      ];
      const { rows } = await pool.query(query, values);

      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, data: rows }),
      };
    }

    // 🟢 UPDATE: Modify existing metadata
    if (method === "PUT") {
      const { id, updated_at, inserted_at, ...updates } = body;
      if (!id) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Missing ID for update" }),
        };
      }

      // Build dynamic SET clause safely (exclude system columns)
      const fields = Object.keys(updates);
      if (fields.length === 0) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "No fields to update" }),
        };
      }

      const setClause = fields.map(
        (key, i) => `${key} = $${i + 2}`
      ).join(", ");
      const values = [id, ...Object.values(updates)];

      const query = `
        UPDATE metadata
        SET ${setClause}, updated_at = NOW()
        WHERE id = $1
        RETURNING *;
      `;
      const { rows } = await pool.query(query, values);

      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, data: rows }),
      };
    }

    // 🟢 DELETE: Remove a metadata record
    if (method === "DELETE") {
      const { id } = body;
      if (!id) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Missing ID for delete" }),
        };
      }

      const query = `DELETE FROM metadata WHERE id = $1;`;
      await pool.query(query, [id]);

      return {
        statusCode: 200,
        body: JSON.stringify({ success: true }),
      };
    }

    // Unsupported method
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  } catch (err) {
    console.error("❌ metadata-crud error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
