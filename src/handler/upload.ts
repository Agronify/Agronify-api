import { ReqRefDefaults, Request, ResponseToolkit } from "@hapi/hapi";
import * as fs from "fs";
import mv from "mv";
export default class Upload {
    public static async upload(request: Request, response: ResponseToolkit) {
        const { file } = request.payload as any;
        const filename = `${Date.now()}-${file.filename}`;
        const path = `./uploads/${filename}`;
        await mv(file.path, path, (err) => {console.error(err)});
        return response.response({ file: filename});
    }
    public static async get(request: Request, response: ResponseToolkit) {
        const { path } = request.params as any;
        const file = fs.readFileSync(`./uploads/${path}`);
        return response.response(file).type("image/png");   
    }
}
