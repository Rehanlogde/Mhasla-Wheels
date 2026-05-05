// test-db.js
import { pool } from "./db.js";

const test = async () => {
  const res = await pool.query("SELECT COUNT(*) FROM bookings");
  console.log("Bookings count:", res.rows[0].count);
  process.exit(0);
};

test();
