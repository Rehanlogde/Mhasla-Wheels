// api/functions/remove-vehicle-image.js
import { pool } from "../db.js";

export async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    // Admin authentication
    const auth = req.headers.authorization || "";
    const token = auth.replace("Bearer ", "").trim();
    if (token !== process.env.ADMIN_TOKEN) {
        return res.status(403).json({ error: "Unauthorized" });
    }

    try {
        const { vehicle_id } = req.body || {};

        if (!vehicle_id) {
            return res.status(400).json({ error: "Missing vehicle_id" });
        }

        const query = `
      UPDATE vehicles
      SET image = NULL, image_mime = NULL, updated_at = NOW()
      WHERE id = $1
      RETURNING id;
    `;

        const { rows } = await pool.query(query, [vehicle_id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Vehicle not found" });
        }

        return res.status(200).json({
            ok: true,
            message: "Image removed successfully",
            vehicle_id: rows[0].id,
        });
    } catch (err) {
        console.error("remove-vehicle-image error:", err);
        return res.status(500).json({ error: err.message });
    }
}
