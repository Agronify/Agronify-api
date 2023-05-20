import { Request, ResponseToolkit } from "@hapi/hapi";
import { bucket, prisma } from "..";
export default class User{
    public static async get(request: Request, response: ResponseToolkit) {
        const { id } = request.params as any;
        let res;
        if (id) {
            res = await prisma.user.findUnique({
                where: {
                    id: parseInt(id)
                }
            });
            return res;
        }
        res = prisma.user.findMany();
        return res;
    }

    public static async post(request: Request, response: ResponseToolkit) {
        const { name, email, password, phone, is_admin } = request.payload as any;
        const res = await prisma.user.create({
            data: {
                name,
                email,
                phone,
                password,
                is_admin
            }
        });
        return res;
    }

    public static async put(request: Request, response: ResponseToolkit) {
        const { id } = request.params as any;
        const { name, email, password, phone, is_admin } = request.payload as any;
    
        const res = await prisma.user.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name,
                email,
                phone,
                password
            }
        });
        return res;
    }

    public static async delete(request: Request, response: ResponseToolkit) {
        const { id } = request.params as any;
        const res = await prisma.user.delete({
            where: {
                id: parseInt(id)
            }
        });
        return res;
    }
}