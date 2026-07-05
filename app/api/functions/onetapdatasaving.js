import { pool } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default async function Savingonetapsignup(req,res) {
  try {
    const datareceived = req.body.userdata;
    const email = datareceived?.email?.toLowerCase?.();
    const name = datareceived?.name || datareceived?.given_name || "Google User";

    if (!email) {
      return res.status(400).json({
        status: false,
        message: "Google account email was not received.",
      });
    }

    let customer;
    const existingCustomer = await pool.query(
      "SELECT id, name, email, phone FROM customers WHERE email = $1",
      [email]
    );

    if (existingCustomer.rows.length > 0) {
      customer = existingCustomer.rows[0];
    } else {
      const password = process.env.googleusersdefaultpassword || "googleuser";
      const saltRounds = 10;
      const hashedpass = await bcrypt.hash(password, saltRounds);
      const insertQuery = `
        INSERT INTO customers(name, email, password_hash)
        VALUES($1, $2, $3)
        RETURNING id, name, email, phone
      `;

      const insertedCustomer = await pool.query(insertQuery, [name, email, hashedpass]);
      customer = insertedCustomer.rows[0];
    }

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

    return res.status(200).json({
      status: true,
      message: "Google sign in successful.",
      token,
      customer,
    });
  } catch (e) {
    console.log("error caused : ", e);
    return res.status(500).json({
      status: false,
      message: "could not let u in...",
    });
  }
}
