import { Request, ResponseToolkit } from "@hapi/hapi";
import { prisma } from "..";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
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
                const { password, ...user } = res;
                console.log(user);
                const token = await jwt.sign({
                    id: user.id,
                    email: user.email,
                    phone: user.phone,
                    name: user.name,
                    is_admin: user.is_admin
                }, process.env.JWT_SECRET!, { 
                    expiresIn: "1h",
                    algorithm: "HS256"
                 });
                return {
                    success: true,
                    token,
                };
            } else {
                return response.response({ 
                    success: false,
                    error: "Wrong password"
                 }).code(400);
            }
        } else {
            return response.response({ 
                success: false,
                error: "Email is not registered"
             }).code(400);
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