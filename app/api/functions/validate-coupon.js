// /opt/mhasla/app/api/functions/validate-coupon.js
import { pool } from "../db.js";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    const { code } = JSON.parse(event.body || "{}");
    if (!code) {
      return {
        statusCode: 400,
        body: JSON.stringify({ ok: false, message: "Coupon code required" }),
      };
    }

    const couponCode = code.trim().toUpperCase();

    // 🟢 Query local database
    const query = `SELECT * FROM coupons WHERE UPPER(code) = $1 LIMIT 1; `;
    const { rows } = await pool.query(query, [couponCode]);
    const coupon = rows[0];

    if (!coupon) {
      return {
        statusCode: 200,
        body: JSON.stringify({ ok: false, message: "Invalid coupon" }),
      };
    }

    // 🧩 Validation checks
    const now = new Date();

    // If your schema doesn't have an "active" column, you can safely comment this out
    if ("active" in coupon && !coupon.active) {
      return {
        statusCode: 200,
        body: JSON.stringify({ ok: false, message: "Coupon is inactive" }),
      };
    }

    if (coupon.valid_from && new Date(coupon.valid_from) > now) {
      return {
        statusCode: 200,
        body: JSON.stringify({ ok: false, message: "Coupon not valid yet" }),
      };
    }

    if (coupon.valid_to && new Date(coupon.valid_to) < now) {
      return {
        statusCode: 200,
        body: JSON.stringify({ ok: false, message: "Coupon expired" }),
      };
    }

    if (coupon.usage_limit && coupon.uses_count >= coupon.usage_limit) {
      return {
        statusCode: 200,
        body: JSON.stringify({ ok: false, message: "Coupon usage limit reached" }),
      };
    }

    // ✅ Build discount response
    const discount = coupon.discount_flat
      ? { type: "flat", value: coupon.discount_flat }
      : { type: "percent", value: coupon.discount_percent };

    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        message: "Coupon applied successfully",
        discount,
      }),
    };
  } catch (err) {
    console.error("validate-coupon error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, message: err.message }),
    };
  }
}
