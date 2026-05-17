// api/functions/customer-login.js
import { pool } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function appLogin(event) {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ ok: false, error: "Method Not Allowed" }),
        };
    }

    try {
        console.log("Verifying the login from application")
        const { email, password } = JSON.parse(event.body || "{}");
console.log(email, password)
        if (!email || !password) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    ok: false,
                    error: "Email and password are required",
                }),
            };
        }

        // Find customer by email
        const query = `
      SELECT id, name, email, password_hash, phone
      FROM customers
      WHERE email = $1;
    `;
        const { rows } = await pool.query(query, [email.toLowerCase()]);

        if (rows.length === 0) {
            return {
                statusCode: 401,
                body: JSON.stringify({
                    ok: false,
                    error: "Invalid email or password",
                }),
            };
        }

        const customer = rows[0];

        // Compare password
        const isValid = await bcrypt.compare(password, customer.password_hash);

        if (!isValid) {
            return {
                statusCode: 401,
                body: JSON.stringify({
                    ok: false,
                    error: "Invalid email or password",
                }),
            };
        }

        // Generate JWT
        const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_change_me";
        const token = jwt.sign(
            {
                id: customer.id,
              email: customer.email,
                name: customer.name,  
            },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        return {
            statusCode: 200,
            body: JSON.stringify({
                ok: true,
                token,
                customer: {
                    id: customer.id,
                    name: customer.name,
                    email: customer.email,
                    phone: customer.phone,
                },
            }),
        };
    } catch (err) {
        console.error("❌ customer-login error:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ ok: false, error: err.message }),
        };
    }
}

export const handler = appLogin;
export default appLogin;
