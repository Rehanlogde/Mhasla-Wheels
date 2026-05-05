// api/functions/vehicle-image.js
import { pool } from "../db.js";

export async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const id = req.query?.id;

        if (!id) {
            return res.status(400).json({ error: "Missing id parameter" });
        }

        const query = `SELECT image, image_mime FROM vehicles WHERE id = $1;`;
        const { rows } = await pool.query(query, [id]);

        if (rows.length === 0 || !rows[0].image) {
            return res.status(404).json({ error: "Image not found" });
        }

        const { image, image_mime } = rows[0];

        res.set("Content-Type", image_mime || "image/jpeg");
        res.set("Cache-Control", "public, max-age=86400");
        return res.send(image);
    } catch (err) {
        console.error("vehicle-image error:", err);
        return res.status(500).json({ error: err.message });
    }
}
