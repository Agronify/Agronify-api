import { ReqRefDefaults, Request, ResponseToolkit } from "@hapi/hapi";
import * as fs from "fs";
import { Storage } from "@google-cloud/storage";
import { bucket } from "..";
import * as stream from "stream";

export default class Upload {
  public static async upload(request: Request, response: ResponseToolkit) {
    const { file, type } = request.payload as any;

    console.log("cp1");
    const passThrough = new stream.PassThrough();
    passThrough.write(file._data);
    passThrough.end();

    if (!["predicts", "models", "images"].includes(type)) {
      return response.response({ error: "invalid type" });
    }
    const filename = `${Date.now()}-${file.hapi.filename}`;
    const fullpath = type + "/" + filename;
    const fileStream = bucket.file(fullpath);
    const blobStream = passThrough.pipe(fileStream.createWriteStream());

    let done = false;
    let error = false;
    blobStream.on("finish", () => {
      done = true;
      if (type !== "models") {
        fileStream.makePublic();
      }
    });
    blobStream.on("error", (err) => {
      done = true;
      error = true;
      console.log(err);
    });

    while (!done) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return response.response(
      error
        ? { error: "Error uploading file" }
        : {
            path: `${bucket.name}/${fullpath}`,
            url: `https://storage.googleapis.com/${bucket.name}/${fullpath}`,
          }
    );
  }
}
