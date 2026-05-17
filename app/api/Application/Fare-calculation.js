import { pool } from "../db.js";

export default async function Farecalculation(req, res) {
    console.log("This is the fare calculation request : ",req.query)
  const { source, destination, seatsbooking, capacity } = req.query;
  console.log("Calculating fare", source, destination, seatsbooking, capacity);
  var dbquery =
    "SELECT one_way_rate, perseatrate from Fares where source = $1 AND destination = $2 AND capacity =$3";
  const result = await pool.query(dbquery, [
    source,
    destination,
    capacity,
  ]);
  if (result.rowCount > 0) {
    console.log("Got in first atttempt");
    if (seatsbooking === "true") {
      return res.status(200)/json({
        ok: true,
        seatbooking : true,
        rate: result.rows[0]["perseatrate"],
      });
    } else {
      return res.status(200).json({
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
      destination,
      source,
      capacity,
    ]);
    if (result2.rowCount > 0) {
      console.log("Got in second attempt");
      if (seatsbooking == "true") {
        return res.status(200).json({
          ok: true,
          seatbooking  : true,
          rate: result2.rows[0]["perseatrate"],
        });
      } else {
        return res.status(200).json({
          ok: true,
          message: "done",
          rate: result2.rows[0]["one_way_rate"],
        });
      }
    } else {
      console.log("Db issue")
      res.status(401).json({
        ok: false,
        rate: 0,
        message: "DB ISSUE",
      });
    }
  }
}
