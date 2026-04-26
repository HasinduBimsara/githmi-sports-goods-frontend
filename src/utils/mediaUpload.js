import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
        "https://acfihbfmgdmhzxvboogf.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjZmloYmZtZ2RtaHp4dmJvb2dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5NDkwNTMsImV4cCI6MjA1OTUyNTA1M30.0IZo281Fay-e_LqHBJReXF59tUXNWcTFkWiGJPF-6Vc"
);

export default function mediaUpload(file){
    const promise = new Promise(
        (resolve,reject)=>{
            if(file == null){
                reject("No file selected")
            }
            const timeStamp = new Date().getTime()
            const newFileName = timeStamp+file.name

            supabase.storage.from("images").upload(newFileName, file, {
                cacheControl: "3600",
                upsert: false,
            }).then(
                ()=>{
                    const url = supabase.storage.from("images").getPublicUrl(newFileName).data.publicUrl
                    resolve(url)
                }
            ).catch(
                (error)=>{
                    console.log(error)
                    reject("File upload failed")
                }
            )
        }
    )

    return promise
}
