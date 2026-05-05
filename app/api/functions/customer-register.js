// api/functions/customer-register.js
import { pool } from "../db.js";
import bcrypt from "bcrypt";
import { sendmail, sendmailtoadmin } from "./mailfunctions.js";
 
export async function handler(event) {
    console.log("Registering ...")
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ ok: false, error: "Method Not Allowed" }),
        };
    }

    try {
        const { name, email, password, phone } = JSON.parse(event.body || "{}");

        // Validate required fields
        if (!name || !email || !password) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    ok: false,
                    error: "Name, email, and password are required",
                }),
            };
        }

        // Check if email already exists
        const existingCheck = await pool.query(
            "SELECT id FROM customers WHERE email = $1",
            [email.toLowerCase()]
        );

        if (existingCheck.rows.length > 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    ok: false,
                    error: "Email already registered",
                }),
            };
        }

        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        // Insert customer
        const query = `
      INSERT INTO customers (name, email, password_hash, phone, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING id, name, email;
    `;
        const values = [name, email.toLowerCase(), password_hash, phone || null];
        const { rows } = await pool.query(query, values);

        await sendmail("Welcome to Mhasla Wheels!", email.toLowerCase(), `
            <h2 style="color:#dc2626; margin:0 0 10px;">Welcome aboard, ${name}! 🎉</h2>
            <p style="color:#ccc; font-size:15px; line-height:1.7;">
              We're thrilled to have you join the <strong style="color:#fff;">Mhasla Wheels</strong> family! Your account has been created successfully and you're all set to book premium rides at your convenience.
            </p>
            <table style="width:100%; margin:20px 0; border-collapse:collapse;">
              <tr>
                <td style="padding:10px 14px; border:1px solid #333; color:#999; font-size:13px;">Name</td>
                <td style="padding:10px 14px; border:1px solid #333; color:#fff; font-size:13px;">${name}</td>
              </tr>
              <tr>
                <td style="padding:10px 14px; border:1px solid #333; color:#999; font-size:13px;">Email</td>
                <td style="padding:10px 14px; border:1px solid #333; color:#fff; font-size:13px;">${email.toLowerCase()}</td>
              </tr>
              <tr>
                <td style="padding:10px 14px; border:1px solid #333; color:#999; font-size:13px;">Phone</td>
                <td style="padding:10px 14px; border:1px solid #333; color:#fff; font-size:13px;">${phone || "Not provided"}</td>
              </tr>
            </table>
            <p style="color:#ccc; font-size:14px; line-height:1.6;">
              You can now log in and explore our fleet, book rides, and enjoy a seamless travel experience. If you ever need help, we're just a message away.
            </p>
            <p style="color:#999; font-size:13px; margin-top:16px;">
              Ride safe, ride in style. 🚗<br/>
              <strong style="color:#dc2626;">— Team Mhasla Wheels</strong>
            </p>
        `)
        await sendmailtoadmin("New Customer Registration", `
            <h2 style="color:#dc2626; margin:0 0 10px;">New Customer Registered</h2>
            <p style="color:#ccc; font-size:14px; line-height:1.6;">
              A new customer has successfully registered on the platform. Below are the details:
            </p>
            <table style="width:100%; margin:16px 0; border-collapse:collapse;">
              <tr>
                <td style="padding:10px 14px; border:1px solid #333; color:#999; font-size:13px; width:120px;">Name</td>
                <td style="padding:10px 14px; border:1px solid #333; color:#fff; font-size:13px;">${name}</td>
              </tr>
              <tr>
                <td style="padding:10px 14px; border:1px solid #333; color:#999; font-size:13px;">Email</td>
                <td style="padding:10px 14px; border:1px solid #333; color:#fff; font-size:13px;">${email.toLowerCase()}</td>
              </tr>
              <tr>
                <td style="padding:10px 14px; border:1px solid #333; color:#999; font-size:13px;">Phone</td>
                <td style="padding:10px 14px; border:1px solid #333; color:#fff; font-size:13px;">${phone || "N/A"}</td>
              </tr>
              <tr>
                <td style="padding:10px 14px; border:1px solid #333; color:#999; font-size:13px;">Customer ID</td>
                <td style="padding:10px 14px; border:1px solid #333; color:#fff; font-size:13px;">${rows[0].id}</td>
              </tr>
              <tr>
                <td style="padding:10px 14px; border:1px solid #333; color:#999; font-size:13px;">Registered At</td>
                <td style="padding:10px 14px; border:1px solid #333; color:#fff; font-size:13px;">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</td>
              </tr>
            </table>
            <p style="color:#999; font-size:13px;">
              This is an automated notification. No action is required unless follow-up is needed.
            </p>
        `)
        return {    
            statusCode: 200,
            body: JSON.stringify({
                ok: true,
                message: "Registration successful",
                customer: rows[0],
            }),
        };
    } catch (err) {
        console.error("❌ customer-register error:", err);
        console.log(("customer-registration failed", err))
        return {
            statusCode: 500,
            body: JSON.stringify({ ok: false, error: err.message }),
        };
    }
}
