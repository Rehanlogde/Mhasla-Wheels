import { sendmail } from "./mailfunctions.js";

export default async function Mailtosomeone(req, res) {
    const { recipient, message } = req.body;
    const subject = "Message from Mhasla Wheels Admin";

    if (recipient && message) {
        
        await sendmail(subject, recipient, message);
        return res.json({
            ok: true,
            message: "Mail sent successfully!"
        });
    } else {
        return res.json({
            ok: false,
            message: "Fill the details correctly"
        });
    }
}