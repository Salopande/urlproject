import { supabase } from "./superbase";
import { UAParser } from "ua-parser-js";

export async function getClicksfromurl(urlIds) {
    const {data,error} = await supabase.from("clicks").select("*").in("url_id", urlIds);
    if(error){
        console.error(error.message)
        throw new Error("Unable to load clicks")
    }
    return data
}

const parser = new UAParser();

export const storeClicks = async({id, original_url}) =>{
    try{
        const res = parser.getResult()
        const device = res.type || "desktop";
        const response = await fetch("https://ipapi.co/json");
        const {city, country_name:country} = await response.json();

        await supabase.from("clicks").insert({
            url_id:id,
            city:city,
            country:country,
            device:device
        })
        window.location.href = original_url
    }catch(error){
        console.error("Error recording clicks:", error)
    }
}