import { ReqRefDefaults, Request, ResponseToolkit } from "@hapi/hapi";
import * as fs from "fs";
import { Storage } from "@google-cloud/storage";

export default class Upload {
    private static storage = new Storage({keyFilename: "./google-cloud-key.json"});
    private static bucket = Upload.storage.bucket("agronify_bucket");
    public static async upload(request: Request, response: ResponseToolkit) {
        const { file } = request.payload as any;
        const filename = `${Date.now()}-${file.filename}`;
        const blob = Upload.bucket.file("images/knowledge/"+filename);
        const fileStream = fs.readFileSync(file.path);
        const blobStream = blob.createWriteStream({
            resumable: false
        });
        let done = false;
        let error = false;
        blobStream.on("finish", () => {
            done = true;
            blob.makePublic();
        });
        blobStream.on("error", (err) => {
            done = true;
            error = true;
            console.log(err);
        });
        blobStream.end(Buffer.from(fileStream));
        while(!done) {
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
        
        return response.response(error ? {error: "Error uploading file"} : {image: blob.publicUrl()});
    }
    public static async get(request: Request, response: ResponseToolkit) {
        const { path } = request.params as any;
        const file = fs.readFileSync(`./uploads/${path}`);
        return response.response(file).type("image/png");   
    }
}
