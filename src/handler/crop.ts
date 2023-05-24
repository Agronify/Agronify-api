import { Request, ResponseToolkit } from "@hapi/hapi";
import { prisma } from "..";
export default class Crop {
  public static async get(request: Request, response: ResponseToolkit) {
    const { id } = request.params as any;
    let res;
    if (id) {
      res = await prisma.crop.findUnique({
        where: {
          id: parseInt(id),
        },
      });
      return res;
    }
    const { search } = request.query as any;
    if (search) {
      res = await prisma.crop.findMany({
        where: {
          OR: [
            {
              name: {
                search: search,
              },
            },
          ],
        },
      });
      return res;
    }
    res = prisma.crop.findMany();
    return res;
  }

  public static async post(request: Request, response: ResponseToolkit) {
    const { name, type, description, image, is_fruit } = request.payload as any;
    const res = await prisma.crop.create({
      data: {
        name,
        type,
        description,
        image,
        is_fruit,
      },
    });
    return res;
  }

  public static async put(request: Request, response: ResponseToolkit) {
    const { id } = request.params as any;
    const { name, type, description, image, is_fruit } = request.payload as any;
    const res = await prisma.crop.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
        description,
        image,
        type,
        is_fruit,
      },
    });
    return res;
  }

  public static async delete(request: Request, response: ResponseToolkit) {
    const { id } = request.params as any;
    const res = await prisma.crop.delete({
      where: {
        id: parseInt(id),
      },
    });
    return res;
  }
}
