import * as tf from "@tensorflow/tfjs-node";
import * as fs from "fs";
import { bucket, prisma } from "..";
import { MLModel } from "@prisma/client";
import { ModelUtils } from "../utils/model";
import sharp from "sharp";
export default class PredictService {
  private path: string;
  private type: string;
  private name: string;
  private crop_id: number;
  private model: Promise<tf.LayersModel>;
  private mlModel: Promise<MLModel | null>;
  constructor(type: string, name: string, crop_id: number, path: string) {
    this.type = type;
    this.name = name;
    this.path = path;
    this.crop_id = crop_id;
    this.model = new Promise((resolve, reject) => {
      resolve(tf.sequential());
    });
    this.mlModel = prisma.mLModel.findFirst({
      where: {
        AND: [
          {
            crop_id: this.crop_id,
          },
          {
            active: true,
          },
        ],
      },
    });
  }

  public async init() {
    console.log("Init model predict");
    let dir = `./models/${this.type}/${this.crop_id}/${
      (await this.mlModel)?.id
    }/model.json`;
    if (!fs.existsSync(dir)) {
      await ModelUtils.downloadModel(
        (
          await this.mlModel
        )?.file!,
        this.type,
        this.crop_id,
        (
          await this.mlModel
        )?.id!,
        true
      );
    }
    try {
      const fileModel = tf.io.fileSystem(dir);
      this.model = tf.loadLayersModel(fileModel);
    } catch (error) {
      console.log(error);
    }
  }

  public async predict() {
    console.log(this.type);
    switch (this.type) {
      case "disease":
        return await this.disease();
      case "ripeness":
        return await this.ripeness();
      default:
        return null;
    }
  }

  public async disease() {
    console.log("Predict disease");
    const stream = await bucket.file(this.path).download();
    const mlModel = await this.mlModel;
    const model = await this.model;
    try {
      const inputHeight = model.getLayer(undefined, 0).batchInputShape[1];
      const inputWidth = model.getLayer(undefined, 0).batchInputShape[2];
      const bufferResize = await sharp(stream[0])
        .resize(inputHeight, inputWidth)
        .toBuffer();
      const tensor = tf.node
        .decodeImage(bufferResize, 3)
        .reshape([1, inputHeight!, inputWidth!, 3]);
      let prediction = model.predict(tensor) as tf.Tensor<tf.Rank>;
      const result = prediction.argMax(1).dataSync()[0];
      const confidence = prediction.max(1).dataSync()[0] * 100;
      const modelClasses = await prisma.modelClass.findMany({
        where: {
          AND: [
            {
              mlmodel_id: mlModel?.id,
            },
          ],
        },
        include: {
          disease: true,
        },
      });

      const classHealthy = modelClasses.find((modelClass) => {
        return modelClass.disease_id === null;
      });

      console.log(classHealthy?.index);

      return {
        path: this.path,
        result: result === classHealthy?.index ? "Healthy" : "Unhealthy",
        disease:
          modelClasses.find((modelClass) => {
            return modelClass.index === result;
          })?.disease_id === null
            ? undefined
            : modelClasses.find((modelClass) => {
                return modelClass.index === result;
              })?.disease,
        confidence: confidence,
      };
    } catch (error: any) {
      console.log(error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  public async ripeness() {
    return new Promise((resolve, reject) => {
      const time = Math.floor(Math.random() * 2000) + 1000;
      const result = Math.floor(Math.random() * 100) + 1;
      const confidence = Math.floor(Math.random() * 100) + 1;
      setTimeout(() => {
        resolve({
          path: this.path,
          result: result < 20 ? "unripe" : result > 80 ? "too ripe" : "ripe",
          confidence: confidence,
        });
      }, time);
    });
  }
}
