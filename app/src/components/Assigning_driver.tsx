import { useEffect, useState } from "react";

export default function Assignment_driver(props) {
    const [bookingdata, setbookingdata] = useState([])
    const [driversdata, setdriversdata] = useState([])

    useEffect(()=>{
        getdriversdata()
        setbookingsdata()

    },[])
    const getdriversdata = async ()=> {

    }
    const setbookingsdata = async () => {
    }
}