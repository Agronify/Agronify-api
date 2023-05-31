import { Request, ResponseToolkit } from "@hapi/hapi";
import { prisma } from "..";
import { Prisma } from "@prisma/client";

export class ModelClass {
  public static async get(request: Request, response: ResponseToolkit) {
    const { id, mlmodel_id } = request.params as any;
    let res;
    if (id) {
      res = await prisma.modelClass.findFirst({
        where: {
          AND: [
            {
              id: parseInt(id),
            },
            {
              mlmodel_id: parseInt(mlmodel_id),
            },
          ],
        },
        include: {
          disease: true,
        },
      });
      return res;
    }
    res = prisma.modelClass.findMany({
      where: {
        mlmodel_id: parseInt(mlmodel_id),
      },
      include: {
        disease: true,
      },
    });
    return res;
  }

  public static async post(request: Request, response: ResponseToolkit) {
    const { disease_id, index } = request.payload as any;
    const { mlmodel_id } = request.params as any;
    const model = await prisma.mLModel.findUnique({
      where: {
        id: parseInt(mlmodel_id),
      },
    });
    if (model && parseInt(index) >= model?.classAmount!) {
      return {
        error: "Index out of range",
      };
    }
    const res = await prisma.modelClass.create({
      data: {
        index,
        mlmodel: {
          connect: {
            id: parseInt(mlmodel_id),
          },
        },
        disease:
          disease_id > 0
            ? {
                connect: {
                  id: parseInt(disease_id),
                },
              }
            : undefined,
      },
    });
    return res;
  }

  public static async put(request: Request, response: ResponseToolkit) {
    const { disease_id, index } = request.payload as any;
    const { mlmodel_id, id } = request.params as any;
    const model = await prisma.mLModel.findUnique({
      where: {
        id: parseInt(mlmodel_id),
      },
    });
    if (model && parseInt(index) >= model?.classAmount!) {
      return {
        error: "Index out of range",
      };
    }
    const res = await prisma.modelClass.update({
      where: {
        id: parseInt(id),
      },
      data: {
        index,
        disease:
          disease_id > 0
            ? {
                connect: {
                  id: parseInt(disease_id),
                },
              }
            : undefined,
      },
    });

    if (disease_id <= 0) {
      const sql = Prisma.sql([
        `UPDATE "public"."ModelClass" SET disease_id = NULL WHERE id = ${id};`,
      ]);
      await prisma.$executeRaw(sql);
    }

    return res;
  }

  public static async delete(request: Request, response: ResponseToolkit) {
    const { id } = request.params as any;
    const res = await prisma.modelClass.delete({
      where: {
        id: parseInt(id),
      },
    });
    return res;
  }
}
