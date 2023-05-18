import { Request, ResponseToolkit } from "@hapi/hapi";
import { prisma } from "..";

export default class Knowledge {
    public static async get(request: Request, response: ResponseToolkit) {
        const { id } = request.params as any;
        let res;
        if (id) {
            res = prisma.knowledge.findUnique({
                where: {
                    id: parseInt(id)
                }
            });
            return res;
        }

        const { search } = request.query as any;
        if (search) {
            res = prisma.knowledge.findMany({
                where: {
                    OR: [
                        {
                            title: {
                                search: search
                            }
                        },
                        {
                            tags: {
                                has: search
                            }
                        }
                    ]
                }
            });
            return res;
        }
        res = prisma.knowledge.findMany();
        return res;
    }

    public static async post(request: Request, response: ResponseToolkit) {
        const { title, content, tags } = request.payload as any;
        const res = prisma.knowledge.create({
            data: {
                title,
                content,
                tags
            }
        });
        return res;
    }
    
    public static async put(request: Request, response: ResponseToolkit) {
        const { id } = request.params as any;
        const { title, content, tags } = request.payload as any;
        const res = prisma.knowledge.update({
            where: {
                id: parseInt(id)
            },
            data: {
                title,
                content,
                tags
            }
        });
        return res;
    }

    public static async delete(request: Request, response: ResponseToolkit) {
        const { id } = request.params as any;
        const res = prisma.knowledge.delete({
            where: {
                id: parseInt(id)
            }
        });
        return res;
    }
}