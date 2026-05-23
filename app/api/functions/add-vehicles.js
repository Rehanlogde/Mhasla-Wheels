import {pool} from "../db.js"
import { mkdir, writeFile } from "fs/promises"
import path from "path"

export default async function Addvehiclesn(req,res) {


 try{
    const {vehicleid, vechiclename, vehiclesafety, capacity, year, priceperkm, imagename} = req.body
    const uploadedFile = req.file

    
    console.log("got these values : ", vehicleid)

    const imageBasePath = process.env.FLEET_IMG_PATH
    if (!imageBasePath) {
        throw new Error("FINAL_IMG_PATH is not configured")
    }

    if (!uploadedFile) {
        throw new Error("Image data is missing")
    }

    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"]
    if (!allowedMimeTypes.includes(uploadedFile.mimetype)) {
        throw new Error("Unsupported image type")
    }

    const safeImageName = (imagename || uploadedFile.originalname || "vehicle-image").replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")
    const finalpath = path.join(imageBasePath, safeImageName)

    const imageBuffer = uploadedFile.buffer

    if (!imageBuffer.length) {
        throw new Error("Invalid image data")
    }

    await mkdir(path.dirname(finalpath), { recursive: true })
    await writeFile(finalpath, imageBuffer)

    const dbquery = "INSERT INTO mw_vehicles VALUES($1,$2,$3,$4,$5,$6,$7,$8)"
    const finalpath2 = process.env.DBSAVINGPATH + safeImageName
    await pool.query(dbquery, [vehicleid, vechiclename, vehiclesafety, capacity, year, priceperkm, safeImageName, finalpath])

    return res.json({
        ok : true,
        message : `Successfully added vehcile ${vechiclename}`
    })
    }
    catch(err){
        console.log("this error occurred : ", err)
        return  res.json({
            ok :false,
            message : "Error occurred"
        });
    }
}