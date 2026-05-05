import { pool } from "../db.js"

export default async function CouponCodeverification(req,res) {
    const {couponcode} = req.body
console.log(couponcode)
    if (couponcode!=null) {
        
        const dbquery = "select * from loyalty_program where uniqueid = $1"
        const result  = await pool.query(dbquery, [couponcode])

        if (result.rowCount > 0) {
            
            return  res.json({
                ok  : true,
                deductionamount : result.rows[0]['amount'],
                message : 'Coupon code applied'
            });
    
    }
        else{
            return  res.json({
                ok :false,
                message : 'Invalid coupon code ! Check your coupons first'
            });
        }
    }
}