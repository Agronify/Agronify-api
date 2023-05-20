import { Request, ResponseToolkit } from "@hapi/hapi";
import { prisma } from "..";
import * as bcrypt from "bcryptjs";
export default class Auth{
    public static async signin(request: Request, response: ResponseToolkit) {
        const { email, phone, password } = request.payload as any;
        const res = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if (res) {
            if (await bcrypt.compare(password, res.password!)) {
                return res;
            } else {
                return response.response({ error: "Password is wrong" }).code(400);
            }
        } else {
            return response.response({ error: "Email is not registered" }).code(400);
        }
    }

    public static async signup(request: Request, response: ResponseToolkit) {
        const { name, email, password, phone } = request.payload as any;
        let res;
        try {
            res = await prisma.user.create({
                data: {
                    name,
                    email,
                    phone,
                    password
                }
            });
        } catch (error) {
            return response.response({ error: "Email is already registered" }).code(400);
        }
        return res;
    }
}