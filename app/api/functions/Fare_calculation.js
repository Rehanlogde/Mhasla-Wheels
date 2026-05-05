import { pool } from "../db.js";

export default async function Calculatefare(req, res) {
  const { source, destination, seatsbooking, capacity } = req.body;
  console.log("Calculating fare", source, destination, seatsbooking, capacity);
  var dbquery =
    "SELECT one_way_rate, perseatrate from Fares where source = $1 AND destination = $2 AND capacity =$3";
  const result = await pool.query(dbquery, [
    source.toLowerCase(),
    destination.toLowerCase(),
    capacity,
  ]);
  if (result.rowCount > 0) {
    console.log("Got in first atttempt");
    if (seatsbooking) {
      return res.json({
        ok: true,
        seatbooking : true,
        rate: result.rows[0]["perseatrate"],
      });
    } else {
      return res.json({
        ok: true,
        message: "done",
        rate: result.rows[0]["one_way_rate"],
      });
    }
  } else {
    console.log("Trying for second attempt", destination, source)
    var dbquery =
      "SELECT one_way_rate, perseatrate from Fares where source = $1 AND destination = $2 AND capacity = $3";
    const result2 = await pool.query(dbquery, [
      destination.toLowerCase(),
      source.toLowerCase(),
      capacity,
    ]);
    if (result2.rowCount > 0) {
      console.log("Got in second attempt");
      if (seatsbooking) {
        return res.json({
          ok: true,
          seatbooking  : true,
          rate: result2.rows[0]["perseatrate"],
        });
      } else {
        return res.json({
          ok: true,
          message: "done",
          rate: result2.rows[0]["one_way_rate"],
        });
      }
    } else {
      console.log("Db issue")
      res.json({
        ok: false,
        rate: 0,
        message: "DB ISSUE",
      });
    }
  }
}
