import * as tf from "@tensorflow/tfjs-node";
import * as fs from "fs";
import { bucket, prisma } from "..";
import { MLModel } from "@prisma/client";
import { ModelUtils } from "../utils/model";
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
    let dir = `./models/${this.type}/${this.crop_id}/active/model.json`;
    if (!fs.existsSync(dir)) {
      await ModelUtils.downloadModel(
        (
          await this.mlModel
        )?.file!,
        this.type,
        this.crop_id
      );
    }
    const fileModel = tf.io.fileSystem(dir);
    this.model = tf.loadLayersModel(fileModel);
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
    const stream = await bucket.file(this.path).download();
    const mlModel = await this.mlModel;
    try {
      const tensor = tf.node
        .decodeImage(stream[0], 3)
        .reshape([1, 150, 150, 3]);
      const prediction = (await this.model).predict(
        tensor
      ) as tf.Tensor<tf.Rank>;
      const result = prediction.argMax(1).dataSync()[0];
      const confidence = prediction.max(1).dataSync()[0] * 100;
      const modelClass = await prisma.modelClass.findFirst({
        where: {
          AND: [
            {
              index: result,
            },
            {
              mlmodel_id: mlModel?.id,
            },
          ],
        },
        include: {
          disease: true,
        },
      });
      return {
        path: this.path,
        result:
          modelClass?.disease.name === "Healthy" ? "Healthy" : "unhealthy",
        disease:
          modelClass?.disease.name === "Healthy"
            ? undefined
            : modelClass?.disease,
        confidence: confidence,
      };
    } catch (error) {
      console.log(error);
    }
    return true;
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
