function discount_calculation(rate_per_km, kilometers) {
    var finalprice = rate_per_km*kilometers
    console.log("the calculated price is : ", finalprice)
    coupon_generation(finalprice)
}
function coupon_generation(discountedprice) {
    var discountedprice =  kilometers * (discountedprice/100)
    console.log("the discounttedprice is : ", discountedprice)    
}