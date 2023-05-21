import { Request, ResponseToolkit } from "@hapi/hapi";
import { prisma } from "..";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import AuthUtils from "../utils/auth";
export default class Auth {
  public static async signin(request: Request, response: ResponseToolkit) {
    const { email, phone, password } = request.payload as any;
    const res = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (res) {
      if (await bcrypt.compare(password, res.password!)) {
        const { password, ...user } = res;
        console.log(user);
        const token = await AuthUtils.generateToken(res);
        response.state("token", token);
        return {
          ...user,
          success: true,
          token,
        };
      } else {
        return response
          .response({
            success: false,
            error: "Wrong password",
          })
          .code(400);
      }
    } else {
      return response
        .response({
          success: false,
          error: "Email is not registered",
        })
        .code(400);
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
          password: await bcrypt.hash(password, 10),
        },
      });
    } catch (error) {
      return response
        .response({ error: "Email is already registered" })
        .code(400);
    }
    res.password = null;
    return res;
  }

  public static async logout(request: Request, response: ResponseToolkit) {
    response.unstate("token");
    return {
      success: true,
    };
  }

  public static async check(request: Request, response: ResponseToolkit) {
    const token = request.state.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });
    if (user) {
      const newToken = await AuthUtils.generateToken(user);
      response.state("token", newToken);
      return {
        success: true,
        token: newToken,
      };
    } else {
      return response
        .response({
          success: false,
          error: "User not found",
        })
        .code(400);
    }
  }
}
