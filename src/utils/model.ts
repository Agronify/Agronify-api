import { bucket } from "..";
import extract from "extract-zip";
import { resolve } from "path";
import fs from "fs";
export class ModelUtils{
    public static async downloadModel(file: string, type: string, crop_id: number) {
        const tmp_name = `${Date.now()}-model.zip`;
        let dir = resolve(`./models/${type}/${crop_id}/active/`);
        let extracted = false;
        bucket.file(file).download({destination: tmp_name}, async function(err) {
            await extract("./"+tmp_name, {dir: resolve(`./models/${type}/${crop_id}/active/`)});
            fs.unlinkSync(tmp_name);
        });
        while (!extracted) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (fs.existsSync(dir)) {
                extracted = true;
            }
        }
    }
}