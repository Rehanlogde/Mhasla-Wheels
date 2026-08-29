import { pool } from "../db.js";

export default async function Getplacenames(req, res) {
    try {
        const dbquery = "SELECT * FROM fares";

        const result = await pool.query(dbquery);

        if (result.rowCount > 0) {

            console.log("THIS IS PRINTING ROWS");
            console.log(result.rows);

            // Set automatically removes duplicate place names
            const finaldata = new Set();

            console.log("PLACES");

            for (const element of result.rows) {

                console.log("printing element");
                console.log(element);

                // Add source and destination
                finaldata.add(element.source);
                finaldata.add(element.destination);
            }

            // Convert Set to Array
            const places = [...finaldata];

            console.log("PRINTING FINAL DATA");
            console.log("Final data passing", places);
            console.log(places);

            return res.status(200).json({
                ok: true,
                data: places
            });
        }

        else {
            return res.status(401).json({
                ok: false,
                message: "Internal server error"
            });
        }

    } catch (e) {

        console.error(e);

        return res.status(500).json({
            ok: false,
            message: "Internal server error"
        });
    }
}