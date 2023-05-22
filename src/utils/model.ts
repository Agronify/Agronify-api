import { bucket, prisma } from "..";
import extract from "extract-zip";
import { resolve } from "path";
import fs from "fs";
import { exec } from "child_process";
import * as tf from "@tensorflow/tfjs-node";
export class ModelUtils {
  public static async downloadModel(
    file: string,
    type: string,
    crop_id: number,
    model_id: number,
    active: boolean
  ) {
    try {
      const tmp_name = `${Date.now()}-model.h5`;
      let dir = resolve(`./models/${type}/${crop_id}/${model_id}`);
      try {
        fs.unlinkSync(dir);
      } catch (error) {}
      let extracted = false;
      bucket
        .file(file)
        .download({ destination: tmp_name }, async function (err) {
          exec(
            "tensorflowjs_converter --input_format=keras " +
              tmp_name +
              " " +
              dir
          );
        });
      while (!extracted) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (fs.existsSync(dir)) {
          extracted = true;
          fs.unlinkSync(tmp_name);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  public static async updateModelInfo(
    file: string,
    type: string,
    crop_id: number,
    model_id: number
  ) {
    let dir = `./models/${type}/${crop_id}/${model_id}/model.json`;
    const model = await tf.loadLayersModel(tf.io.fileSystem(dir));
    const inputHeight = model.getLayer(undefined, 0).batchInputShape[1];
    const inputWidth = model.getLayer(undefined, 0).batchInputShape[2];
    const layerAmount = model.layers.length;
    const classAmount = model.getLayer(undefined, layerAmount - 1).getConfig()
      .units as number;
    const modelInfo = {
      inputHeight,
      inputWidth,
      classAmount,
    };
    await prisma.mLModel.update({
      where: {
        id: model_id,
      },
      data: modelInfo,
    });
  }
}
