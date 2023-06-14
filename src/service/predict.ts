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
          {
            type: this.type,
          }
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
    const pathWithoutBucket = this.path.split("/").slice(1).join("/");
    const stream = await bucket.file(pathWithoutBucket).download();
    const mlModel = await this.mlModel;
    const model = await this.model;
    try {
      const inputHeight = model.getLayer(undefined, 0).batchInputShape[1];
      const inputWidth = model.getLayer(undefined, 0).batchInputShape[2];
      const bufferResize = await sharp(stream[0])
        .resize(inputHeight, inputWidth)
        .toBuffer();
      let tensor = tf.node
        .decodeImage(bufferResize, 3)
        .reshape([1, inputHeight!, inputWidth!, 3]);

      if (mlModel?.normalize) tensor = tensor.div(tf.scalar(255));

      let prediction = model.predict(tensor) as tf.Tensor<tf.Rank>;
      const result = prediction.argMax(1).dataSync()[0];
      const confidence = prediction.max(1).dataSync()[0] * 100;

      if (mlModel?.threshold && confidence < mlModel?.threshold) {
        return {
          path: this.path,
          result: "NOT DETECTED",
          disease: null,
          confidence: confidence,
        };
      }

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
    const pathWithoutBucket = this.path.split("/").slice(1).join("/");
    const stream = await bucket.file(pathWithoutBucket).download();
    const mlModel = await this.mlModel;
    const model = await this.model;
    try {
      const inputHeight = model.getLayer(undefined, 0).batchInputShape[1];
      const inputWidth = model.getLayer(undefined, 0).batchInputShape[2];
      const bufferResize = await sharp(stream[0])
        .resize(inputHeight, inputWidth)
        .toBuffer();
      let tensor = tf.node
        .decodeImage(bufferResize, 3)
        .reshape([1, inputHeight!, inputWidth!, 3]);

      if (mlModel?.normalize) tensor = tensor.div(tf.scalar(255));

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
        }
      });
      
      const mcResult = modelClasses.find((modelClass) => {
        return modelClass.index === result;
      });

      if (mlModel?.threshold && confidence < mlModel?.threshold) {
        return {
          path: this.path,
          result: "NOT DETECTED",
          confidence: confidence,
        };
      }

      return {
        path: this.path,
        result: mcResult?.ripe ? "RIPE" : "UNRIPE",
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
}
