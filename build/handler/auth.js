"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const bcrypt = __importStar(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
const auth_1 = __importDefault(require("../utils/auth"));
class Auth {
    static signin(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, phone, password } = request.payload;
            const res = yield __1.prisma.user.findUnique({
                where: {
                    email,
                },
            });
            if (res) {
                if (yield bcrypt.compare(password, res.password)) {
                    const { password } = res, user = __rest(res, ["password"]);
                    console.log(user);
                    const token = yield auth_1.default.generateToken(res);
                    response.state("token", token);
                    return Object.assign(Object.assign({}, user), { success: true, token });
                }
                else {
                    return response
                        .response({
                        success: false,
                        error: "Wrong password",
                    })
                        .code(400);
                }
            }
            else {
                return response
                    .response({
                    success: false,
                    error: "Email is not registered",
                })
                    .code(400);
            }
        });
    }
    static signup(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, password, phone } = request.payload;
            let res;
            try {
                res = yield __1.prisma.user.create({
                    data: {
                        name,
                        email,
                        phone,
                        password: yield bcrypt.hash(password, 10),
                    },
                });
            }
            catch (error) {
                return response
                    .response({ error: "Email is already registered" })
                    .code(400);
            }
            res.password = null;
            return res;
        });
    }
    static logout(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            response.unstate("token");
            return {
                success: true,
            };
        });
    }
    static check(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = request.state.token;
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = yield __1.prisma.user.findUnique({
                where: {
                    id: decoded.id,
                },
            });
            if (user) {
                const newToken = yield auth_1.default.generateToken(user);
                response.state("token", newToken);
                return {
                    success: true,
                    token: newToken,
                };
            }
            else {
                return response
                    .response({
                    success: false,
                    error: "User not found",
                })
                    .code(400);
            }
        });
    }
}
exports.default = Auth;
