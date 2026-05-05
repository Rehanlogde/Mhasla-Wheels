import * as nodemailer from 'nodemailer';
import {pool} from "../db.js"

const transporter = nodemailer.createTransport({
    service : 'gmail',
  auth: {
    user: "mhaslawheels@gmail.com",
    pass: process.env.EMAIL_APP_PASS2,
  },
});

export async function sendmail(subject, receiver, message) {

    console.log(receiver)
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:'Segoe UI',Arial,Helvetica,sans-serif;color:#e5e5e5;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;">
<tr><td align="center" style="padding:30px 10px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#111111;border:1px solid #2a2a2a;border-radius:12px;overflow:hidden;">

    <!-- Header -->
    <tr>
        <td style="background:linear-gradient(135deg,#1a0000 0%,#111111 50%,#1a0000 100%);padding:36px 30px 24px;text-align:center;border-bottom:2px solid #dc2626;">
            <h1 style="margin:0;font-size:32px;font-weight:800;color:#ffffff;letter-spacing:1px;text-transform:uppercase;">Mhasla Wheels</h1>
            <div style="width:80px;height:3px;background-color:#dc2626;margin:12px auto 0;border-radius:2px;"></div>
        </td>
    </tr>

    <!-- Body -->
    <tr>
        <td style="padding:32px 30px;">
            <div style="font-size:15px;line-height:1.7;color:#d4d4d4;">
                ${message}
            </div>
        </td>
    </tr>

    <!-- Divider -->
    <tr>
        <td style="padding:0 30px;">
            <div style="border-top:1px solid #2a2a2a;"></div>
        </td>
    </tr>

    <!-- Footer -->
    <tr>
        <td style="padding:28px 30px;background-color:#0d0d0d;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td align="center" style="padding-bottom:18px;">
                        <h2 style="margin:0;font-size:22px;font-weight:800;color:#dc2626;letter-spacing:0.5px;">&#128663; Mhasla Wheels</h2>
                        <p style="margin:4px 0 0;font-size:12px;color:#666;letter-spacing:2px;text-transform:uppercase;">Your Ride, Our Pride</p>
                    </td>
                </tr>
            </table>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#1a1a1a;border:1px solid #2a2a2a;border-radius:8px;overflow:hidden;">
                <tr>
                    <td style="padding:16px 20px;">
                        <h3 style="margin:0 0 12px;font-size:14px;font-weight:700;color:#dc2626;text-transform:uppercase;letter-spacing:1px;">Get in Touch</h3>
                        <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:13px;color:#a3a3a3;line-height:1.8;">
                            <tr>
                                <td style="padding-right:10px;color:#dc2626;">&#128100;</td>
                                <td style="font-weight:600;color:#e5e5e5;">Rehan Logde</td>
                            </tr>
                            <tr>
                                <td style="padding-right:10px;color:#dc2626;">&#128222;</td>
                                <td><a href="tel:9529766334" style="color:#d4d4d4;text-decoration:none;">9529766334</a></td>
                            </tr>
                            <tr>
                                <td style="padding-right:10px;color:#dc2626;">&#9993;</td>
                                <td><a href="mailto:wasim.wassu@gmail.com" style="color:#d4d4d4;text-decoration:none;">wasim.wassu@gmail.com</a></td>
                            </tr>
                            <tr>
                                <td style="padding-right:10px;color:#dc2626;">&#9993;</td>
                                <td><a href="mailto:rehanlogde863@gmail.com" style="color:#d4d4d4;text-decoration:none;">rehanlogde863@gmail.com</a></td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            <p style="margin:18px 0 0;text-align:center;font-size:11px;color:#525252;">&copy; 2026 Mhasla Wheels. All rights reserved.</p>
        </td>
    </tr>

</table>
</td></tr>
</table>
</body>
</html>`

const info = await transporter.sendMail({
    from: "rehan17641@gmail.com",
    to: receiver,
    subject: subject,
    html: html, 
  });
  
  console.log("message sent !")
  console.log("Message sent:", info.messageId);
}

export async function sendmailtoadmin(subject, message) {
    const dbquery = "select email from admins"
    const result = await pool.query(dbquery)
    if (result.rows.length >0) {
    
    for (const element of result.rows) {
        await sendmail(subject, element.email, message)
    }
}
else{
    console.log("emails are not sent")
}
}



export async function sendmailtosuperuser(subject, message) {
    const dbquery = "select email from superuser"
    const result = await pool.query(dbquery)
    if (result.rows.length >0) {

    for (const element of result.rows) {
        await sendmail(subject, element.email, message)
    }
}
else{
    console.log("emails are not sent")
}
}

