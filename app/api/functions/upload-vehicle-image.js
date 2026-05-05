// api/functions/upload-vehicle-image.js
import { pool } from "../db.js";

export async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const auth = req.headers.authorization || "";
    const token = auth.replace("Bearer ", "").trim();
    if (token !== process.env.ADMIN_TOKEN) {
        return res.status(403).json({ error: "Unauthorized" });
    }

    try {
        const vehicle_id = req.body?.vehicle_id;
        const file = req.file;

        if (!vehicle_id) {
            return res.status(400).json({ error: "Missing vehicle_id" });
        }

        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Validate file size (max 2 MB)
        const MAX_SIZE = 2 * 1024 * 1024; // 2 MB
        if (file.size > MAX_SIZE) {
            return res.status(400).json({ error: "File too large. Maximum size is 2 MB." });
        }

        // Validate MIME type
        const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
        if (!ALLOWED_TYPES.includes(file.mimetype)) {
            return res.status(400).json({ error: "Invalid file type. Allowed: JPEG, PNG, WebP." });
        }

        const query = `
      UPDATE vehicles
      SET image = $1, image_mime = $2, updated_at = NOW()
      WHERE id = $3
      RETURNING id;
    `;

        const { rows } = await pool.query(query, [
            file.buffer,
            file.mimetype,
            vehicle_id,
        ]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Vehicle not found" });
        }

        return res.status(200).json({
            ok: true,
            message: "Image uploaded successfully",
            vehicle_id: rows[0].id,
        });
    } catch (err) {
        console.error("upload-vehicle-image error:", err);
        return res.status(500).json({ error: err.message });
    }
}
