import twilio from "twilio"
 export async  function sendwhatsappmessage(message) {
  try {
    const url = "https://graph.facebook.com/v22.0/1002885042911881/messages";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": "EAAULjaWRZC1wBQZB69ESXrHieMKkgjHlNZCzsaPo4XgrS0huGZAZBUW1Cp2LTLr2ZAY4d2fI11ZAh3CCpd3ZCF3ctFTX4uMQoHqmU9w33xJ1Qgi24ARXHRTapeAAzvLrQv02rjZChlZC0E7JxR9ivSt0BknZCPUKgErRpEZC8Illd3ZAOsqWd5Je9fRrKe4RihWtL8EaoNQvQb1at1WIcTQFTGBhqYk2pavjGaxX1cxGMM3hDZAFuIMxl1h29okZC7QxonnnWFqjtawYwezRgQvDtNr2XcKMQ9z",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: "+919529766334",
        type: "text",
        template: {
          name: "hello_world",
          language: { code: "en_US" }
        }
      })
    });
    const result =await  response.json()

    console.log(result)
  } catch (e) {
    console.log(e)
    throw e
  }
}
export async function sendsmsmessage(message) {
try {

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
  var combinedmessage = `Mhasla Wheels\n` + message

  const message2 = await client.messages.create({
    body: combinedmessage,
    from: "+13602268167",
    to: "+919529766334",
  });

  console.log(message2);
  console.log("message sent.")
} catch (e) {
  console.log(e)
  throw e
}
}
