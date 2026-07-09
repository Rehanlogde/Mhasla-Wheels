import { useEffect, useState } from "react";
import { Globe, MapPin, PencilLine, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type MetadataField = {
  key: string;
  label: string;
  placeholder: string;
  type?: "text" | "url" | "email";
  multiline?: boolean;
};

const metadataFields: MetadataField[] = [
  {
    key: "emailid",
    label: "Email ID",
    placeholder: "Enter email address",
    type: "email",
  },
  {
    key: "phone_number",
    label: "Phone Number",
    placeholder: "Enter phone number",
  },
  {
    key: "address",
    label: "Address",
    placeholder: "Enter full website or business address",
    multiline: true,
  },
  {
    key: "about_us",
    label: "About Us",
    placeholder: "Enter about us content",
    multiline: true,
  },
  {
    key: "our_story",
    label: "Our Story",
    placeholder: "Enter your story content",
    multiline: true,
  },
  {
    key: "our_mission",
    label: "Our Mission",
    placeholder: "Enter your mission content",
    multiline: true,
  },
];

export default function MetadataUpdation() {
  
  const [contactnumber, setcontactnumber] = useState(0)
  const [email, setemail] = useState(0)
  const [aboutus, setaboutus] = useState("")
  const [address, setaddress] = useState("")
  const [ourstory, setourstory] = useState("")
  const [ourmission, setourmission] = useState("")
  

  const getcontactnumber = async () => {
    try{
    const response = await fetch("/api/functions/getmetadata/phone_number", {
      method : 'GET'
    })
    const finalresponse = await response.json()
    if (response.status==200) {
      setcontactnumber(finalresponse['data'])
    }
    else{
      toast.error(finalresponse['message'])
    }  
    }
    catch(e)
    {
      toast.error("Unexpected error !")
    }
  }
  
  const getourmission = async () => {
    try{
    const response = await fetch("/api/functions/getmetadata/our_mission", {
      method : 'GET'
    })
    const finalresponse = await response.json()
    if (response.status==200) {
    setourmission(finalresponse['data'])
    }
    else{
      toast.error(finalresponse['message'])
    }  
    }
    catch(e)
    {
      toast.error("Unexpected error !")
    }
  }
  
  const getaboutus = async () => {
    try{
    const response = await fetch("/api/functions/getmetadata/about_us", {
      method : 'GET'
    })
    const finalresponse = await response.json()
    if (response.status==200) {
      setaboutus(finalresponse['data'])
    }
    else{
      toast.error(finalresponse['message'])
    }  
    }
    catch(e)
    {
      toast.error("Unexpected error !")
    }
  }
  
  const getemail = async () => {
    try{
    const response = await fetch("/api/functions/getmetadata/emailid", {
      method : 'GET'
    })
    const finalresponse = await response.json()
    if (response.status==200) {
    setemail(finalresponse['data'])
    }
    else{
      toast.error(finalresponse['message'])
    }  
    }
    catch(e)
    {
      toast.error("Unexpected error !")
    }
  }
  
  
  const getourstory = async () => {
    try{
    const response = await fetch("/api/functions/getmetadata/our_story", {
      method : 'GET'
    })
    const finalresponse = await response.json()
    if (response.status==200) {
      setourstory(finalresponse['data'])
    }
    else{
      toast.error(finalresponse['message'])
    }  
    }
    catch(e)
    {
      toast.error("Unexpected error !")
    }
  }

  const getaddress = async () => {
    try {
      const response = await fetch("/api/functions/getmetadata/address", {
        method: "GET",
      })
      const finalresponse = await response.json()
      if (response.status == 200) {
        setaddress(finalresponse["data"])
      }
      else{
        toast.error(finalresponse["message"])
      }
    }
    catch(e)
    {
      toast.error("Unexpected error !")
    }
  }
  const callallgetmethods = async () => {
    
   await getcontactnumber()
   await  getaboutus()
    await getourmission()
    await getourstory()
    await getemail()
    await getaddress()
  }
  
  useEffect(()=>{
    callallgetmethods()
    }, [])

  const getFieldValue = (key: string) => {
    switch (key) {
      case "phone_number":
        return String(contactnumber || "")
      case "emailid":
        return String(email || "")
      case "about_us":
        return aboutus
      case "address":
        return address
      case "our_story":
        return ourstory
      case "our_mission":
        return ourmission
      default:
        return ""
    }
  };

  const handleChange = (key: string, value: string) => {
    switch (key) {
      case "phone_number":
        setcontactnumber(Number(value))
        break
      case "emailid":
        setemail(value as any)
        break
      case "about_us":
        setaboutus(value)
        break
      case "address":
        setaddress(value)
        break
      case "our_story":
        setourstory(value)
        break
      case "our_mission":
        setourmission(value)
        break
      default:
        break
    }
  };

  const getUpdatedValue = (key: string) => {
    switch (key) {
      case "phone_number":
        return String(contactnumber || "")
      case "emailid":
        return String(email || "")
      case "about_us":
        return aboutus
      case "address":
        return address
      case "our_story":
        return ourstory
      case "our_mission":
        return ourmission
      default:
        return ""
    }
  };


  const updatedata = async (updatefieldname: string, updatedata: string) => {
    console.log(`updatefield name : ${updatefieldname}, updatedata : ${updatedata} `);

    
    const response = await fetch("/api/functions/updatemetadata", {
        headers : {
            'Content-type' :'application/json'
        },
        method : "PUT",
        body : JSON.stringify({
            whattoupdate : updatefieldname,
            data : updatedata
        })
    }); 

    const finalresponse = await response.json();

    if (response.status === 200) {
      toast.success(finalresponse["message"]);
      setTimeout(() => {
        window.location.reload();
      }, 1200);
      return;
    }

    toast.error(finalresponse["message"]);
  };

  return (
    <section className="mx-auto w-full max-w-5xl">
      <div className="overflow-hidden rounded-[28px] border border-red-950/70 bg-[#111111] shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        <div className="relative border-b border-gray-800 bg-[radial-gradient(circle_at_top_left,_rgba(220,38,38,0.18),_transparent_35%),linear-gradient(135deg,_rgba(24,24,27,0.98),_rgba(10,10,10,1))] px-6 py-7 sm:px-8">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.02),transparent)]" />
          <div className="relative flex justify-center">
            <div className="space-y-3 text-center">
             
              <div className="mx-auto text-center">
                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Update Metadata
                </h1>
                
              </div>
            </div>

          
          </div>
        </div>

        <div className="bg-[#0d0d0d] px-6 py-6 sm:px-8 sm:py-8">
          <div className="grid gap-5">
            {metadataFields.map((field, index) => {
              const InputTag = field.multiline ? "textarea" : "input";

              return (
                <div
                  key={field.key}
                  className={cn(
                    "group rounded-3xl border border-gray-800 bg-[linear-gradient(180deg,rgba(21,21,21,1),rgba(13,13,13,1))] p-5 transition-all duration-300 hover:border-red-600/40 hover:shadow-[0_0_0_1px_rgba(220,38,38,0.08)]",
                    index % 2 === 0 && "sm:translate-x-0"
                  )}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
                    <div className="min-w-0 flex-1">
                      <label
                        htmlFor={field.key}
                        className="mb-2 block text-sm font-semibold tracking-wide text-gray-200"
                      >
                        {field.label}
                      </label>

                      <InputTag
                        id={field.key}
                        value={getFieldValue(field.key)}
                        onChange={(event) => handleChange(field.key, event.target.value)}
                        placeholder={field.placeholder}
                        rows={field.multiline ? 4 : undefined}
                        type={field.multiline ? undefined : field.type || "text"}
                        className={cn(
                          "w-full rounded-2xl border border-gray-700 bg-[#181818] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
                          field.multiline && "min-h-[120px] resize-none pt-3"
                        )}
                      />
                    </div>

                    <Button
                      type="button"
                      variant="book"
                      onClick={async ()=>{
                        console.log(field.key)
                         console.log(getUpdatedValue(field.key));
                        
                        await updatedata(field.key, getUpdatedValue(field.key))
                      }}
                      className="h-12 min-w-[150px] rounded-2xl px-6 text-sm shadow-[0_12px_30px_rgba(220,38,38,0.2)]"
                    >
                      <Save className="h-4 w-4" />
                      Update
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
