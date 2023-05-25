import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
export default class AuthUtils {
  public static async generateToken(user: User, expiresIn = "1h") {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        is_admin: user.is_admin,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h",
        algorithm: "HS256",
      }
    );
  }
}
