import { ReqRefDefaults, Request, ResponseToolkit } from "@hapi/hapi";
import * as fs from "fs";
import { Storage } from "@google-cloud/storage";
import { bucket } from "..";

export default class Upload {
    public static async upload(request: Request, response: ResponseToolkit) {
        const { file, folder } = request.payload as any;
        const filename = `${Date.now()}-${file.filename}`;
        const fullpath = folder+filename;
        const blob = bucket.file(fullpath);
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
            await new Promise((resolve) => setTimeout(resolve, 10));
        }
        
        return response.response(error ? {error: "Error uploading file"} : {
            path: fullpath,
            url: `https://storage.googleapis.com/${bucket.name}/${fullpath}`
        });
    }
}
