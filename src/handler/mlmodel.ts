import { Request, ResponseToolkit } from "@hapi/hapi";
import { bucket, prisma } from "..";
import extract from "extract-zip";
import * as fs from "fs";
import { resolve } from "path";
import { ModelUtils } from "../utils/model";
export default class MLModel {
  public static async get(request: Request, response: ResponseToolkit) {
    const { id } = request.params as any;
    let res;
    if (id) {
      res = await prisma.mLModel.findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
          crop: true,
        },
      });
      return res;
    }
    res = prisma.mLModel.findMany({
      include: {
        crop: true,
      },
    });
    return res;
  }

  public static async post(request: Request, response: ResponseToolkit) {
    const { name, type, file, active, crop_id } = request.payload as any;
    let res = await prisma.mLModel.create({
      data: {
        name,
        type,
        file,
        active,
        crop: {
          connect: {
            id: parseInt(crop_id),
          },
        },
      },
    });

    if (active) {
      await prisma.mLModel.updateMany({
        where: {
          crop_id: parseInt(crop_id),
          id: {
            not: res.id,
          },
        },
        data: {
          active: false,
        },
      });
    }

    await ModelUtils.downloadModel(file, type, crop_id, res.id, active);
    await ModelUtils.updateModelInfo(file, type, crop_id, res.id);
    res = (await prisma.mLModel.findUnique({
      where: {
        id: res.id,
      },
    }))!;
    return res;
  }

  public static async put(request: Request, response: ResponseToolkit) {
    const { id } = request.params as any;
    const { name, type, file, active, crop_id } = request.payload as any;
    let res = await prisma.mLModel.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
        type,
        file,
        active,
      },
    });
    if (active) {
      try {
        await prisma.mLModel.updateMany({
          where: {
            crop_id: parseInt(crop_id),
            id: {
              not: res.id,
            },
          },
          data: {
            active: false,
          },
        });
      } catch (error) {}
    }
    await ModelUtils.downloadModel(
      res.file,
      res.type,
      res.crop_id,
      res.id,
      active
    );
    await ModelUtils.updateModelInfo(res.file, res.type, res.crop_id, res.id);
    res = (await prisma.mLModel.findUnique({
      where: {
        id: res.id,
      },
      include: {
        crop: true,
      },
    }))!;
    return res;
  }

  public static async delete(request: Request, response: ResponseToolkit) {
    const { id } = request.params as any;
    const mlmodel = await prisma.mLModel.findFirst({
      where: {
        AND: [
          {
            id: parseInt(id),
          },
          {
            active: false,
          },
        ],
      },
    });
    if (!mlmodel) {
      return { error: "Cannot delete active model" };
    }
    const res = await prisma.mLModel.delete({
      where: {
        id: mlmodel?.id,
      },
    });
    return res;
  }
}
