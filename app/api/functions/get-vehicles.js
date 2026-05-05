import { pool } from "../db.js";

export default async function getVehicles(req, res) {
  try {
    const query = `
      SELECT *
      FROM mw_vehicles`;

    const { rows } = await pool.query(query);
    console.log("This is the fleet you currently have : ", rows)
    res.status(200).json({
      ok: true,
      messaage : "got vehicles",
      vehiclesdata: rows,
    });
  } catch (err) {
    console.error("get-vehicles error:", err);
    res.status(500).json({
      ok: false,
      message: err.message,
    });
  }
}
