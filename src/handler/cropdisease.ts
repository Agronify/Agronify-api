import { Request, ResponseToolkit } from "@hapi/hapi";
import { prisma } from "..";
export default class CropDisease {
    public static async get(request: Request, response: ResponseToolkit) {
        const { id } = request.params as any;
        let res;
        if (id) {
            res = await prisma.cropDisease.findUnique({
                where: {
                    id: parseInt(id)
                }
            });
            return res;
        }
        const { search } = request.query as any;
        if (search) {
            res = await prisma.cropDisease.findMany({
                where: {
                    OR: [
                        {
                            name: {
                                search: search
                            }
                        }
                    ]
                }
            });
            return res;
        }
        res = prisma.cropDisease.findMany();
        return res;
    }

    public static async post(request: Request, response: ResponseToolkit) {
        const { name, description, image} = request.payload as any;
        const { crop_id } = request.params as any;
        const res = await prisma.cropDisease.create({
            data: {
                name,
                description,
                image,
                crop: {
                    connect: {
                        id: parseInt(crop_id)
                    }
                }
            }
        });
        return res;
    }

    public static async put(request: Request, response: ResponseToolkit) {
        const { id, crop_id } = request.params as any;
        const { name, description, image} = request.payload as any;
        const res = await prisma.cropDisease.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name,
                description,
                image,
                crop: {
                    connect: {
                        id: parseInt(crop_id)
                    }
                }
            }
        });
        return res;
    }

    public static async delete(request: Request, response: ResponseToolkit) {
        const { id } = request.params as any;
        const res = await prisma.cropDisease.delete({
            where: {
                id: parseInt(id)
            }
        });
        return res;
    }
}